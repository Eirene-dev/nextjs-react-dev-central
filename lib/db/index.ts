import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'
import * as schema from './schema'

// 런타임: 풀링/HTTP 연결(RNC_DATABASE_URL). 서버리스에 적합.
const sql = neon(process.env.RNC_DATABASE_URL!)
export const db = drizzle(sql, { schema })
