import { pgTable, serial, text, integer, timestamp, index } from 'drizzle-orm/pg-core'

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
