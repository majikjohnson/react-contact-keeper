const request = require('supertest');
const app = require('../../../app');
const mongoMemSvrHelper = require('../../support/mongoMemSvrHelper');
const userTestData = require('../../fixtures/user.data');

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
			await request(app)
				.post('/api/users/')
				.set('Content-Type', 'application/json')
				.send({ name, email, password })
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
		});

		it('should not allow a duplicate user to register', async () => {
			const { name, email, password } = userTestData.validUser;
			await mongoMemSvrHelper.insertUser(userTestData.validUser);
			await request(app)
				.post('/api/users/')
				.set('Content-Type', 'application/json')
				.send({ name, email, password })
				.expect(400, {
					msg: 'User already exists in database',
				});
		});

		it('should return an error if "name" is missing', async () => {
			const { email, password } = userTestData.validUser;
			const expectedErrMsg = 'Name is required';
			await request(app)
				.post('/api/users/')
				.set('Content-Type', 'application/json')
				.send({ email, password })
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
		});

		it('should return an error if "password" is missing', async () => {
			const { name, email } = userTestData.validUser;
			const expectedErrMsg =
				'Please enter a password with 6 or more charaters';
			await request(app)
				.post('/api/users/')
				.set('Content-Type', 'application/json')
				.send({ name, email })
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
		});

		it('should return an error if "password" is less than 6 characters', async () => {
			const { name, email, password } = userTestData.tooShortPassword;
			const expectedErrMsg =
				'Please enter a password with 6 or more charaters';
			await request(app)
				.post('/api/users/')
				.set('Content-Type', 'application/json')
				.send({ name, email, password })
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
		});

		it('should return an error if "email" format is invalid', async () => {
			const { name, email, password } = userTestData.badEmail;
			const expectedErrMsg = 'Please include a valid email';
			await request(app)
				.post('/api/users/')
				.set('Content-Type', 'application/json')
				.send({ name, email, password })
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
		});
	});
});
