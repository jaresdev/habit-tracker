import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.test.local' })

import { Pool } from 'pg'

const pool = new Pool({
  user: process.env.DB_TEST_USER,
  host: process.env.DB_TEST_HOST,
  database: process.env.DB_TEST_NAME,
  password: process.env.DB_TEST_PASSWORD,
  port: parseInt(process.env.DB_TEST_PORT || '5432'),
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
