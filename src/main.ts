import 'dotenv/config'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import express from 'express'
import shortenRouter from './api/shorten'
import redirectRouter from './api/redirect'

const connectionString = process.env.DATABASE_URL
const port = process.env.PORT

async function main() {
  // disable prefetch as it is not supported for "transaction" pool mode
  const client = postgres(connectionString, { prepare: false })
  const db = drizzle(client)

  const app = express()

  app.use(express.json())
  app.use('/shorten', shortenRouter(db))
  app.use('/r', redirectRouter(db))

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
}

main()
