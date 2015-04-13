var parseRange = require('idb-range');
var isSafari = typeof window.openDatabase !== 'undefined' &&
    /Safari/.test(navigator.userAgent) &&
    !/Chrome/.test(navigator.userAgent);

var isSupported = !isSafari && !!window.indexedDB;

/**
 * Expose `API`.
 */

exports = module.exports = treoWebsql;
exports.polyfill = polyfill;

/**
 * Create websql polyfill based on:
 * https://github.com/axemclion/IndexedDBShim
 * And fix some polyfill's bugs as:
 *   - multi index support
 *   - compound index
 *
 * @return {Function}
 */

function treoWebsql() {
  if (!isSupported) polyfill();

  return function(db, treo) {
    if (isSupported) return;

    // fix multi index support
    // https://github.com/axemclion/IndexedDBShim/issues/16
    Object.keys(db.stores).forEach(function(storeName) {
      var store = db.store(storeName);
      Object.keys(store.indexes).forEach(function(indexName) {
        var index = store.index(indexName);
        fixIndexSupport(index);
      });
    });
  };
}

/**
 * Enable websql polyfill.
 */

function polyfill() {
  require('./shim');
}

/**
 * Patch `index` to support multi property with websql polyfill.
 *
 * @param {Index} index
 */

function fixIndexSupport(index) {
  index.get = function get(key, cb) {
    console.warn('treo-websql: index is inefficient');
    var result = [];
    var r = parseRange(key);

    this.store.cursor({ iterator: iterator }, function(err) {
      err ? cb(err) : cb(null, index.unique ? result[0] : result);
    });

    function iterator(cursor) {
      var field;
      if (Array.isArray(index.field)) {
        field = index.field.map(function(field) {
          return cursor.value[field];
        });
      } else {
        field = cursor.value[index.field];
      }
      if (index.multi) {
        if (Array.isArray(field)) {
          field.forEach(function(v) {
            if (testValue(v)) result.push(cursor.value);
          });
        }
      } else if (field !== undefined) {
        if (testValue(field)) result.push(cursor.value);
      }
      cursor.continue();
    }

    function testValue(v) {
      if (Array.isArray(v)) {
        var i;
        vLength = v.length;
        for (i = 0; i < vLength; i++) {
          if (!testAgainst(getIfArray(r.lower, i), r.lowerOpen, getIfArray(r.upper, i), r.upperOpen, v[i])) return false;
        }
        return true;
      } else {
        return testAgainst(r.lower, r.lowerOpen, r.upper, r.upperOpen, v);
      }
    }

    function testAgainst(lower, lowerOpen, upper, upperOpen, v) {
      return (((!lowerOpen && v >= lower) || (lowerOpen && v > lower)) && ((!upperOpen && v <= upper) || (upperOpen && v < upper))
        || (upper === undefined && ((!lowerOpen && v >= lower) || (lowerOpen && v > lower)))
        || (lower === undefined && ((!upperOpen && v <= upper) || (upperOpen && v < upper))));
    }

    function getIfArray(arr, i) {
      if (!Array.isArray(arr)) return undefined;
      return arr[i];
    }

  };

  index.count = function count(key, cb) {
    this.get(key, function(err, result) {
      err ? cb(err) : cb(null, (index.unique && result) ? 1 : result.length);
    });
  };
}
