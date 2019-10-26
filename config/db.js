const mongoose = require('mongoose');

const dbString = process.env.MONGO_URI;

const connectDB = async () => {
    try {
        await mongoose.connect(dbString, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        });
        console.log("Connected to DB");
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

module.exports = connectDB;