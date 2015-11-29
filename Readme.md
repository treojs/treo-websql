# treo-websql

> Treo plugin to fallback to WebSQL.

[![](https://img.shields.io/npm/v/treo-websql.svg)](https://npmjs.org/package/treo-websql)
[![](http://img.shields.io/npm/dm/treo-websql.svg)](https://npmjs.org/package/treo-websql)

This module forces [treo](https://github.com/treojs/treo) to use `WebSQL` in `Safari 8-` and when `IndexedDB` is not available.
Also it patches `IE` implementation to support compound indexes.

## Installation

    npm install --save treo-websql

## Usage

```js
import treo from 'treo'
import treoWebsql from 'treo-websql'

// enable indexeddbshim && custom "idb-factory" setup
treoWebsql()

// works everywhere
const db = treo('mydb')
db.books.get('key').then((val) => {})
```

## License

[MIT](./LICENSE)
