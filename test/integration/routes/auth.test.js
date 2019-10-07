const request = require('supertest');
const app = require('../../../app');
const mongoMemSvrHelper = require('../../support/mongoMemSvrHelper');
const userTestData = require('../../fixtures/user.data');

describe('Auth routes', () => {
	let mongoServer;

	before(async () => {
		mongoServer = await mongoMemSvrHelper.startServer();
		mongoMemSvrHelper.insertUser(userTestData.validUser);
	});

	after(() => {
		mongoMemSvrHelper.stopServer(mongoServer);
	});

	it('should allow user to log in successfully', async () => {
		const { email, password } = userTestData.validUser;
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
	});

	it('should not allow login if user does not exist', async () => {
		const { email, password } = userTestData.unregisteredUser;
		const expectedErrMsg = "User doesn't exist";
		await request(app)
			.post('/api/auth/')
			.set('Content-Type', 'application/json')
			.send({ email, password })
			.expect(400, {
				msg: expectedErrMsg
			});
	});

	it('should not allow login if email address is not provided', async () => {
		const { password } = userTestData.validUser;
		const expectedErrMsg = 'Please use a valid email address';
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
	});

	it('should not allow login if password is incorrect', async () => {
		const { email } = userTestData.validUser;
		const password = 'BadPassword';
		const expectedErrMsg = 'Incorrect password';
		await request(app)
			.post('/api/auth/')
			.set('Content-Type', 'application/json')
			.send({ email, password })
			.expect(400, {
				msg: expectedErrMsg
			});
	});

	it('should not allow login if password is not provided', async () => {
		const { email } = userTestData.validUser;
		const expectedErrMsg = 'Please enter a password';
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
	});

	it('should not allow login if no credentials are provided', async () => {
		const expectedErrMsg = 'Please use a valid email address';
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
	});
});
