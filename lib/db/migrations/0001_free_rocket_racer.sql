CREATE TABLE "essay_drafts" (
	"id" serial PRIMARY KEY NOT NULL,
	"author_id" text NOT NULL,
	"title" text DEFAULT '' NOT NULL,
	"body" text DEFAULT '' NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "essay_author_updated_idx" ON "essay_drafts" USING btree ("author_id","updated_at");