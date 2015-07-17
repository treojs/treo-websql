# treo-websql

[![](https://img.shields.io/npm/v/treo-websql.svg)](https://npmjs.org/package/treo-websql)
[![](http://img.shields.io/npm/dm/treo-websql.svg)](https://npmjs.org/package/treo-websql)

Fallback to WebSQL when IndexedDB is not available.

## Installation

    npm install --save treo-websql

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

[MIT](./LICENSE)
