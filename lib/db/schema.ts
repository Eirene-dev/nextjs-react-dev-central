import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  index,
  jsonb,
  date,
  unique,
} from 'drizzle-orm/pg-core'

// 다용도 게시판 — 테이블 1개. page_key 로 향후 에세이 등 다른 페이지에서도 재사용.
export const boardPosts = pgTable(
  'board_posts',
  {
    id: serial('id').primaryKey(),
    pageKey: text('page_key').notNull(), // 예: 'book:judgment-dev'
    type: text('type').notNull(), // 'question' | 'discussion' | 'typo' | 'etc'
    title: text('title'), // 최상위 글만(선택). 답글은 null
    body: text('body').notNull(),
    parentId: integer('parent_id'), // null = 최상위 글, 값 = 답글 대상 id
    authorId: text('author_id').notNull(), // GitHub 숫자 id (세션 스냅샷)
    authorName: text('author_name').notNull(),
    authorAvatar: text('author_avatar'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }), // soft delete
  },
  (t) => [
    index('board_page_created_idx').on(t.pageKey, t.createdAt),
    index('board_parent_idx').on(t.parentId),
  ]
)

export type BoardPost = typeof boardPosts.$inferSelect
export type NewBoardPost = typeof boardPosts.$inferInsert

// 에세이 드래프트 — 관리자 본인 글 자동저장(저장 포맷=마크다운). board_posts 와 독립.
export const essayDrafts = pgTable(
  'essay_drafts',
  {
    id: serial('id').primaryKey(),
    authorId: text('author_id').notNull(), // GitHub 숫자 id (세션)
    title: text('title').notNull().default(''),
    body: text('body').notNull().default(''), // 마크다운
    status: text('status').notNull().default('draft'), // 'draft' | 'published'
    slug: text('slug').unique(), // 발행 시 부여(전역 유일), nullable
    excerpt: text('excerpt'), // 발췌(목록/메타), nullable
    publishedAt: timestamp('published_at', { withTimezone: true }), // 최초 발행 시각, nullable
    viewCount: integer('view_count').notNull().default(0), // 익명 읽은 개수(발행 글)
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index('essay_author_updated_idx').on(t.authorId, t.updatedAt)]
)

export type EssayDraft = typeof essayDrafts.$inferSelect
export type NewEssayDraft = typeof essayDrafts.$inferInsert

// 에세이 조회 로그 — 익명 dedupe 용. (essay_id, ip_hash, day) UNIQUE 로 하루 1회만 카운트.
// ip_hash = sha256(ip + AUTH_SECRET 솔트). 원본 IP 는 저장하지 않음.
export const essayViewLog = pgTable(
  'essay_view_log',
  {
    id: serial('id').primaryKey(),
    essayId: integer('essay_id'), // 발행 글 id
    ipHash: text('ip_hash'),
    day: date('day').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  },
  (t) => [unique('essay_view_log_unique').on(t.essayId, t.ipHash, t.day)]
)

export type EssayViewLog = typeof essayViewLog.$inferSelect
export type NewEssayViewLog = typeof essayViewLog.$inferInsert

// 에세이 작성 원칙 — 관리자별 1행(author_id PK), data = { sections: [{key,label,items[]}] }.
export const essayPrinciples = pgTable('essay_principles', {
  authorId: text('author_id').primaryKey(), // GitHub 숫자 id (세션)
  data: jsonb('data').notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export type EssayPrinciples = typeof essayPrinciples.$inferSelect
