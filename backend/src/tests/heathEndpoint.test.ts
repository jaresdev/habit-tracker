import request from 'supertest'
import app from '../app'
import pool from '../db'

jest.mock('../db', () => ({
  query: jest.fn(),
}))

describe('Check website Heath', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should return 200 code and healthy status', async () => {
    ;(pool.query as jest.Mock).mockResolvedValueOnce({
      rows: [{ now: new Date().toISOString() }],
    })

    const res = await request(app).get('/api/health')

    expect(res.status).toBe(200)
    expect(res.body).toEqual({
      status: 'ok',
      database: 'healthy',
      timestamp: expect.any(String),
    })

    expect(pool.query).toHaveBeenCalledWith('SELECT NOW()')
  })

  it('should return 503 error code when unhealthy status', async () => {
    ;(pool.query as jest.Mock).mockRejectedValueOnce(
      new Error('Database unavailable'),
    )

    const res = await request(app).get('/api/health')

    expect(res.status).toBe(503)

    expect(res.body.error.message).toBe('Health check failed.')
    expect(res.body.error.details.service).toBe('Website')
    expect(res.body.error.details.database).toBe('unhealthy')

    expect(pool.query).toHaveBeenCalledWith('SELECT NOW()')
  })
})
