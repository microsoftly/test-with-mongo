# Test With Mongo
Programatically spin up a new mongo instance and easily start a test with a clean db

Works on all platforms due to [mongodb-prebuilt](https://www.npmjs.com/package/mongodb-prebuilt)

## Installation
``` npm install --save test-with-mongo ```

## Usage
Import test-with mongo and create a new class instance. The only needed param is the port to run on, which is defaulted to 27017
``` javascript
require('mocha');
const chai = require('chai');
const { TestWithMongo } = require('./dist');
const MongoClient = require('mongodb').MongoClient;

const { expect } = chai;
const PORT = 26016;

describe('test with mongo tests!', () => {
    const testDoc = { val: 1 };
    const insertDoc = () => collection.insert(testDoc);
    const getDoc = () => collection.findOne(testDoc);
    const testWithMongo = new TestWithMongo(PORT);
    const DB_NAME = 'testDb';

    let db;
    let collection

    before(() => {
        return testWithMongo.startMongoServer();
    });

    after(() => {
        return testWithMongo.clean();
    });

    beforeEach(() => {
        const connectionString = testWithMongo.getConenctionString(DB_NAME);
        return MongoClient.connect(connectionString)
            .then((retDb) => db = retDb)
            .then(() => db.createCollection('testCollection'))
            .then((retCollection) => collection = retCollection)
    });

    afterEach(() => {
        return testWithMongo.dropDb(DB_NAME)
    });

    it('Can find a document inserted in a fresh test', () => {
        return insertDoc()
            .then(getDoc)
            .then((doc) => expect(doc).not.to.be.null);
    });

    it('cannot find a document inserted in a previous test', () => {
        return getDoc()
            .then((doc) => expect(doc).to.be.null);
    });
});

```

## Methods
### ``` constructor(port) ```
port is optional
```javascript
const testWithMongo = new TestWithMongo();
```
or
```javascript
const testWithMongo = new TestWithMongo(27017);
```

### ``` testWithMongo.getConenctionString(dbName) ```
returns the connection string for the db 'dbName'

### ``` testWithMongo.startMongoServer() ```
returns a promise that resolves when a new mongod is running

#### comments
* this will delete the contents of any db that may exist from a previous run
  * ```testWithMongo.clean()``` is called to start
* this should only be called once before any tests are run

### ``` testWithMongo.clean() ```
returns a promise that resolves when a db created by test-with-mongo, if any, is deleted

### ``` testWithMongo.dropDb(dbName) ```
returns a promise that resolves when the db with name dbName is dropped

