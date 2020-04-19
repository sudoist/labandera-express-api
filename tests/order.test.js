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

describe('Orders Endpoints', () => {
  it('should create a new order', async () => {
    const login = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'beforetest@email.com',
      password: 'jesterpasswordtestingbefeoreall',
    });

    const res = await request(app)
      .post('/api/order')
      .set('x-access-token', login.body.token)
      .send({
        name: 'Gol D Roger',
        status: 'Order Complete',
        price: '500',
        isPaid: 'Paid',
        dateReceived: '2020-02-02',
        dateReturned: '2020-02-22'
      });
    expect(res.statusCode).toEqual(200)
  })

  it('should generate QR code when creating a new order', async () => {
    const login = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'beforetest@email.com',
      password: 'jesterpasswordtestingbefeoreall',
    });

    const res = await request(app)
      .post('/api/order')
      .set('x-access-token', login.body.token)
      .send({
        name: 'Gol D Roger',
        status: 'Order Complete',
        price: '500',
        isPaid: 'Paid',
        dateReceived: '2020-02-02',
        dateReturned: '2020-02-22'
      });

      await res

      // check if generated qr image exists
      const fs = require('fs')

      const path = './public/images/' + res.body.id + '.png'

      var fileExists = false
      
      fs.access(path, fs.F_OK, (err) => {
        if (err) {
          console.error(err)          
          expect(fileExists).toEqual(true)
        }
      
        //file exists
        fileExists = true        
        expect(fileExists).toEqual(true)
      })
  })

  it('should update existing order', async () => {
    const login = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'beforetest@email.com',
      password: 'jesterpasswordtestingbefeoreall',
    });

    const orderByName = await request(app)
      .get('/api/orderByName/Gol D Roger')
      .set('x-access-token', login.body.token)

    const res = await request(app)
    .post('/api/order')
    .set('x-access-token', login.body.token)
    .send({
      _id: orderByName.body._id,
      name: 'Lor D Twigo Sama',
      status: 'Washing in progress',
      price: '369',
      isPaid: 'NA',
      dateReceived: '2020-02-02',
    });
    expect(res.statusCode).toEqual(200)
  })

  it('should be able to get a single record by customer name', async () => {
    const login = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'beforetest@email.com',
      password: 'jesterpasswordtestingbefeoreall',
    });

    const orderByName = await request(app)
      .get('/api/orderByName/Gol D Roger')
      .set('x-access-token', login.body.token)
    expect(orderByName.statusCode).toEqual(200)
  })

  it('should be able to get all records by customer name', async () => {
    const login = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'beforetest@email.com',
      password: 'jesterpasswordtestingbefeoreall',
    });

    const ordersByName = await request(app)
      .get('/api/ordersByName/Gol D Roger')
      .set('x-access-token', login.body.token)
    expect(ordersByName.statusCode).toEqual(200)
  })

  it('should be able to get a record by order id', async () => {
    const login = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'beforetest@email.com',
      password: 'jesterpasswordtestingbefeoreall',
    });

    const orderByName = await request(app)
      .get('/api/orderByName/Lor D Twigo Sama')
      .set('x-access-token', login.body.token)

    // Should work even if not authenticated for qr code scanning
    const orderById = await request(app)
      .get('/api/order/' + orderByName.body._id)
    expect(orderById.statusCode).toEqual(200)
  })
})

afterAll(async () => {

  // Drop the test database
  await mongoose.connection.db.dropDatabase(process.env.DB_NAME_FOR_TESTS)
  await mongoose.connection.close()
  await mongoose.disconnect()
})
