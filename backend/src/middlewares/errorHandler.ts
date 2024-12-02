import { Request, Response, NextFunction } from 'express'
import logger from '../utils/logger'

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const status = err.status || 500

  if (err.name === 'ECONNREFUSED') {
    logger.error('Database connection error: ', err)

    res.status(503).json({
      error: {
        message: 'Service unavailable. Please try again later.',
        code: 'ECONNREFUSED',
        details: {
          service: 'Database',
          timestamp: new Date().toISOString(),
        },
      },
    })
    return
  }

  res.status(status).json({
    error: {
      message: err.message || 'Internal Server Error',
      status,
    },
  })

  if (process.env.NODE_ENV !== 'production') {
    logger.error(err.stack)
  }
}
