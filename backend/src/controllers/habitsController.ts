import { Request, Response, NextFunction } from 'express'
import { ValidationError } from '../utils/ValidationError'
import { DuplicateError } from '../utils/DuplicateError'
import { EconnRefusedError } from '../utils/EconnRefusedError'
import pool from '../db'

interface HabitRequestBody {
  user_id: string
  name: string
  description: string
}

export const createHabit = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { user_id, name, description } = req.body as HabitRequestBody

  if (!user_id || !name) {
    next(new ValidationError('User id and name are required'))
    return
  }

  try {
    const result = await pool.query(
      `INSERT INTO habits (user_id, name, description)
      VALUES ($1, $2, $3) RETURNING id, user_id, name, description, created_at`,
      [user_id, name, description],
    )
    res.status(201).json(result.rows[0])
  } catch (error: any) {
    if (error.code === '23505') {
      next(
        new DuplicateError('Duplicate key value violates unique constraint.'),
      )
    } else if (error.name === 'ECONNREFUSED') {
      next(new EconnRefusedError('Database connection refused.'))
    } else {
      next(
        res
          .status(500)
          .json({ error: `An unexpected error occurred. ${error}` }),
      )
    }
  }
}
