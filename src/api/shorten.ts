import express from 'express'
import { Request } from 'express'
import { DBConnection } from '../db/types'
import { shortenLinkTable as links } from '../db/schema'
import { eq } from 'drizzle-orm'

//  Constants --------------------
const NUMERIC = '0123456789'
const LOWER = 'abcdefghijklmnopqrstuvwxyz'
const CHARSET = NUMERIC + LOWER
const HASH_LENGTH = 10

// Utils --------------------------
const toBaseN = (n: number, charset: string): string => {
  if (n === 0) return charset[0]
  const base = charset.length
  const recurse = (x: number): string =>
    x === 0 ? '' : recurse(Math.floor(x / base)) + charset[x % base]
  return recurse(n)
}

const padHash = (hash: string, length: number, charset: string): string =>
  hash.padStart(length, charset[0])

// Router --------------------------
export default function shortenRouter(db: DBConnection) {
  const router = express.Router()

  router.post('/', async (req: Request<{}, {}, { url: string }>, res) => {
    const offset = await db.$count(links)
    const raw = toBaseN(offset, CHARSET)
    const hash = padHash(raw, HASH_LENGTH, CHARSET)

    const result = await db.insert(links).values({ shortCode: hash, url: req.body.url }).returning()
    return res.status(201).json(result[0])
  })

  router.get('/:shortCode/stats', async (req: Request<{ shortCode: string }>, res) => {
    const result = await db.select().from(links).where(eq(links.shortCode, req.params.shortCode))

    if (result.length === 0) return res.status(404).json({ error: 'shortCode not found' })

    return res.status(200).json(result[0])
  })

  router.delete('/:shortCode', async (req: Request<{ shortCode: string }>, res) => {
    const result = await db
      .update(links)
      .set({ archived: true })
      .where(eq(links.shortCode, req.params.shortCode))
      .returning()

    if (result.length === 0) return res.status(404).json({ error: 'shortCode not found' })

    return res.status(204).json(result[0])
  })

  return router
}
