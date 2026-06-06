CREATE TABLE "board_posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"page_key" text NOT NULL,
	"type" text NOT NULL,
	"title" text,
	"body" text NOT NULL,
	"parent_id" integer,
	"author_id" text NOT NULL,
	"author_name" text NOT NULL,
	"author_avatar" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE INDEX "board_page_created_idx" ON "board_posts" USING btree ("page_key","created_at");--> statement-breakpoint
CREATE INDEX "board_parent_idx" ON "board_posts" USING btree ("parent_id");