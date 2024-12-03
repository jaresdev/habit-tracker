import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'
import pool from '../db'
import { ValidationError } from '../utils/ValidationError'
import { NotFoundError } from '../utils/NotFoundError'
import { DuplicateError } from '../utils/DuplicateError'
import { EconnRefusedError } from '../utils/EconnRefusedError'

interface UserRequestBody {
  username: string
  email: string
  password: string
}

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { username, email, password } = req.body as UserRequestBody

  if (!username || !email || !password) {
    next(new ValidationError('Username, email and password are required'))
    return
  }

  try {
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)
    const result = await pool.query(
      `INSERT INTO users (username, email, password_hash)
      VALUES ($1, $2, $3) RETURNING id, username, email, created_at`,
      [username, email, passwordHash],
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
      next(res.status(500).json({ error: 'An unexpected error occurred.' }))
    }
  }
}

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { id } = req.params

  if (!id) {
    next(new ValidationError('The parameter id is required.'))
    return
  }

  try {
    const result = await pool.query(
      `SELECT id, username, email FROM users WHERE id=$1`,
      [id],
    )

    const user = result.rows[0]

    if (user) {
      res.status(200).json(result.rows[0])
    } else {
      next(new NotFoundError('User not found.'))
    }
  } catch (error: unknown) {
    next(error)
  }
}
