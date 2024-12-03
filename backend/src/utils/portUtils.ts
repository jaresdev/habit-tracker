import net from 'net'

/**
 * Finds an available port starting from the desired port.
 * @param {number} desiredPort - The port to check or start from.
 * @returns {Promise<number>} - A promise that resolves to an available port.
 */
export function findAvailablePort(
  desiredPort: number,
  attemps: number = 10,
): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = net.createServer()

    server.listen(desiredPort, () => {
      const { port } = server.address() as net.AddressInfo
      server.close(() => resolve(port))
    })

    server.on('error', (err: any) => {
      if (err.code === 'EADDRINUSE') {
        // Retry with another port
        if (attemps > 0) {
          findAvailablePort(0, attemps - 1)
            .then(resolve)
            .catch(reject)
        } else {
          reject(new Error('No available ports after multiple attempts'))
        }
      } else {
        reject(err)
      }
    })
  })
}
