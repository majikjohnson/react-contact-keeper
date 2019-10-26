const request = require('supertest');
const app = require('../../../app');
const mongoMemSvrHelper = require('../../support/mongoMemSvrHelper');
const userTestData = require('../../fixtures/user.data');
const should = require('chai').should();

describe('User routes', () => {
	let mongoServer;

	before(async () => {
		mongoServer = await mongoMemSvrHelper.startServer();
	});

	after(() => {
		mongoMemSvrHelper.stopServer(mongoServer);
	});

	afterEach(() => {
		mongoMemSvrHelper.removeAllUsers();
	});

	describe('POST /api/users/', () => {
		it('should allow the user to register', async () => {
			const { name, email, password } = userTestData.validUser;

			const response = await request(app)
				.post('/api/users/')
				.set('Content-Type', 'application/json')
				.send({ name, email, password });

			response.status.should.be.equal(200);
			response.body.token.should.match(/^[\w-]*\.[\w-]*\.[\w-]*$/);
		});

		it('should not allow a duplicate user to register', async () => {
			const expectedErrMsg = 'User already exists in database';

			const { name, email, password } = userTestData.validUser;
			await mongoMemSvrHelper.insertUser(userTestData.validUser);

			const response = await request(app)
				.post('/api/users/')
				.set('Content-Type', 'application/json')
				.send({ name, email, password });

			response.status.should.equal(400);
			response.body.should.have.property('msg').and.equal(expectedErrMsg);
		});

		it('should return an error if "name" is missing', async () => {
			const expectedErrMsg = 'Name is required';

			const { email, password } = userTestData.validUser;

			const response = await request(app)
				.post('/api/users/')
				.set('Content-Type', 'application/json')
				.send({ email, password });

			response.status.should.equal(400);
			response.body.error[0].should.have.property('msg').and.equal(expectedErrMsg);
		});

		it('should return an error if "password" is missing', async () => {
			const expectedErrMsg ='Please enter a password with 6 or more charaters';

			const { name, email } = userTestData.validUser;

			const response = await request(app)
				.post('/api/users/')
				.set('Content-Type', 'application/json')
				.send({ name, email });

			response.status.should.equal(400);
			response.body.error[0].should.have.property('msg').and.equal(expectedErrMsg);
		});

		it('should return an error if "password" is less than 6 characters', async () => {
			const expectedErrMsg = 'Please enter a password with 6 or more charaters';

			const { name, email, password } = userTestData.tooShortPassword;

			const response = await request(app)
				.post('/api/users/')
				.set('Content-Type', 'application/json')
				.send({ name, email, password });

			response.status.should.equal(400);
			response.body.error[0].should.have.property('msg').and.equal(expectedErrMsg);
		});

		it('should return an error if "email" format is invalid', async () => {
			const expectedErrMsg = 'Please include a valid email';
			
			const { name, email, password } = userTestData.badEmail;

			const response = await request(app)
				.post('/api/users/')
				.set('Content-Type', 'application/json')
				.send({ name, email, password })
				.expect(400);
			
			response.status.should.equal(400);
			response.body.error[0].should.have.property('msg').and.equal(expectedErrMsg);
		});
	});
});
