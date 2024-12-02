import * as dotenv from 'dotenv'
import express from 'express'
import routes from './routes'
import './db'

dotenv.config()

const app = express()

app.use(express.json())

app.use('/api', routes)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
