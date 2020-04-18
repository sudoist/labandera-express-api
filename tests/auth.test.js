const mongoose = require('mongoose')

// connect to db
beforeAll( async () => {
  const url = process.env.DB_CONNECTION_TESTS
  await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

  // create a user for testing
  var password = 'jesterpasswordtestingbefeoreall';

  const register = await request(app)
  .post('/api/auth/register')
  .send({
    name: 'User Jester',
    email: 'beforetest@email.com',
    password: password,
  });

})

// for endpoints
const request = require('supertest')
const app = require('../app')

describe('Auth Endpoints', () => {
  it('should be able to create a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test Jester',
        email: 'johncosio@email.com',
        password: 'nodepasswordtesting',
      });
    expect(res.statusCode).toEqual(200)
  })

  it('should be able to login', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'beforetest@email.com',
        password: 'jesterpasswordtestingbefeoreall',
      });
    expect(res.statusCode).toEqual(200)
  })

  it('should not login incorrect credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'beforetest@email.com',
        password: 'jesterpasswordtesdtingbefeoreall',
      });
    expect(res.statusCode).toEqual(401)
  })

  it('should be able to access authorized routes', async () => {
    const register = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test Jester Authorization',
        email: 'johncosio@email.com',
        password: 'nodepasswoAuthorizationrdtesting',
      });

    const res = await request(app)
      .get('/api/auth/me')
      .set('x-access-token', register.body.token);

    expect(res.statusCode).toEqual(200)
  })

  it('should be able to logout', async () => {
    const register = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'beforetest@email.com',
        password: 'jesterpasswordtestingbefeoreall',
      });

    const res = await request(app)
      .get('/api/auth/logout');
      
    expect(res.statusCode).toEqual(200)
  })

})

afterAll(async () => {

  // Drop the test database
  await mongoose.connection.db.dropDatabase(process.env.DB_NAME_FOR_TESTS)
  await mongoose.connection.close()
  await mongoose.disconnect()
})
