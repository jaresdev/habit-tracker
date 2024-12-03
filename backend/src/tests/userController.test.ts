import request from 'supertest'
import app from '../app'
import pool from '../db'

jest.mock('../db', () => ({
  query: jest.fn(),
}))

describe('UserController Test', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('Create an user tests', () => {
    it('should create an user and return 201', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        created_at: '2024-12-01T00:00:00Z',
      }

      ;(pool.query as jest.Mock).mockResolvedValueOnce({ rows: [mockUser] })

      const response = await request(app).post('/api/users').send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      })

      expect(response.status).toBe(201)
      expect(response.body).toEqual(mockUser)
    })

    it('should return 404 error if a mandatory data is missing', async () => {
      const res = await request(app)
        .post('/api/users')
        .send({ email: 'test@example.com' })

      expect(res.status).toBe(400)
      expect(res.body.error.message).toBe(
        'Username, email and password are required',
      )
    })

    it('should return 409 error if the user already exists', async () => {
      ;(pool.query as jest.Mock).mockRejectedValueOnce({ code: '23505' })

      const response = await request(app).post('/api/users').send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      })

      expect(response.status).toBe(409)
      expect(response.body.error.message).toBe(
        'Duplicate key value violates unique constraint.',
      )
    })

    it('should return 503 error if database connection refused', async () => {
      const mockError = new Error('Connection refused')
      mockError.name = 'ECONNREFUSED'
      ;(pool.query as jest.Mock).mockRejectedValueOnce(mockError)

      const response = await request(app).post('/api/users').send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      })

      expect(response.status).toBe(503)
    })

    it('should return 500 error if there is an unexpected error', async () => {
      ;(pool.query as jest.Mock).mockRejectedValueOnce(
        new Error('Unexpected error'),
      )

      const response = await request(app).post('/api/users').send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      })

      expect(response.status).toBe(500)
      expect(response.body.error).toBe('An unexpected error occurred.')
    })
  })

  describe('Get an user tests', () => {
    it('should return a 404 error if the user does not exists', async () => {
      ;(pool.query as jest.Mock).mockResolvedValueOnce({ rows: [] })

      const response = await request(app).get('/api/users/123')

      expect(response.status).toBe(404)
      expect(response.body.error.message).toBe('User not found.')
    })

    it('should return a 500 error if there is an unexpected error', async () => {
      ;(pool.query as jest.Mock).mockRejectedValueOnce(
        new Error('Unexpected error'),
      )

      const response = await request(app).get('/api/users/123')

      expect(response.status).toBe(500)
      expect(response.body.error.message).toBe('Unexpected error')
    })

    it('should return the user info if the user exists', async () => {
      const mockUser = {
        id: 123,
        username: 'testuser',
        email: 'test@example.com',
      }

      ;(pool.query as jest.Mock).mockResolvedValueOnce({ rows: [mockUser] })

      const response = await request(app).get('/api/users/123')

      expect(response.status).toBe(200)
      expect(response.body).toEqual(mockUser)
    })
  })

  describe('Get many users tests', () => {
    it('should return empty array if there are no users', async () => {
      ;(pool.query as jest.Mock).mockResolvedValueOnce({ rows: [] })

      const response = await request(app).get('/api/users')

      expect(response.status).toBe(200)
      expect(response.body).toEqual([])
    })

    it('should return all users', async () => {
      const mockUsers = [
        {
          username: 'johndoe',
          email: 'johndoe@example.com',
          password: 'securepassword123',
        },
        {
          username: 'jaresdev',
          email: 'jaresdev@example.com',
          password: 'securepassword123',
        },
        {
          username: 'techguru',
          email: 'techguru@example.com',
          password: 'strongpassword1!',
        },
      ]

      ;(pool.query as jest.Mock).mockResolvedValueOnce({ rows: [mockUsers] })

      const response = await request(app).get('/api/users')

      expect(response.status).toBe(200)
      expect(response.body[0].length).toEqual(mockUsers.length)
    })

    it('should return a 500 error if there is an unexpected error', async () => {
      ;(pool.query as jest.Mock).mockRejectedValueOnce(
        new Error('Unexpected error'),
      )

      const response = await request(app).get('/api/users')

      expect(response.status).toBe(500)
      expect(response.body.error.message).toBe('Unexpected error')
    })
  })
})
