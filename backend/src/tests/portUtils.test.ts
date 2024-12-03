import { findAvailablePort } from '../utils/portUtils'
import net from 'net'

jest.mock('net', () => {
  const originalNet = jest.requireActual('net')
  return {
    ...originalNet,
    createServer: jest.fn(),
  }
})

describe('PortUtils Test', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should return the selected port if it is available', async () => {
    const mockServer = {
      listen: jest.fn((port: number, callback: () => void) => callback()),
      close: jest.fn((callback: () => void) => callback()),
      address: jest.fn(() => ({ port: 3000 })),
      on: jest.fn(),
    }

    ;(net.createServer as jest.Mock).mockReturnValue(mockServer)

    const port = await findAvailablePort(3000)
    expect(port).toBe(3000)

    expect(mockServer.listen).toHaveBeenCalledWith(3000, expect.any(Function))
    expect(mockServer.close).toHaveBeenCalled()
  })

  it('should find an alternative port it is in use', async () => {
    const mockServer = {
      listen: jest.fn((port: number, callback: () => void) => callback()),
      close: jest.fn((callback: () => void) => callback()),
      address: jest.fn(() => ({ port: 3000 })),
      on: jest.fn((event: string, callback: (err: any) => void) => {
        if (event === 'error') {
          callback({ code: 'EADDRINUSE' })
        }
      }),
    }

    ;(net.createServer as jest.Mock).mockReturnValue(mockServer)
    ;(net.createServer as jest.Mock).mockReturnValueOnce({
      ...mockServer,
      address: jest.fn(() => ({ port: 4000 })),
    })

    const port = await findAvailablePort(3000)
    expect(port).toBe(4000)

    expect(mockServer.listen).toHaveBeenCalledWith(3000, expect.any(Function))
    expect(mockServer.on).toHaveBeenCalledWith('error', expect.any(Function))
  })

  it('should handle unexpected errors', async () => {
    const mockServer = {
      listen: jest.fn(),
      close: jest.fn(),
      address: jest.fn(),
      on: jest.fn((event: string, callback: (err: any) => void) => {
        if (event === 'error') {
          callback(new Error('Unexpected error'))
        }
      }),
    }

    ;(net.createServer as jest.Mock).mockReturnValue(mockServer)

    await expect(findAvailablePort(3000)).rejects.toThrow('Unexpected error')

    expect(mockServer.listen).toHaveBeenCalledWith(3000, expect.any(Function))
    expect(mockServer.on).toHaveBeenCalledWith('error', expect.any(Function))
  })
})
