import * as dotenv from 'dotenv'
import pool from '../db'

dotenv.config({ path: '.env.test.local' })

beforeEach(() => {
  jest.mock('pg', () => ({
    Pool: jest.fn().mockImplementation(() => ({
      query: jest.fn(),
    })),
  }))
})

describe('Database Connection Test', () => {
  afterAll(() => {
    pool.end()
  })

  it('should connect to the database successfully', async () => {
    const res = await pool.query('SELECT NOW()')
    expect(res).toBeDefined()
    expect(res.rows[0]).toHaveProperty('now')
  })
})

describe('Database configuration Test', () => {
  it('shout correctly configure the connection pool', () => {
    expect(pool).toBeDefined()
  })
})
