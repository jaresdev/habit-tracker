import request from 'supertest'
import app from '../app'
import pool from '../db'

jest.mock('../db', () => ({
  query: jest.fn(),
}))

describe('HabitController Test', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('Create a habit tests', () => {
    it('should create a habit and return 201', async () => {
      const mockHabit = {
        id: 1,
        user_id: 1,
        name: 'habit1',
        description: 'description',
      }

      ;(pool.query as jest.Mock).mockResolvedValueOnce({ rows: [mockHabit] })

      const res = await request(app).post('/api/habits').send({
        user_id: 1,
        name: 'habit1',
        description: 'description',
      })

      expect(res.status).toBe(201)
      expect(res.body).toEqual(mockHabit)
    })

    it('should return 404 error if a mandatory data is missing', async () => {
      const res = await request(app)
        .post('/api/habits')
        .send({ name: 'habit1' })

      expect(res.status).toBe(400)
      expect(res.body.error.message).toBe('User id and name are required')
    })

    it('should return 503 error if database connection refused', async () => {
      const mockError = new Error('Connection refused')
      mockError.name = 'ECONNREFUSED'
      ;(pool.query as jest.Mock).mockRejectedValueOnce(mockError)

      const res = await request(app).post('/api/habits').send({
        user_id: 1,
        name: 'habit1',
        description: 'description',
      })

      expect(res.status).toBe(503)
    })

    it('should return 500 error if there is an unexpected error', async () => {
      ;(pool.query as jest.Mock).mockRejectedValueOnce(
        new Error('Unexpected error'),
      )

      const res = await request(app).post('/api/habits').send({
        user_id: 1,
        name: 'habit1',
        description: 'description',
      })

      expect(res.status).toBe(500)
      expect(res.body.error).toBe(
        'An unexpected error occurred. Error: Unexpected error',
      )
    })
  })
})
