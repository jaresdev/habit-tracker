import { Request, Response, NextFunction } from 'express'
import { errorHandler } from '../middlewares/errorHandler'
import { ValidationError } from '../utils/ValidationError'
import { NotFoundError } from '../utils/NotFoundError'
import { WebHealthError } from '../utils/WebHealthError'

describe('ErrorHandler middleware Test', () => {
  let req: Partial<Request>
  let res: Partial<Response>
  let next: NextFunction

  beforeEach(() => {
    req = {}
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    next = jest.fn()
  })

  it('should handle Validation error and return status 400', () => {
    const error = new ValidationError('Invalid Input')

    errorHandler(error, req as Request, res as Response, next)

    expect(res.status).toHaveBeenCalledWith(400)

    const responseJson = (res.json as jest.Mock).mock.calls[0][0]
    expect(responseJson.error.message).toBe('Invalid Input')
    expect(responseJson.error.details.service).toBe('Database')
  })

  it('should handle User not found error and return status 404', () => {
    const error = new NotFoundError('User not found.')

    errorHandler(error, req as Request, res as Response, next)

    expect(res.status).toHaveBeenCalledWith(404)

    const responseJson = (res.json as jest.Mock).mock.calls[0][0]
    expect(responseJson.error.message).toBe('User not found.')
    expect(responseJson.error.details.service).toBe('Database')
  })

  it('should handle WebHealthError and return status 500', () => {
    const error = new WebHealthError('Health check failed.')

    errorHandler(error, req as Request, res as Response, next)

    const responseJson = (res.json as jest.Mock).mock.calls[0][0]
    expect(responseJson.error.message).toBe('Health check failed.')
    expect(responseJson.error.details.service).toBe('Website')
    expect(responseJson.error.details.database).toBe('unhealthy')
  })
})
