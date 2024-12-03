import type { NextFunction, Request, Response } from 'express'
import { Router } from 'express'
import pool from './db'
import { createUser, getUser } from './controllers/usersController'
import { WebHealthError } from './utils/WebHealthError'

const router = Router()

router.get(
  '/health',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dbCheck = await pool.query('SELECT NOW()')
      const dbStatus = dbCheck.rows[0]?.now ? 'healthy' : 'unhealthy'

      res.json({
        status: 'ok',
        database: dbStatus,
        timestamp: new Date().toISOString(),
      })
    } catch (error: unknown) {
      next(new WebHealthError('Health check failed.'))
    }
  },
)

router.post('/users', createUser)
router.get('/users/:id', getUser)

export default router
