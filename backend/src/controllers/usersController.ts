import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'
import pool from '../db'

interface UserRequestBody {
  username: string
  email: string
  password: string
}

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { username, email, password } = req.body as UserRequestBody
  if (!username || !email || !password) {
    return res.status(400).json({
      error: 'Username, email and password are required',
    })
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
  } catch (error: unknown) {
    // Check error type
    console.error(`Error creating user: ${error}`)
    res.status(500).json({ error: 'Failed to create user' })
  }
}
