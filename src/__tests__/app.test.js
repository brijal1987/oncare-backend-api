const request = require('supertest')
const server = require('../app')

describe('node-fetch get /', () => {
  beforeEach(() => {
    jest.resetModules()
  })

  test('when #heartbeat method succeeds', async (done) => {
    await request(server)
      .get('/heartbeat')
      .expect(200)
      .expect({ status: 'online' })
    done()
  })
})

afterAll(async (done) => {
  // close server conection
  server.close()
  done()
})
