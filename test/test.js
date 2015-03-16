'use strict'

const assert = require('assert')

const Collector = require('..')

let collection

before(function (done) {
  require('mongodb').MongoClient.connect('mongodb://localhost:27017/collector', function (err, db) {
    if (err) return done(err)

    collection = db.collection('test')
    collection.remove(done)
  })
})

it('should pipe all the data', function () {
  let stream = Collector({
    collection: collection
  })

  stream.flush()

  let total = 20000
  let numbers = []
  while (numbers.length < total) numbers.push(numbers.length)

  return Promise.all(numbers.map(function (x) {
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        stream.write({
          value: x
        })
        resolve()
      }, Math.floor(Math.random() * 5000))
    })
  })).then(function () {
    // give time for the stream to flush and the database to insert
    return new Promise(function (resolve) {
      setTimeout(resolve, 2000)
    })
  }).then(function () {
    return new Promise(function (resolve, reject) {
      collection.count(function (err, count) {
        if (err) return reject(err)
        assert.equal(total, count)
        resolve()
      })
    })
  })
})
