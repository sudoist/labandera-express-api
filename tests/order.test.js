const mongoose = require('mongoose')

// connect to db
beforeAll( async (done) => {
  const url = process.env.DB_CONNECTION_TESTS
  await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  done()
})


// for endpoints
const request = require('supertest')
const app = require('../app')

describe('Post Endpoints', () => {
  it('should create a new order', async () => {
    const res = await request(app)
      .post('/api/order')
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

  it('should update existing order', async () => {
    const orderByName = await request(app)
      .get('/api/orderByName/Gol D Roger')

    const res = await request(app)
    .post('/api/order')
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
    const orderByName = await request(app)
      .get('/api/orderByName/Gol D Roger')
    expect(orderByName.statusCode).toEqual(200)
  })

  it('should be able to get all records by customer name', async () => {
    const ordersByName = await request(app)
      .get('/api/ordersByName/Gol D Roger')
    expect(ordersByName.statusCode).toEqual(200)
  })

  it('should be able to get a records by order id', async () => {
    const orderByName = await request(app)
      .get('/api/orderByName/Lor D Twigo Sama')

    const orderById = await request(app)
      .get('/api/order/' + orderByName.body._id)
    expect(orderById.statusCode).toEqual(200)
  })
})

afterAll(async () => {
	await new Promise(resolve => setTimeout(() => resolve(), 500)); // avoid jest open handle error
});
