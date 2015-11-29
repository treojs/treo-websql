
/**
 * Detect env.
 * https://github.com/pouchdb/pouchdb/blob/master/lib/adapters/idb/index.js#L969
 */

const ua = typeof navigator !== 'undefined' ? navigator.userAgent : ''
const isIE = ua.indexOf('Trident') !== -1

const isSafari = typeof openDatabase !== 'undefined' &&
  /(Safari|iPhone|iPad|iPod)/.test(navigator.userAgent) &&
  !/Chrome/.test(navigator.userAgent) &&
  !/BlackBerry/.test(navigator.platform)

const isValid = (!isSafari || getSafariVersion() >= 9) // Safari 9 is OK
  && typeof indexedDB !== 'undefined'
  && typeof IDBKeyRange !== 'undefined'

/**
 * Setup "indexeddbshim" and "idb-factory".
 *
 * @param {Object} [treo]
 */

export default function treoWebsql() {
  require('indexeddbshim')

  if (!isValid) {
    console.log(`treo-websql: force browser to use indexeddbshim`) // eslint-disable-line
    global.IDBKeyRange = global.shimIndexedDB.modules.IDBKeyRange
    global.forceIndexedDB = global.shimIndexedDB
  }

  if (isIE) {
    console.log(`treo-websql: force IE to enable compound indexes using indexeddbshim`) // eslint-disable-line
    window.shimIndexedDB.__useShim()
  }
}

/**
 * Get Safari version.
 * https://github.com/kevva/is-safari
 *
 * @return {Number}
 */

function getSafariVersion() {
  return parseInt((ua.match(/Version\/([\d\.]+).*Safari/) || [])[1], 10)
}
