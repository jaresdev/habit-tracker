import * as dotenv from 'dotenv'
import express from 'express'
import routes from '../routes'

dotenv.config()

const app = express()

app.use(express.json())
app.use('/api', routes)

export default app
