import * as fs from 'fs';
import { Db, MongoClient } from 'mongodb';
import * as path from 'path';
import * as rmrf from 'rimraf';

const { MongodHelper } = require('mongodb-prebuilt');

const DEFAULT_PORT = 27017;
const host: string = '127.0.0.1';
const dbPath: string = path.join(__dirname, '__test-with-mongo-test-db__');

/**
 * Simple utility class to allow for easy unit, integration, and component testing
 * with mongo. Manages spinning up instances and can delete dbs by name
 */
export class TestWithMongo {
    private port: number;

    constructor(port?: number) {
        this.port = port || DEFAULT_PORT;
    }

    /**
     * runs rm -rf on the directory containing the mongodb
     * @returns Promise
     */
    public clean(): Promise<any> {
        return new Promise((res: Function, rej: Function) => {
            rmrf(dbPath, (e: Error) => {
                if (e) {
                    return rej(e);
                }

                res();
            });
        });
    }

    /**
     * gets the connection string for the test db with the name dbName
     * @param dbName the name of the test db
     * @returns connectionString
     */
    public getConenctionString(dbName: string): string {
        return `mongodb://${host}:${this.port}/${dbName}`;
    }

    /**
     * starts mongod on the port set in the constructor
     * @returns Promise
     */
    public startMongoServer(): Promise<any> {
        const mongoHelper = new MongodHelper(['--port', this.port.toString(), '--dbpath', dbPath]);

        return this.clean()
            .then(() => fs.mkdirSync(dbPath))
            .then(() => mongoHelper.run());
    }

    /**
     * Drops db with name dbName
     * @param dbName nane of test db to drop
     * @returns Promise
     */
    public dropDb(dbName: string): Promise<any> {
        let db: Db;
        const connectionString = this.getConenctionString(dbName);

        return MongoClient.connect(connectionString)
            .then((retDb: Db) => {
                db = retDb;
            })
            .then(() => db.dropDatabase())
            .then(() => db.close());
    }
}
