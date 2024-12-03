import logger from '../utils/logger'

describe('Logger utility Test', () => {
  let consoleLogSpy: jest.SpyInstance
  let consoleErrorSpy: jest.SpyInstance

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should call console.log with correct params for info()', () => {
    const message = 'This is an info message'

    logger.info(message)

    expect(consoleLogSpy).toHaveBeenCalledWith(message)
  })

  it('should call console.error with correct params for error()', () => {
    const message = 'This is an error message'

    logger.error(message)

    expect(consoleErrorSpy).toHaveBeenCalledWith(message)
  })
})
