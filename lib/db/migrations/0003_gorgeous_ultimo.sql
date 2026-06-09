ALTER TABLE "essay_drafts" ADD COLUMN "slug" text;--> statement-breakpoint
ALTER TABLE "essay_drafts" ADD COLUMN "excerpt" text;--> statement-breakpoint
ALTER TABLE "essay_drafts" ADD COLUMN "published_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "essay_drafts" ADD CONSTRAINT "essay_drafts_slug_unique" UNIQUE("slug");