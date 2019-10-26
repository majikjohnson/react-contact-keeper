const request = require('supertest');
const app = require('../../../app');
const mongoMemSvrHelper = require('../../support/mongoMemSvrHelper');
const userTestData = require('../../fixtures/user.data');
const should = require('chai').should();

describe('Auth routes', () => {
	let mongoServer;

	before(async () => {
		mongoServer = await mongoMemSvrHelper.startServer();
	});

	after(() => {
		mongoMemSvrHelper.stopServer(mongoServer);
	});

	afterEach(async () => {
		mongoMemSvrHelper.removeAllUsers();
	});

	describe('POST /api/auth', () => {
		it('should allow user to log in successfully', async () => {
			const { email, password } = userTestData.validUser;
			await mongoMemSvrHelper.insertUser(userTestData.validUser);

			const response = await request(app)
				.post('/api/auth/')
				.set('Content-Type', 'application/json')
				.send({ email, password });

			response.status.should.equal(200);
			response.body.should.have.property('token').and.match(/^[\w-]*\.[\w-]*\.[\w-]*$/);
		});

		it('should not allow login if user does not exist', async () => {
			const expectedErrMsg = "User doesn't exist";

			const { email, password } = userTestData.unregisteredUser;
			await mongoMemSvrHelper.insertUser(userTestData.validUser);

			const response = await request(app)
				.post('/api/auth/')
				.set('Content-Type', 'application/json')
				.send({ email, password });

			response.status.should.equal(400);
			response.body.should.have.property('msg').and.equal(expectedErrMsg);
		});

		it('should not allow login if email address is not provided', async () => {
			const expectedErrMsg = 'Please use a valid email address';

			const { password } = userTestData.validUser;
			await mongoMemSvrHelper.insertUser(userTestData.validUser);

			const response = await request(app)
				.post('/api/auth/')
				.set('Content-Type', 'application/json')
				.send({ password });

			response.status.should.equal(400);
			response.body.error[0].should.have.property('msg').and.equal(expectedErrMsg);
		});

		it('should not allow login if password is incorrect', async () => {
			const expectedErrMsg = 'Incorrect password';

			const { email } = userTestData.validUser;
			const password = 'BadPassword';
			await mongoMemSvrHelper.insertUser(userTestData.validUser);

			const response = await request(app)
				.post('/api/auth/')
				.set('Content-Type', 'application/json')
				.send({ email, password });

			response.status.should.equal(400);
			response.body.should.have.property('msg').and.equal(expectedErrMsg);
		});

		it('should not allow login if password is not provided', async () => {
			const expectedErrMsg = 'Please enter a password';

			const { email } = userTestData.validUser;
			await mongoMemSvrHelper.insertUser(userTestData.validUser);

			const response = await request(app)
				.post('/api/auth/')
				.set('Content-Type', 'application/json')
				.send({ email });

			response.status.should.equal(400);
			response.body.error[0].should.have.property('msg').and.equal(expectedErrMsg);
		});

		it('should not allow login if no credentials are provided', async () => {
			const expectedErrMsg = 'Please use a valid email address';
			
			await mongoMemSvrHelper.insertUser(userTestData.validUser);

			const response = await request(app)
				.post('/api/auth/')
				.set('Content-Type', 'application/json');

			response.status.should.equal(400);
			response.body.error[0].should.have.property('msg').and.equal(expectedErrMsg);
		});
	});

	describe('GET /api/auth', () => {
		it("should return the user's details (except password) if auth token is present", async () => {
			const userDbJson = await mongoMemSvrHelper.insertUser(
				userTestData.validUser
			);
			const token = await mongoMemSvrHelper.logInUser(userDbJson);

			const response = await request(app)
				.get('/api/auth/')
				.set('Content-Type', 'application/json')
				.set('x-auth-token', token);

			response.status.should.equal(200);
			response.body.user.should.have.property('name').and.equal(userDbJson.name);
			response.body.user.should.have.property('email').and.equal(userDbJson.email);
			response.body.user.should.not.have.property('password');
			response.body.user.should.have.property('_id').and.match(/^\w{24}$/);
			response.body.user.should.have.property('date')
				.and.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
		});

		it('should return an authorisation error if auth token is missing', async () => {
			const errorMessage = 'No auth token.  Access Denied.';
			await mongoMemSvrHelper.insertUser(userTestData.validUser);

			const response = await request(app)
				.get('/api/auth/')
				.set('Content-Type', 'application/json');

			response.status.should.equal(401);
			response.body.should.have.property('msg').and.equal(errorMessage);
		});
	});
});
