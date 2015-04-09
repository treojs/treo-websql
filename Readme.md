# treo-websql

Fallback to WebSQL when IndexedDB is not available.

## Installation

    npm install --save treo-websql

Or use standalone build [dist/treo-websql.js](./dist/treo-websql.js).

```html
<script src="treo-websql.js"></script>
<script>
  var db = window.treo('my-db', schema).use(window.treoWebsql());
</script>
```

## Usage

As a [treo](http://treojs.com) plugin:

```js
var treo = require('treo');
var websql = require('treo-websql');

var db = treo('mydb')
db.use(websql());

// works everywhere
db.store('books').get('key').then(function() {});
```

As a standalone library, for example to enable IndexedDB in PhantomJS environment:

```js
if (!window.indexedDB) require('treo-websql').polyfill();
var req = window.indexedDB.open('mydb');
```

## License

MIT
