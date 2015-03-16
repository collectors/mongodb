
# mongodb

[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![Dependency Status][david-image]][david-url]
[![License][license-image]][license-url]
[![Downloads][downloads-image]][downloads-url]
[![Gittip][gittip-image]][gittip-url]

A writable stream that batches MongoDB inserts.

## API

```js
const Collector_MongoDB = require('collector-mongodb')

const stream = Collector_MongoDB({
  limit: 100, // insert at most 100 documents at a time
  interval: 100, // insert at least every 100ms
})

stream.collection = <your mongodb collection>

stream.write({
  key: 'value'
})
```

### var stream = Collector_MongoDB([options])

Create a writable stream. Options:

- `collection` - collection to write to. You can also set this asynchronously as `stream.collection=collection`
- `limit=1000` - maximum number of documents to insert at a time
- `interval=1000` - minimum interval to insert

### stream.write(doc)

Write an object to the collection.

### stream.flush()

Force an insert into the collection.

[npm-image]: https://img.shields.io/npm/v/collector-mongodb.svg?style=flat-square
[npm-url]: https://npmjs.org/package/collector-mongodb
[github-tag]: http://img.shields.io/github/tag/collectors/mongodb.svg?style=flat-square
[github-url]: https://github.com/collectors/mongodb/tags
[travis-image]: https://img.shields.io/travis/collectors/mongodb.svg?style=flat-square
[travis-url]: https://travis-ci.org/collectors/mongodb
[coveralls-image]: https://img.shields.io/coveralls/collectors/mongodb.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/collectors/mongodb
[david-image]: http://img.shields.io/david/collectors/mongodb.svg?style=flat-square
[david-url]: https://david-dm.org/collectors/mongodb
[license-image]: http://img.shields.io/npm/l/collector-mongodb.svg?style=flat-square
[license-url]: LICENSE
[downloads-image]: http://img.shields.io/npm/dm/collector-mongodb.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/collector-mongodb
[gittip-image]: https://img.shields.io/gratipay/jonathanong.svg?style=flat-square
[gittip-url]: https://gratipay.com/jonathanong/
