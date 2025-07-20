import { PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

export type DBConnection = PostgresJsDatabase<Record<string, never>> & {
  $client: postgres.Sql<{}>
}
