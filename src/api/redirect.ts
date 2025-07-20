import express from 'express'
import { Request } from 'express'
import { DBConnection } from '../db/types'
import { shortenLinkTable as links } from '../db/schema'
import { eq } from 'drizzle-orm'

// Router --------------------------
export default function shortenRouter(db: DBConnection) {
  const router = express.Router()

  router.get('/:shortCode', async (req: Request<{ shortCode: string }>, res) => {
    const result = await db.select().from(links).where(eq(links.shortCode, req.params.shortCode))

    if (result.length === 0) return res.status(404).json({ error: 'no link found' })

    const link = result[0]
    if (link.archived) return res.status(403).json({ error: 'link archived' })

    await db
      .update(links)
      .set({ hits: link.hits + 1 })
      .where(eq(links.shortCode, req.params.shortCode))

    return res.redirect(302, link.url)
  })

  return router
}
