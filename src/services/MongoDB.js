const { MongoClient } = require('mongodb')
require('dotenv').config()

class MongoDB {
    async connectDatabase() {
        const client = new MongoClient(process.env.MONGO_URI)
        return client
    }

    async collection(database, model) {
        const connection = this.connectDatabase()
        const db = (await connection).db(database)
        return db.collection(model)
    }
}

module.exports = MongoDB