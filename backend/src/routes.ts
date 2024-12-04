import type { NextFunction, Request, Response } from 'express'
import { Router } from 'express'
import pool from './db'
import {
  createUser,
  getAllUsers,
  getUser,
  deleteUser,
  updateUser,
} from './controllers/usersController'
import { createHabit } from './controllers/habitsController'
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

// User routes
router.post('/users', createUser)
router.get('/users', getAllUsers)
router.get('/users/:id', getUser)
router.put('/users/:id', updateUser)
router.delete('/users/:id', deleteUser)

// Habit routes
router.post('/habits', createHabit)

export default router
