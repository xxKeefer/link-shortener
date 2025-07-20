import { integer, pgTable, text, varchar, timestamp, index, boolean } from 'drizzle-orm/pg-core'

export const shortenLinkTable = pgTable(
  'shorten_link',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    url: text().notNull(),
    shortCode: varchar({ length: 10 }).notNull().unique(),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    hits: integer().notNull().default(0),
    archived: boolean().notNull().default(false),
  },
  (table) => [index('short_code_idx').on(table.shortCode)]
)
