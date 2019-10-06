const request = require('supertest');
const app = require('../../../app');
const mongoMemSvrHelper = require('../../support/mongoMemSvrHelper');
const userTestData = require('../../fixtures/user.data');

let mongoServer;

before((done) => {
    mongoServer = mongoMemSvrHelper.startServer();
    done();
});


after(() => {
    mongoMemSvrHelper.stopServer(mongoServer);
});


describe('User routes', () => {
    it('should allow the user to register', (done) => {
        const { name, email, password } = userTestData.validUser;
        request(app).post('/api/users/')
            .set('Accept', 'application/json')
            .send({ name, email, password })
            .expect(200)
            .expect((res) => {
                const token = res.body.token;
                if(!token) throw new Error('Token missing');
                if(!token.match(/^[\w-]*\.[\w-]*\.[\w-]*$/)){
                    throw new Error(`Token format incorrect: ${token}`);
                }
            })
            .end((err, res) => {
                mongoMemSvrHelper.removeAllUsers();
                if (err) return done(err);
                done();
            });
    });

    it('should not allow a duplicate user to register', (done) => {
        const { name, email, password } = userTestData.validUser;
        mongoMemSvrHelper.insertUser(userTestData.validUser);
        request(app).post('/api/users/')
            .set('Accept', 'application/json')
            .send({ name, email,  password })
            .expect(400, {
                msg: 'User already exists in database'
            })
            .end((err, res) => {
                mongoMemSvrHelper.removeAllUsers();
                done();
            });
    });

    it('should return an error if "name" is missing', (done) => {
        const { email, password } = userTestData.validUser;
        const expectedErrMsg = 'Name is required';
        request(app).post('/api/users/')
            .set('Accept', 'application/json')
            .send({ email, password })
            .expect(400)
            .expect((res) => {
                const msg = res.body.error[0].msg;
                if(msg !== expectedErrMsg) {
                    throw new Error(
                        'response does not contain the correct error message' +
                        '\n\tExpected: ' + expectedErrMsg +
                        '\n\tGot: ' + msg
                    );
                }
            })
            .end(function(err, res) {
                if (err) return done(err);
                done();
            });
    });

    it('should return an error if "password" is missing', (done) => {
        const { name, email } = userTestData.validUser;
        const expectedErrMsg = 'Please enter a password with 6 or more charaters';
        request(app).post('/api/users/')
            .set('Accept', 'application/json')
            .send({ name, email })
            .expect(400)
            .expect((res) => {
                const msg = res.body.error[0].msg;
                if(msg !== expectedErrMsg) {
                    throw new Error(
                        'response does not contain the correct error message' +
                        '\n\tExpected: ' + expectedErrMsg +
                        '\n\tGot: ' + msg
                    );
                };
            })
            .end(function(err, res) {
                if (err) return done(err);
                done();
            });
    });

    it('should return an error if "password" is less than 6 characters', (done) => {
        const { name, email, password } = userTestData.tooShortPassword;
        const expectedErrMsg = 'Please enter a password with 6 or more charaters';
        request(app).post('/api/users/')
            .set('Accept', 'application/json')
            .send({ name, email, password })
            .expect(400)
            .expect((res) => {
                const msg = res.body.error[0].msg;
                if(msg !== expectedErrMsg) {
                    throw new Error(
                        'response does not contain the correct error message' +
                        '\n\tExpected: ' + expectedErrMsg +
                        '\n\tGot: ' + msg
                    );
                };
            })
            .end(function(err, res) {
                if (err) return done(err);
                done();
            });
    });

    it('should return an error if "email" format is invalid', (done) => {
        const { name, email, password } = userTestData.badEmail;
        const expectedErrMsg = 'Please include a valid email';
        request(app).post('/api/users/')
            .set('Accept', 'application/json')
            .send({ name, email, password })
            .expect(400)
            .expect((res) => {
                const msg = res.body.error[0].msg;
                if(msg !== expectedErrMsg) {
                    throw new Error(
                        'response does not contain the correct error message' +
                        '\n\tExpected: ' + expectedErrMsg +
                        '\n\tGot: ' + msg
                    );
                };
            })
            .end(function(err, res) {
                if (err) return done(err);
                done();
            });
    });
});
