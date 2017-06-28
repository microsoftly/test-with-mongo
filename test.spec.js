require('mocha');
const chai = require('chai');
const { TestWithMongo } = require('./dist');
const MongoClient = require('mongodb').MongoClient;

const { expect } = chai;

describe('test with mongo tests!', () => {
    const testDoc = { val: 1 };
    const insertDoc = () => collection.insert(testDoc);
    const getDoc = () => collection.findOne(testDoc);
    const testWithMongo = new TestWithMongo(26016);
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
        const connectionString = testWithMongo.getConnectionString(DB_NAME);
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

    it('clean db actually cleans db', () => {
        return insertDoc()
            .then(getDoc)
            .then((doc) => expect(doc).not.to.be.null)
            .then(() => testWithMongo.dropDb(DB_NAME))
            .then(getDoc)
            .then((doc) => expect(doc).to.be.null);
    })
});


