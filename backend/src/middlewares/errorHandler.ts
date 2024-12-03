import { Request, Response, NextFunction } from 'express'
import logger from '../utils/logger'

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const status = err.status || 500

  if (err.name === 'EconnRefusedError') {
    if (process.env.NODE_ENV !== 'test')
      logger.error('Database connection error: ', err)

    res.status(err.status).json({
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
  } else if (err.name === 'NotFoundError') {
    if (process.env.NODE_ENV !== 'test')
      logger.error(`Error getting the user: ${err}`)

    res.status(err.status).json({
      error: {
        message: err.message,
        details: {
          service: 'Database',
          timeStamp: new Date().toISOString(),
        },
      },
    })

    return
  } else if (err.name === 'ValidationError') {
    if (process.env.NODE_ENV !== 'test')
      logger.error(`Validation error: ${err.message}`)

    res.status(err.status).json({
      error: {
        message: err.message,
        details: {
          service: 'Database',
          timeStamp: new Date().toISOString(),
        },
      },
    })

    return
  } else if (err.name === 'WebHealthError') {
    if (process.env.NODE_ENV !== 'test')
      logger.error(`Heath check failed: ${err.message}`)

    res.status(err.status).json({
      error: {
        message: err.message,
        details: {
          service: 'Website',
          database: 'unhealthy',
          timeStamp: new Date().toISOString(),
        },
      },
    })

    return
  } else if (err.name === 'DuplicateError') {
    if (process.env.NODE_ENV !== 'test')
      logger.error(`Duplicate key value: ${err.message}`)

    res.status(err.status).json({
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

  if (
    process.env.NODE_ENV !== 'production' &&
    process.env.NODE_ENV !== 'test'
  ) {
    logger.error(err.stack)
  }
}
