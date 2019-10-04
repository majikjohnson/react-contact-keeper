const mongoose = require('mongoose');
const config = require('config');

const db = config.get('mongoURI');

const connectDB = async () => {
    try {
        await mongoose.connect(db, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false
        });
        console.log("Connected to DB");
    } catch (error) {
        console.error("DB Connection Failed");
        process.exit(1);
    }
};

module.exports = connectDB;