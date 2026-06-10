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
    reactionCount: integer('reaction_count').notNull().default(0), // 익명 👍 개수(발행 글)
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

// 에세이 반응(👍) — 익명 토글. (essay_id, reactor_id) UNIQUE 로 중복 제거 + 토글.
// reactor_id = 클라이언트 localStorage 토큰(crypto.randomUUID). 로그인 불필요.
export const essayReactions = pgTable(
  'essay_reactions',
  {
    id: serial('id').primaryKey(),
    essayId: integer('essay_id'), // 발행 글 id
    reactorId: text('reactor_id'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  },
  (t) => [unique('essay_reactions_unique').on(t.essayId, t.reactorId)]
)

export type EssayReaction = typeof essayReactions.$inferSelect
export type NewEssayReaction = typeof essayReactions.$inferInsert

// 에세이 댓글 — 발행 글당 평면(top-level) 댓글. 작성=로그인 필요, 목록=공개.
// parent_id 는 다음 단계(대댓글)용으로 컬럼만 미리 둠(이번엔 항상 NULL). 작성자 정보는 세션 스냅샷(비정규화).
export const essayComments = pgTable(
  'essay_comments',
  {
    id: serial('id').primaryKey(),
    essayId: integer('essay_id').notNull(), // 발행 글 id
    parentId: integer('parent_id'), // 자기참조(대댓글, 다음 단계) — top-level 은 NULL
    authorId: text('author_id').notNull(), // session.user.id
    authorProvider: text('author_provider').notNull(), // 'github' | 'google'
    authorName: text('author_name').notNull(),
    authorImage: text('author_image'),
    body: text('body').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }), // 소프트 삭제 묘비(답글 있는 top-level)
  },
  (t) => [index('essay_comments_essay_created_idx').on(t.essayId, t.createdAt)]
)

export type EssayComment = typeof essayComments.$inferSelect
export type NewEssayComment = typeof essayComments.$inferInsert

// 에세이 작성 원칙 — 관리자별 1행(author_id PK), data = { sections: [{key,label,items[]}] }.
export const essayPrinciples = pgTable('essay_principles', {
  authorId: text('author_id').primaryKey(), // GitHub 숫자 id (세션)
  data: jsonb('data').notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export type EssayPrinciples = typeof essayPrinciples.$inferSelect

// 해부(Anatomy) 전시 투표 — 익명 1회 투표(변경 불가). (slug, voter_token) UNIQUE 로 중복 차단.
// voter_token = 클라이언트 localStorage 토큰(crypto.randomUUID). slug = Velite anatomy 컬렉션 slug.
// option = 해당 전시의 options[].key 화이트리스트(서버 검증). 로그인 불필요.
export const anatomyVotes = pgTable(
  'anatomy_vote',
  {
    id: serial('id').primaryKey(),
    slug: text('slug').notNull(),
    option: text('option').notNull(),
    voterToken: text('voter_token').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    unique('anatomy_vote_unique').on(t.slug, t.voterToken),
    index('anatomy_vote_slug_idx').on(t.slug),
  ]
)

export type AnatomyVote = typeof anatomyVotes.$inferSelect
export type NewAnatomyVote = typeof anatomyVotes.$inferInsert
