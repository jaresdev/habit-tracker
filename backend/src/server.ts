import app from './utils/app'
import { findAvailablePort } from './utils/portUtils'
;(async () => {
  try {
    const port = await findAvailablePort(3000)

    app.listen(port, () => {
      console.info(`🚀 Server running on port ${port}`)
    })
  } catch (err) {
    console.error(`Error finding an available port: ${err}`)
  }
})()
