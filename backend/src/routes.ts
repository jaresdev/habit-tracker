import type { Request, Response } from 'express'
import { Router } from 'express'
import pool from './db'
import { createUser } from './controllers/usersController'

const router = Router()

router.get('/health', async (req: Request, res: Response) => {
  try {
    const dbCheck = await pool.query('SELECT NOW()')
    const dbStatus = dbCheck.rows[0]?.now ? 'healthy' : 'unhealthy'

    res.json({
      status: 'ok',
      database: dbStatus,
      timestamp: new Date().toISOString(),
    })
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Health check failed:', error.message)
      res.status(500).json({
        status: 'error',
        database: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString(),
      })
    } else {
      console.error('Unknown error:', error)
      res.status(500).json({
        status: 'error',
        database: 'unhealthy',
        error: 'An unknown error occurred',
        timestamp: new Date().toISOString(),
      })
    }
  }
})

router.post('/users', createUser)

export default router
