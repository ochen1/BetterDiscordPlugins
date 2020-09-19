/**
 * @name UseCustomEmoji
 * @version 1.1.0
 * @description Enables all the emojis, allowing you to link emojis that you don't have access to.
 * ★ This plugin resizes the emoji before sending, so the attached image preview is the same size as the emoji.
 *
 * @website https://github.com/ochen1/BetterDiscordPlugins
 * @source https://raw.githubusercontent.com/ochen1/BetterDiscordPlugins/master/UseCustomEmoji/UseCustomEmoji.plugin.js
 * @invite 7PZcsVK
 * @donate https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=Z87WKG5G9JBYL&item_name=BetterDiscord+Plugin+-+Use+Custom+Emoji+Donation&currency_code=CAD&source=url
 * @authorLink https://github.com/ochen1
 * @authorId 694234706430001222
 */

module.exports = class UseCustomEmoji {
    getName() {
        return "Use Custom Emoji";
    }

    getDescription() {
        return "A plugin to attach emojis as images and make them appear as if they were real emoji by resizing them to the same size as emoji appear prior to sending.";
    }

    getVersion() {
        return "1.1.0";
    }

    getAuthor() {
        return "idontknow";
    }

    load() {
        // Not required, but if the user has ZLibrary installed then support auto update.
        if (window.ZLibrary) {
            window.ZLibrary.PluginUpdater.checkForUpdate(
                this.getName(),
                this.getVersion(),
                "https://raw.githubusercontent.com/ochen1/BetterDiscordPlugins/master/UseCustomEmoji/UseCustomEmoji.plugin.js"
            );
        }
    }

    start() {
        // Make a local backup of the isEmojiDisabled module that we can use ourselves.
        this.isEmojiDisabled = BdApi.findModuleByProps(
            "isEmojiDisabled"
        ).isEmojiDisabled;
        // Patch the module to always return false, because our adjustments ensures that no emoji is disabled.
        this.unpatchNitro = BdApi.monkeyPatch(
            BdApi.findModuleByProps("isEmojiDisabled"),
            "isEmojiDisabled",
            {
                instead: (e) => {
                    return false;
                }
            }
        );
        // We patch the sendMessage module to check for any originally-disabled emoji and enable them.
        this.unpatch = BdApi.monkeyPatch(
            BdApi.findModuleByProps("sendMessage"),
            "sendMessage",
            {
                instead: (e) => {
                    // We parse the message containing ONLY ONE EMOJI with this regex.
                    // Note: having multiple emoji or surrounding text in the message will NOT work!
                    let emote = e.methodArguments[1].content.match(
                        /^<(a)?:([\d\w]+):(\d{18})>$/
                    );
                    if (emote != null) {
                        // We've successfully parsed an emoji.
                        let [content, animated, emojiName, emojiId] = emote;
                        animated = animated == null ? false : true;
                        // Now, we check to see if the emoji was originally disabled.
                        // If the emoji can sent normally, there is no need to send it as an image.
                        if (
                            this.isEmojiDisabled(
                                BdApi.findModuleByProps(
                                    "getCustomEmojiById"
                                ).getCustomEmojiById(emojiId),
                                BdApi.findModuleByProps(
                                    "getChannel"
                                ).getChannel(e.methodArguments[0])
                            )
                        ) {
                            // The emoji is disabled. We need to send it as an image.
                            // We get the URL of the emoji and store it in a variable.
                            let emojiUrl = BdApi.findModuleByProps(
                                "getEmojiURL"
                            ).getEmojiURL({ id: emojiId, animated: animated });
                            // We override the the content of the message with the URL of the emoji.
                            // However, if we just send the plain basic version of the link, the emoji will show up big.
                            // Hence, we must resize the emoji when it is previewed.
                            if (animated) {
                                e.methodArguments[1].content =
                                    "https://images.weserv.nl/emoji.gif?url=https%3A%2F%2Fapi.allorigins.win%2Fraw%3Furl%3D" +
                                    encodeURIComponent(
                                        encodeURIComponent(emojiUrl)
                                    ) +
                                    "&w=48&h=48&output=gif&fit=contain&filename=emoji.gif&n=-1";
                            } else {
                                e.methodArguments[1].content =
                                    "https://images.weserv.nl/?url=https%3A%2F%2Fapi.allorigins.win%2Fraw%3Furl%3D" +
                                    encodeURI(emojiUrl) +
                                    "&w=48&h=48&fit=contain";
                            }
                        }
                    }

                    // Now we have overridden the message content, we can run call the original method to send the link.
                    // Or, if we did not modify the message content, the original message will be sent.
                    e.callOriginalMethod();
                }
            }
        );
    }
    stop() {
        // We need to unpatch the modifications we've made to the sendMessage module after the plugin is disabled.
        this.unpatch();
        // We need to re-disable the emoji after the plugin gets disabled, as they won't work anymore.
        this.unpatchNitro();
    }
};
