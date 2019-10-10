const request = require('supertest');
const app = require('../../../app');
const mongoMemSvrHelper = require('../../support/mongoMemSvrHelper');
const userTestData = require('../../fixtures/user.data');
const contactsTestData = require('../../fixtures/contacts.data');
const should = require('chai').should();

describe('Contacts routes', () => {
	let mongoServer;

	before(async () => {
		mongoServer = await mongoMemSvrHelper.startServer();
	});

	after(() => {
		mongoMemSvrHelper.stopServer(mongoServer);
	});

	describe('POST /api/contacts', () => {
		it('should allow a new contact to be created for given user', async () => {
			try {
				const userDbJson = await mongoMemSvrHelper.insertUser(
					userTestData.validUser
				);
				const token = await mongoMemSvrHelper.logInUser(userDbJson);
				const {
					name,
					email,
					phone,
					type,
				} = contactsTestData.validContact;

				const response = await request(app)
					.post('/api/contacts/')
					.set('Content-Type', 'application/json')
					.set('x-auth-token', token)
					.send({ name, email, phone, type });

				response.status.should.equal(200);
				response.body.should.have.property('type').and.equal(type);
				response.body.should.have.property('_id').and.match(/^\w{24}$/);
				response.body.should.have.property('name').and.equal(name);
				response.body.should.have.property('email').and.equal(email);
				response.body.should.have.property('phone').and.equal(phone);
				response.body.should.have
					.property('user')
					.and.equal(userDbJson._id.toString());
				response.body.should.have
					.property('date')
					.and.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
			} catch (error) {
				console.error(error);
				throw error;
			} finally {
				mongoMemSvrHelper.removeAllUsers();
				mongoMemSvrHelper.removeAllContacts();
			}
		});

		it('should return an error if "name" is missing', async () => {
			try {
				const errorMessage = 'Name cannot be empty';
				const userDbJson = await mongoMemSvrHelper.insertUser(
					userTestData.validUser
				);
				const token = await mongoMemSvrHelper.logInUser(userDbJson);
				const { email, phone, type } = contactsTestData.validContact;

				const response = await request(app)
					.post('/api/contacts/')
					.set('Content-Type', 'application/json')
					.set('x-auth-token', token)
					.send({ email, phone, type });

				response.status.should.equal(400);
				response.body.error[0].should.have
					.property('msg')
					.and.equal(errorMessage);
			} catch (error) {
				throw error;
			} finally {
				mongoMemSvrHelper.removeAllUsers();
				mongoMemSvrHelper.removeAllContacts();
			}
		});

		it('should return an error if no parameters are provided', async () => {
			try {
				const errorMessage = 'Name cannot be empty';
				const userDbJson = await mongoMemSvrHelper.insertUser(
					userTestData.validUser
				);
				const token = await mongoMemSvrHelper.logInUser(userDbJson);

				const response = await request(app)
					.post('/api/contacts/')
					.set('Content-Type', 'application/json')
					.set('x-auth-token', token);
				//.send({ email, phone, type });

				response.status.should.equal(400);
				response.body.error[0].should.have
					.property('msg')
					.and.equal(errorMessage);
			} catch (error) {
				throw error;
			} finally {
				mongoMemSvrHelper.removeAllUsers();
				mongoMemSvrHelper.removeAllContacts();
			}
		});

		it('should allow a new contact to be created when "name" is the only parameter provided', async () => {
			try {
				const userDbJson = await mongoMemSvrHelper.insertUser(
					userTestData.validUser
				);
				const token = await mongoMemSvrHelper.logInUser(userDbJson);
				const { name } = contactsTestData.validContact;

				const response = await request(app)
					.post('/api/contacts/')
					.set('Content-Type', 'application/json')
					.set('x-auth-token', token)
					.send({ name });

				response.status.should.equal(200);
				response.body.should.have.property('_id').and.match(/^\w{24}$/);
				response.body.should.have.property('name').and.equal(name);
				response.body.should.have
					.property('user')
					.and.equal(userDbJson._id.toString());
				response.body.should.have
					.property('date')
					.and.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
			} catch (error) {
				console.error(error);
				throw error;
			} finally {
				mongoMemSvrHelper.removeAllUsers();
				mongoMemSvrHelper.removeAllContacts();
			}
		});

		it('should set "type" to "personal" if no type parameter is provided', async () => {
			try {
				const defaultType = 'personal';
				const userDbJson = await mongoMemSvrHelper.insertUser(
					userTestData.validUser
				);
				const token = await mongoMemSvrHelper.logInUser(userDbJson);
				const { name } = contactsTestData.validContact;

				const response = await request(app)
					.post('/api/contacts/')
					.set('Content-Type', 'application/json')
					.set('x-auth-token', token)
					.send({ name });

				response.status.should.equal(200);
				response.body.should.have
					.property('type')
					.and.equal(defaultType);
			} catch (error) {
				console.error(error);
				throw error;
			} finally {
				mongoMemSvrHelper.removeAllUsers();
				mongoMemSvrHelper.removeAllContacts();
			}
		});
	});

	describe('GET /api/contacts', () => {
		it.only('should return a single contact', async () => {
			const userDbJson = await mongoMemSvrHelper.insertUser(
				userTestData.validUser
			);
			userId = userDbJson._id.toString();

			const { name, email, phone, type } = contactsTestData.validContact;

			await mongoMemSvrHelper.insertContacts(
				userId,
				contactsTestData.validContact
			);

			const token = await mongoMemSvrHelper.logInUser(userDbJson);

			const response = await request(app)
				.get('/api/contacts/')
				.set('Content-Type', 'application/json')
				.set('x-auth-token', token);

			response.status.should.equal(200);
			response.body.should.have.lengthOf(1);
			response.body[0].should.have.property('_id').and.match(/^\w{24}$/);
			response.body[0].should.have.property('type').and.equal(type);
			response.body[0].should.have.property('name').and.equal(name);
			response.body[0].should.have.property('email').and.equal(email);
			response.body[0].should.have.property('phone').and.equal(phone);
			response.body[0].should.have
				.property('user')
				.and.equal(userDbJson._id.toString());
			response.body[0].should.have
				.property('date')
				.and.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
		});

		it.skip('should return multiple contacts', async () => {});

		it.skip('should return an error if no contacts have been added', async () => {});

		it.skip('should return an error if user is not logged in', async () => {});
	});
});
