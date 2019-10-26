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

	afterEach(() => {
		mongoMemSvrHelper.removeAllUsers();
		mongoMemSvrHelper.removeAllContacts();
	});

	describe('POST /api/contacts', () => {
		it('should allow a new contact to be created for given user', async () => {
			const { name, email, phone, type } = contactsTestData.validContact;
			const userDbJson = await mongoMemSvrHelper.insertUser(
				userTestData.validUser
			);
			const token = await mongoMemSvrHelper.logInUser(userDbJson);

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
			response.body.should.have.property('user').and.equal(userDbJson._id.toString());
			response.body.should.have.property('date')
				.and.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
		});

		it('should return an error if "name" is missing', async () => {
			const errorMessage = 'Name cannot be empty';

			const { email, phone, type } = contactsTestData.validContact;
			const userDbJson = await mongoMemSvrHelper.insertUser(
				userTestData.validUser
			);
			const token = await mongoMemSvrHelper.logInUser(userDbJson);

			const response = await request(app)
				.post('/api/contacts/')
				.set('Content-Type', 'application/json')
				.set('x-auth-token', token)
				.send({ email, phone, type });

			response.status.should.equal(400);
			response.body.error[0].should.have.property('msg').and.equal(errorMessage);
		});

		it('should return an error if no parameters are provided', async () => {
			const errorMessage = 'Name cannot be empty';

			const userDbJson = await mongoMemSvrHelper.insertUser(
				userTestData.validUser
			);
			const token = await mongoMemSvrHelper.logInUser(userDbJson);

			const response = await request(app)
				.post('/api/contacts/')
				.set('Content-Type', 'application/json')
				.set('x-auth-token', token);

			response.status.should.equal(400);
			response.body.error[0].should.have.property('msg').and.equal(errorMessage);
		});

		it('should allow a new contact to be created when "name" is the only parameter provided', async () => {
			const { name } = contactsTestData.validContact;

			const userDbJson = await mongoMemSvrHelper.insertUser(
				userTestData.validUser
			);
			const token = await mongoMemSvrHelper.logInUser(userDbJson);

			const response = await request(app)
				.post('/api/contacts/')
				.set('Content-Type', 'application/json')
				.set('x-auth-token', token)
				.send({ name });

			response.status.should.equal(200);
			response.body.should.have.property('_id').and.match(/^\w{24}$/);
			response.body.should.have.property('name').and.equal(name);
			response.body.should.have.property('user').and.equal(userDbJson._id.toString());
			response.body.should.have.property('date')
				.and.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
		});

		it('should set "type" to "personal" if no type parameter is provided', async () => {
			const { name } = contactsTestData.validContact;
			const userDbJson = await mongoMemSvrHelper.insertUser(
				userTestData.validUser
			);
			const token = await mongoMemSvrHelper.logInUser(userDbJson);

			const response = await request(app)
				.post('/api/contacts/')
				.set('Content-Type', 'application/json')
				.set('x-auth-token', token)
				.send({ name });

			response.status.should.equal(200);
			response.body.should.have.property('type').and.equal('personal');
		});
	});

	describe('GET /api/contacts', () => {
		it('should return a single contact', async () => {
			const { name, email, phone, type } = contactsTestData.validContact;
			const userDbJson = await mongoMemSvrHelper.insertUser(
				userTestData.validUser
			);
			const token = await mongoMemSvrHelper.logInUser(userDbJson);
			const userId = userDbJson._id.toString();
			await mongoMemSvrHelper.insertContacts(
				userId,
				contactsTestData.validContact
			);

			const response = await request(app)
				.get('/api/contacts/')
				.set('Content-Type', 'application/json')
				.set('x-auth-token', token);

			response.status.should.equal(200);
			response.body.should.have.lengthOf(1);

			const contact = response.body[0];
			contact.should.have.property('_id').and.match(/^\w{24}$/);
			contact.should.have.property('type').and.equal(type);
			contact.should.have.property('name').and.equal(name);
			contact.should.have.property('email').and.equal(email);
			contact.should.have.property('phone').and.equal(phone);
			contact.should.have.property('user').and.equal(userDbJson._id.toString());
			contact.should.have.property('date')
				.and.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
		});

		it('should return multiple contacts', async () => {
			const userDbJson = await mongoMemSvrHelper.insertUser(
				userTestData.validUser
			);
			userId = userDbJson._id.toString();
			const token = await mongoMemSvrHelper.logInUser(userDbJson);
			const contactsData = [
				contactsTestData.validContact,
				contactsTestData.validContactEmailOnly,
				contactsTestData.validContactNoType,
			];
			await mongoMemSvrHelper.insertContacts(userId, contactsData);
			const contacts = await mongoMemSvrHelper.getAllContacts(userId);

			const response = await request(app)
				.get('/api/contacts/')
				.set('Content-Type', 'application/json')
				.set('x-auth-token', token);

			response.status.should.equal(200);
			response.body.should.have.lengthOf(3);
			//Match some arbatory properties in the JSON array object
			response.body[0].should.have.property('_id').and.match(/^\w{24}$/);
			response.body[0].should.have.property('type').and.equal(contacts[0].type);
			response.body[1].should.have.property('name').and.equal(contacts[1].name);
			response.body[2].should.have.property('email').and.equal(contacts[2].email);
		});

		it('should return an empty response if no contacts are available for the user', async () => {
			const userDbJson = await mongoMemSvrHelper.insertUser(
				userTestData.validUser
			);
			userId = userDbJson._id.toString();
			const token = await mongoMemSvrHelper.logInUser(userDbJson);

			const response = await request(app)
				.get('/api/contacts/')
				.set('Content-Type', 'application/json')
				.set('x-auth-token', token);

			response.status.should.equal(200);
		});

		it('should return an error if user is not logged in', async () => {
			const errorMessage = 'No auth token.  Access Denied.';

			const userDbJson = await mongoMemSvrHelper.insertUser(
				userTestData.validUser
			);
			userId = userDbJson._id.toString();
			await mongoMemSvrHelper.insertContacts(
				userId,
				contactsTestData.validContact
			);

			const response = await request(app)
				.get('/api/contacts/')
				.set('Content-Type', 'application/json');

			response.status.should.equal(401);
			response.body.should.have.property('msg').and.equal(errorMessage);
		});
	});

	describe('PUT /api/contacts/:id', () => {
		it('should update the contact when one field is specified', async () => {
			const newEmail = 'newemail@nascentpixels.io';

			const userDbJson = await mongoMemSvrHelper.insertUser(
				userTestData.validUser
			);
			userId = userDbJson._id.toString();
			const token = await mongoMemSvrHelper.logInUser(userDbJson);
			const { name, phone, type } = contactsTestData.validContact;
			await mongoMemSvrHelper.insertContacts(
				userId,
				contactsTestData.validContact
			);
			const contact = await mongoMemSvrHelper.getAllContacts(userId);

			//update the contact
			const response = await request(app)
				.put(`/api/contacts/${contact[0]._id}`)
				.set('Content-Type', 'application/json')
				.set('x-auth-token', token)
				.send({
					email: newEmail,
				});

			response.status.should.equal(200);
			//check that the email has been updated
			response.body.should.have.property('email').and.equal(newEmail);
			//check that the other fields are still the same
			response.body.should.have.property('_id').and.match(/^\w{24}$/);
			response.body.should.have.property('type').and.equal(type);
			response.body.should.have.property('name').and.equal(name);
			response.body.should.have.property('phone').and.equal(phone);
			response.body.should.have.property('user').and.equal(userDbJson._id.toString());
			response.body.should.have.property('date')
				.and.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
		});

		it('should update the contact when all fields are specified', async () => {
			//setup contact update values
			const newName = contactsTestData.validContact2.name;
			const newEmail = contactsTestData.validContact2.email;
			const newPhone = contactsTestData.validContact2.phone;
			const newType = contactsTestData.validContact2.type;

			const userDbJson = await mongoMemSvrHelper.insertUser(
				userTestData.validUser
			);
			userId = userDbJson._id.toString();
			const token = await mongoMemSvrHelper.logInUser(userDbJson);
			//create a contact for the user that we will update
			await mongoMemSvrHelper.insertContacts(
				userId,
				contactsTestData.validContact
			);
			const contact = await mongoMemSvrHelper.getAllContacts(userId);

			const response = await request(app)
				.put(`/api/contacts/${contact[0]._id}`)
				.set('Content-Type', 'application/json')
				.set('x-auth-token', token)
				.send({
					name: newName,
					email: newEmail,
					phone: newPhone,
					type: newType,
				});

			response.status.should.equal(200);
			//check that the provided properties has been updated
			response.body.should.have.property('email').and.equal(newEmail);
			response.body.should.have.property('type').and.equal(newType);
			response.body.should.have.property('name').and.equal(newName);
			response.body.should.have.property('phone').and.equal(newPhone);
			//check that the other fields are still correct
			response.body.should.have.property('_id').and.equal(contact[0]._id.toString());
			response.body.should.have.property('user').and.equal(contact[0].user.toString());
			response.body.should.have.property('date').and.equal(contact[0].date.toISOString());
		});

		it('should return a "not found" error if the given contact doesn\'t exist', async () => {
			const errorMessage = 'Contact not found';

			//setup data values
			const missingContactId = '000000000000000000000000';
			const newEmail = 'newemail@nascentpixels.io';

			const userDbJson = await mongoMemSvrHelper.insertUser(
				userTestData.validUser
			);
			userId = userDbJson._id.toString();
			const token = await mongoMemSvrHelper.logInUser(userDbJson);

			const response = await request(app)
				.put(`/api/contacts/${missingContactId}`)
				.set('Content-Type', 'application/json')
				.set('x-auth-token', token)
				.send({
					email: newEmail,
				});

			response.status.should.equal(404);
			response.body.should.have.property('msg').and.equal(errorMessage);
		});

		it('should return a "not authorised" error if the user is not logged in', async () => {
			const errorMessage = 'No auth token.  Access Denied.';

			//Set up contact data
			const newEmail = contactsTestData.validContact2.email;

			const userDbJson = await mongoMemSvrHelper.insertUser(
				userTestData.validUser
			);
			userId = userDbJson._id.toString();
			//insert a contact into DB for user
			await mongoMemSvrHelper.insertContacts(
				userId,
				contactsTestData.validContact
			);
			const contact = await mongoMemSvrHelper.getAllContacts(userId);

			const response = await request(app)
				.put(`/api/contacts/${contact[0]._id.toString()}`)
				.set('Content-Type', 'application/json')
				.send({
					email: newEmail,
				});

			response.status.should.equal(401);
			response.body.should.have.property('msg').and.equal(errorMessage);
		});
	});

	describe('DELETE /api/contacts/:id', () => {
		it('should only delete the given contact', async () => {
			const userDbJson = await mongoMemSvrHelper.insertUser(
				userTestData.validUser
			);
			userId = userDbJson._id.toString();
			const token = await mongoMemSvrHelper.logInUser(userDbJson);
			contactsData = [
				contactsTestData.validContact,
				contactsTestData.validContactEmailOnly,
				contactsTestData.validContactNoType,
			];
			await mongoMemSvrHelper.insertContacts(userId, contactsData);
			const originalContacts = await mongoMemSvrHelper.getAllContacts(
				userId
			);

			const response = await request(app)
				.delete(`/api/contacts/${originalContacts[0]._id}`)
				.set('Content-Type', 'application/json')
				.set('x-auth-token', token);

			response.status.should.equal(200);
			response.body.should.have.property('msg').and.equal('Contact Deleted');
			//Check that the correct contact has been deleted from the database
			const updatedContacts = await mongoMemSvrHelper.getAllContacts(userId);
			updatedContacts.should.have.lengthOf(2);
			updatedContacts[0].should.be.eql(originalContacts[1]);
			updatedContacts[1].should.be.eql(originalContacts[2]);
		});

		it('should allow the only contact to be deleted', async () => {
			const userDbJson = await mongoMemSvrHelper.insertUser(
				userTestData.validUser
			);
			const token = await mongoMemSvrHelper.logInUser(userDbJson);
			userId = userDbJson._id.toString();
			await mongoMemSvrHelper.insertContacts(
				userId,
				contactsTestData.validContact
			);
			let contact = await mongoMemSvrHelper.getAllContacts(userId);

			const response = await request(app)
				.delete(`/api/contacts/${contact[0]._id}`)
				.set('Content-Type', 'application/json')
				.set('x-auth-token', token);

			response.status.should.equal(200);
			response.body.should.have.property('msg').and.equal('Contact Deleted');
			//Check that the contact has been deleted from the database
			contact = await mongoMemSvrHelper.getAllContacts(userId);
			contact.should.be.empty;
		});

		it('should return a "not found" error if the given contact doesn\'t exist', async () => {
			const errorMessage = 'Contact not found';

			const missingContactId = '000000000000000000000000';

			const userDbJson = await mongoMemSvrHelper.insertUser(
				userTestData.validUser
			);
			userId = userDbJson._id.toString();
			const token = await mongoMemSvrHelper.logInUser(userDbJson);
			//insert a contact into DB for user
			await mongoMemSvrHelper.insertContacts(
				userId,
				contactsTestData.validContact
			);

			const response = await request(app)
				.delete(`/api/contacts/${missingContactId}`)
				.set('Content-Type', 'application/json')
				.set('x-auth-token', token);

			response.status.should.equal(404);
			response.body.should.have.property('msg').and.equal(errorMessage);
		});

		it('should return a "not authorised" error if the user is not logged in', async () => {
			const errorMessage = 'No auth token.  Access Denied.';

			const userDbJson = await mongoMemSvrHelper.insertUser(
				userTestData.validUser
			);
			userId = userDbJson._id.toString();
			await mongoMemSvrHelper.insertContacts(
				userId,
				contactsTestData.validContact
			);
			const contact = await mongoMemSvrHelper.getAllContacts(userId);

			const response = await request(app)
				.delete(`/api/contacts/${contact[0]._id}`)
				.set('Content-Type', 'application/json');

			response.status.should.equal(401);
			response.body.should.have.property('msg').and.equal(errorMessage);
		});
	});
});
