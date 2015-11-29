import 'indexeddbshim'
import ES6Promise from 'es6-promise'

/**
 * Detect env.
 * https://github.com/kevva/is-safari
 */

const isSafari = navigator.userAgent.match(/Version\/([\d\.]+).*Safari/)
const isIE = navigator.userAgent.indexOf('Trident') !== -1

/**
 * Enable polyfills for treo.
 *
 * @param {Object} [treo]
 */

export default function treoWebsql() {
  ES6Promise.polyfill()

  if (isSafari && getSafariVersion() < 9) {
    console.log(`treo-websql: force Safari ${getSafariVersion()} to use indexeddbshim`) // eslint-disable-line
    global.IDBKeyRange = global.shimIndexedDB.modules.IDBKeyRange
    global.forceIndexedDB = global.shimIndexedDB
  }

  if (isIE) {
    console.log(`treo-websql: force IE to enable compound indexes with indexeddbshim`) // eslint-disable-line
    window.shimIndexedDB.__useShim()
  }
}

function getSafariVersion() {
  return parseInt(isSafari[1], 10)
}
