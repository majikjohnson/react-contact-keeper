const MongoClient = require('mongodb').MongoClient;
const config = require('config');

const db = config.get('mongoURI');

const connectDB = async () => {
    try {
        await MongoClient.connect(db, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Connected to DB");
    } catch (error) {
        console.error("DB Connection Failed");
        process.exit(1);
    }
};

module.exports = connectDB;