import dotenv from 'dotenv'
import express from 'express'
import shortenRouter from './api/shorten'
import redirectRouter from './api/redirect'
import authRouter, { authMiddleware } from './api/auth'
import { db } from './db'
import { env } from './env'

dotenv.config({ path: '../.env' })

async function main() {
  const app = express()

  app.use(express.json())
  app.use('/auth', authRouter(db))
  app.use('/shorten', authMiddleware, shortenRouter(db))
  app.use('/r', redirectRouter(db))

  app.listen(env.PORT, () => {
    console.log(`App listening on port ${env.PORT}`)
  })
}

main()
