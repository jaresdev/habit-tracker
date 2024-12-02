import app from './app'
import logger from './utils/logger'
import { findAvailablePort } from './utils/portUtils'
;(async () => {
  try {
    const port = await findAvailablePort(3000)

    app.listen(port, () => {
      logger.info(`🚀 Server running on port ${port}`)
    })
  } catch (err) {
    logger.error(`❌ Error finding an available port: ${err}`)
  }
})()
