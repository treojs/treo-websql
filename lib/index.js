
/**
 * Exports.
 */

exports = module.exports = websql
exports.polyfill = polyfill

/**
 * Enable support of IndexedDB in WebSQL env.
 *
 * @param {Treo} treo
 */

function websql(treo) {
  polyfill()
  if (typeof global.shimIndexedDB == 'undefined') return
  var Index = treo.Index
  var Store = treo.Store
  var Transaction = treo.Transaction
  var request = treo.request
  var parseRange = treo.range
  var indexCursor = Index.prototype.cursor

  /**
   * Support range as an argument:
   * https://github.com/axemclion/IndexedDBShim/issues/202
   */

  Store.prototype.count =
  Index.prototype.count = function(range) {
    return this.getAll(range).then(function(all) {
      return all.length
    })
  }

  /**
   * Support direction=prevunique for non-multi indexes
   * https://github.com/axemclion/IndexedDBShim/issues/204
   */

  Index.prototype.cursor = function(opts) {
    var self = this
    if (opts.direction == 'prevunique' && !self.multi) {
      return this.store._tr('read').then(function(tr) {
        var index = tr.objectStore(self.store.name).index(self.name)
        var req = index.openCursor(parseRange(opts.range), 'prev')
        var keys = {} // count unique keys

        return request(req, iterator)

        function iterator(cursor) {
          if (!keys[cursor.key]) {
            keys[cursor.key] = true
            opts.iterator(cursor)
          } else {
            cursor.continue()
          }
        }
      })
    } else {
      return indexCursor.apply(this, arguments)
    }
  }

  /**
   * Propagate transaction error:
   * https://github.com/axemclion/IndexedDBShim/issues/205
   */

  Transaction.prototype.onerror = function(e) {
    this.status = 'error'
    this.emit('error', e)
    this.db.emit('error', e)
  }
}

function polyfill() {
  if (global.indexedDB) return
  require('indexeddbshim')
  var IDBKeyRange = global.IDBKeyRange

  /**
   * Follow ranges spec.
   * https://github.com/axemclion/IndexedDBShim/issues/212
   */

  IDBKeyRange.lowerBound = function(value, open) {
    return new IDBKeyRange(value, undefined, open || false, true)
  }

  IDBKeyRange.upperBound = function(value, open) {
    return new IDBKeyRange(undefined, value, true, open || false)
  }
}
