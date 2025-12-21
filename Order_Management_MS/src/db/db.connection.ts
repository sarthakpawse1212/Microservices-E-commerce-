import { DB_URL } from '../config'
import { Pool } from 'pg'
import * as schema from './schema'
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres'

const pool = new Pool({
    connectionString: DB_URL
})

export const DB: NodePgDatabase<typeof schema> = drizzle(pool, {schema})