/**
 * @name NitroAdblock
 * @version 1.1.0
 * @description Removes the Discord ad for Nitro.
 *
 * @website https://github.com/ochen1/BetterDiscordPlugins
 * @source https://raw.githubusercontent.com/ochen1/BetterDiscordPlugins/master/NitroAdblock/NitroAdblock.plugin.js
 * @invite 7PZcsVK
 * @donate https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=Z87WKG5G9JBYL&item_name=BetterDiscord+Plugin+-+Nitro+Adblock+Donation&currency_code=CAD&source=url
 * @authorLink https://github.com/ochen1
 * @authorId 694234706430001222
 */

module.exports = class NitroAdblock {
  getName () {
    return 'Nitro Adblock'
  }

  getDescription () {
    return 'Prevents Nitro ads from existing in the DMs list.'
  }

  getVersion () {
    return '1.1.0'
  }

  getAuthor () {
    return 'idontknow'
  }

  load () {
    // Not required, but if the user has ZLibrary installed then support auto update.
    if (window.ZLibrary) {
      window.ZLibrary.PluginUpdater.checkForUpdate(
        this.getName(),
        this.getVersion(),
        'https://raw.githubusercontent.com/ochen1/BetterDiscordPlugins/master/NitroAdblock/NitroAdblock.plugin.js'
      )
    }
  }

  isAd (channel) {
    return (channel.href === 'https://discord.com/store')
  }

  removeAds () {
    for (const privateChannel of document.getElementById('private-channels').querySelectorAll('.da-channel')) {
      if (this.isAd(privateChannel)) {
        privateChannel.remove()
      }
    }
  }

  start () {
    this.removeAds()
  }

  stop () {

  }

  observer (changes) {
    for (const addedNode of changes.addedNodes) {
      if (this.isAd(addedNode)) {
        addedNode.remove()
      }
    }
  }
}
