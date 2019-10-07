const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');

const opts = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true
};

module.exports = {
	startServer: async () => {
		try {
			mongoServer = new MongoMemoryServer();
			const mongoUri = await mongoServer.getConnectionString();
			await mongoose.connect(mongoUri, opts);
			return mongoServer;
		} catch (error) {
			console.error(error);
			throw error;
		}
	},

	stopServer: async mongoServer => {
		await mongoose.disconnect();
		await mongoServer.stop();
	},

	insertUser: async user => {
		try {
			const salt = await bcrypt.genSalt(10);
			user.password = await bcrypt.hash(user.password, salt);
			const newUser = new User(user);
			await newUser.save();
		} catch (error) {
			console.error(error);
			throw error;
		}
	},

	findUser: async user => {
		const email = user.email;

		try {
			const existingUser = await User.findOne({ email });
			return existingUser;
		} catch (error) {
			console.log(error);
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
};
