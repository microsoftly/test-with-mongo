import * as fs from 'fs';
import { Db, MongoClient } from 'mongodb';
import * as path from 'path';
import * as rmrf from 'rimraf';

const { MongodHelper } = require('mongodb-prebuilt');

const host: string = '127.0.0.1';
const dbPath: string = path.join(__dirname, '__test-with-mongo-test-db__');

export class TestWithMongo {
    private port: number;

    constructor(port?: number) {
        this.port = port || 27017;
    }

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

    public getConenctionString(dbName: string): string {
        return `mongodb://${host}:${this.port}/${dbName}`;
    }

    public startMongoServer(): Promise<any> {
        const mongoHelper = new MongodHelper(['--port', this.port.toString(), '--dbpath', dbPath]);

        return this.clean()
            .then(() => fs.mkdirSync(dbPath))
            .then(() => mongoHelper.run());
    }

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
