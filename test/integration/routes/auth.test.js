const request = require('supertest');
const app = require('../../../app');
const mongoMemSvrHelper = require('../../support/mongoMemSvrHelper');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const userTestData = require('../../fixtures/user.data');

describe('Auth routes', () => {
	let mongoServer;

	before(async () => {
		mongoServer = await mongoMemSvrHelper.startServer();
		// Ideally I would like to do the insert here, but can't get it working - the tests start to run before the user is inserted
		// i.e. the call do done() or any other promise returned to mocha from before hook isn't honoured.
		// Therefore need horrible workaround to insert the required data into the database before making the API calls...
	});

	after(() => {
		mongoMemSvrHelper.stopServer(mongoServer);
	});

	describe('POST /api/auth', () => {
		it('should allow user to log in successfully', async () => {
			const { email, password } = userTestData.validUser;
			try {
				await mongoMemSvrHelper.insertUser(userTestData.validUser);
				await request(app)
					.post('/api/auth/')
					.set('Content-Type', 'application/json')
					.send({ email, password })
					.expect(200)
					.expect(res => {
						const token = res.body.token;
						if (!token) throw new Error('Token missing');
						if (!token.match(/^[\w-]*\.[\w-]*\.[\w-]*$/)) {
							throw new Error(
								`Token format incorrect:\n\ttoken: ${token}`
							);
						}
					});
			} catch (error) {
				console.log(error);
				throw error;
			} finally {
				mongoMemSvrHelper.removeAllUsers();
			}
		});

		it('should not allow login if user does not exist', async () => {
			const { email, password } = userTestData.unregisteredUser;
			const expectedErrMsg = "User doesn't exist";
			try {
				await mongoMemSvrHelper.insertUser(userTestData.validUser);
				await request(app)
					.post('/api/auth/')
					.set('Content-Type', 'application/json')
					.send({ email, password })
					.expect(400, {
						msg: expectedErrMsg,
					});
			} catch (error) {
				console.log(error);
				throw error;
			} finally {
				mongoMemSvrHelper.removeAllUsers();
			}
		});

		it('should not allow login if email address is not provided', async () => {
			const { password } = userTestData.validUser;
			const expectedErrMsg = 'Please use a valid email address';
			try {
				await mongoMemSvrHelper.insertUser(userTestData.validUser);
				await request(app)
					.post('/api/auth/')
					.set('Content-Type', 'application/json')
					.send({ password })
					.expect(400)
					.expect(res => {
						const msg = res.body.error[0].msg;
						if (msg !== expectedErrMsg) {
							throw new Error(
								'response does not contain the correct error message' +
									'\n\tExpected: ' +
									expectedErrMsg +
									'\n\tGot: ' +
									msg
							);
						}
					});
			} catch (error) {
				console.log(error);
				throw error;
			} finally {
				mongoMemSvrHelper.removeAllUsers();
			}
		});

		it('should not allow login if password is incorrect', async () => {
			const { email } = userTestData.validUser;
			const password = 'BadPassword';
			const expectedErrMsg = 'Incorrect password';
			try {
				await mongoMemSvrHelper.insertUser(userTestData.validUser);
				await request(app)
					.post('/api/auth/')
					.set('Content-Type', 'application/json')
					.send({ email, password })
					.expect(400, {
						msg: expectedErrMsg,
					});
			} catch (error) {
				console.log(error);
				throw error;
			} finally {
				mongoMemSvrHelper.removeAllUsers();
			}
		});

		it('should not allow login if password is not provided', async () => {
			const { email } = userTestData.validUser;
			const expectedErrMsg = 'Please enter a password';
			try {
				await mongoMemSvrHelper.insertUser(userTestData.validUser);
				await request(app)
					.post('/api/auth/')
					.set('Content-Type', 'application/json')
					.send({ email })
					.expect(400)
					.expect(res => {
						const msg = res.body.error[0].msg;
						if (msg !== expectedErrMsg) {
							throw new Error(
								'response does not contain the correct error message' +
									'\n\tExpected: ' +
									expectedErrMsg +
									'\n\tGot: ' +
									msg
							);
						}
					});
			} catch (error) {
				console.log(error);
				throw error;
			} finally {
				mongoMemSvrHelper.removeAllUsers();
			}
		});

		it('should not allow login if no credentials are provided', async () => {
			const expectedErrMsg = 'Please use a valid email address';
			try {
				await mongoMemSvrHelper.insertUser(userTestData.validUser);
				await request(app)
					.post('/api/auth/')
					.set('Content-Type', 'application/json')
					.expect(400)
					.expect(res => {
						const msg = res.body.error[0].msg;
						if (msg !== expectedErrMsg) {
							throw new Error(
								'response does not contain the correct error message' +
									'\n\tExpected: ' +
									expectedErrMsg +
									'\n\tGot: ' +
									msg
							);
						}
					});
			} catch (error) {
				console.log(error);
				throw error;
			} finally {
				mongoMemSvrHelper.removeAllUsers();
			}
		});
	});

	describe('GET /api/auth', () => {
		it.skip("should return the user's details (except password) if auth token is present", () => {});

		it.skip('should return an authorisation error if auth token is missing', () => {});
	});
});
