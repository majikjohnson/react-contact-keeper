const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('../../models/User');

const opts = { 
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
};

module.exports = {
    startServer: () => {
        mongoServer = new MongoMemoryServer();
        mongoServer
            .getConnectionString()
            .then((mongoUri) => {
                return mongoose.connect(mongoUri, opts, (err) => {
                    if (err) throw err;
                });
            });
        return mongoServer;
    },

    stopServer: async (mongoServer) => {
        await mongoose.disconnect();
        await mongoServer.stop();
    },

    insertUser: async (user) => {
        try {
            const newUser = new User(user);
            await newUser.save();    
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    removeAllUsers: async () => {
        try {
            await User.deleteMany();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}
