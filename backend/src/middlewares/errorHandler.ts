import { Request, Response, NextFunction } from 'express'
import logger from '../utils/logger'
import { timeStamp } from 'console'

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
  } else if (err.name === 'User not found') {
    logger.error(`Error getting the user: ${err}`)

    res.status(404).json({
      error: {
        message: 'User not found.',
        details: {
          servicce: 'Database',
          timeStamp: new Date().toISOString(),
        },
      },
    })

    return
  } else if (err.name === 'ValidationError') {
    logger.error(`Validation error: ${err.message}`)

    res.status(400).json({
      error: {
        message: err.message,
        details: {
          service: 'Database',
          timeStamp: new Date().toISOString(),
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
