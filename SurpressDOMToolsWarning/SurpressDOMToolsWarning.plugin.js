/**
 * @name SurpressDOMToolsWarning
 * @version 1.0.0
 * @description Surpress the common warning "These custom functions on
 * HTMLElement will be removed." from being printed to the console logs.
 *
 * @website https://github.com/ochen1/BetterDiscordPlugins
 * @source https://raw.githubusercontent.com/ochen1/BetterDiscordPlugins/master/SurpressDOMToolsWarning/SurpressDOMToolsWarning.plugin.js
 * @invite 7PZcsVK
 * @donate https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=Z87WKG5G9JBYL&item_name=BetterDiscord+Plugin+-+SurpressDOMToolsWarning+Donation&currency_code=CAD&source=url
 * @authorLink https://github.com/ochen1
 * @authorId 694234706430001222
 */

class SurpressDOMToolsWarning {
  getName () {
    return 'SurpressDOMToolsWarning'
  }

  getDescription () {
    return 'Surpress the common warning "These custom functions on HTMLElement will be removed." from being printed to the console logs.'
  }

  getVersion () {
    return '1.0.0'
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
        'https://raw.githubusercontent.com/ochen1/BetterDiscordPlugins/master/SurpressDOMToolsWarning/SurpressDOMToolsWarning.plugin.js'
      )
    }
  }

  start () {
    this.zeres_warn_old = window.BdApi.getPlugin('ZeresPluginLibrary').Library.Logger.warn
    window.BdApi.getPlugin('ZeresPluginLibrary').Library.Logger.warn = function (module, ...message) {
      if (module !== 'DOMTools' && !message.includes('These custom functions on HTMLElement will be removed.')) {
        this.zeres_warn_old(module, message)
      }
    }
  }

  stop () {
    window.BdApi.getPlugin('ZeresPluginLibrary').Library.Logger.warn = this.zeres_warn_old
  }
}
module.exports = SurpressDOMToolsWarning
