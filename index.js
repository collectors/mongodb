'use strict'

const Writable = require('readable-stream/writable')
const debug = require('debug')('collector-mongodb')
const throttle = require('lodash.throttle')
const inherits = require('util').inherits
const exit = require('exit-then')
const assert = require('assert')

module.exports = Collector

inherits(Collector, Writable)

function Collector(options) {
  if (!(this instanceof Collector)) return new Collector(options)

  const self = this

  options = options || {}
  options.objectMode = true
  Writable.call(this, options)

  if (options.collection) this.collection = options.collection

  // flush to mongodb when 1000 documents are buffered
  this.FLUSH_LIMIT = options.limit || 1000
  // flush to mongodb a minimum of every 1 second
  this.FLUSH_INTERVAL = options.interval || 1000

  // buffer of documents
  this.buffer = []

  // debounced version of flush
  this.flusht = throttle(function () {
    return self.flush()
  }, this.FLUSH_INTERVAL, {
    leading: false,
    trailing: true,
  })

  // flush when the process exits
  exit.push(/* istanbul ignore next*/ function () {
    return self.flush()
  })
}

/**
 * Write a document to the buffer.
 */

Collector.prototype._write = function (doc, NULL, callback) {
  let length = this.buffer.push(doc)
  debug('size: %d', length)

  // force a flush if the buffer size is reached
  if (length >= this.FLUSH_LIMIT) this.flush()
  this.flusht()

  callback()
}

/**
 * Force a flush.
 */

Collector.prototype.flush = function () {
  debug('flushing')
  const docs = this.buffer
  if (!docs.length) return Promise.resolve()
  const collection = this.collection
  assert(collection, '.collection is not defined!')

  this.buffer = []

  return new Promise(function (resolve, reject) {
    collection.insert(docs, {
      w: 0,
    }, function (err) {
      /* istanbul ignore next */
      if (err) return reject(err)
      resolve()
    })
  })
}
