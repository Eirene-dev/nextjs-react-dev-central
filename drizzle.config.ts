import { config } from 'dotenv'
import { defineConfig } from 'drizzle-kit'

// drizzle-kit 은 Next 밖에서 돌므로 .env.local 을 직접 로드.
config({ path: '.env.local' })

// 마이그레이션은 직접 연결(UNPOOLED)로.
export default defineConfig({
  schema: './lib/db/schema.ts',
  out: './lib/db/migrations',
  dialect: 'postgresql',
  dbCredentials: { url: process.env.RNC_DATABASE_URL_UNPOOLED! },
})
