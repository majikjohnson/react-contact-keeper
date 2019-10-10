const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('../../models/User');
const Contact = require('../../models/Contact');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

const opts = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true,
	useFindAndModify: false
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
			return newUser.toJSON();
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

	logInUser: async user => {
		try {
			const exisingUser = await module.exports.findUser(user);

			const payload = {
				user: {
					id: exisingUser.id,
				},
			};

			const token = jwt.sign(payload, config.get('jwtSecret'), {
				expiresIn: 3600,
			});

			return token;
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
	},

	insertContacts: async (id, contactsData) => {
		const allContactData = [].concat(contactsData);
		let dbPromises = [];

		allContactData.forEach((contactData) => {

			const {name, email, phone, type} = contactData;

			const currentContact = new Contact({
				name,
				email,
				phone,
				type,
				user: id
			});
			dbPromises.push(currentContact.save());
			
		});
		await Promise.all(dbPromises);
		return dbPromises;
	},

	getAllContacts: async (userId) => {
		try {
			
			const contacts = await Contact.find({user: userId}).sort({date: -1});
			return contacts;
		} catch (error) {
			console.error(error);
			throw error;
		}
	},

	removeAllContacts: async () => {
		try {
			await Contact.deleteMany();
		} catch (error) {
			console.error(error);
			throw error;
		}
	}
};
