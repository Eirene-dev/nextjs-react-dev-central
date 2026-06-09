CREATE TABLE "essay_view_log" (
	"id" serial PRIMARY KEY NOT NULL,
	"essay_id" integer,
	"ip_hash" text,
	"day" date NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "essay_view_log_unique" UNIQUE("essay_id","ip_hash","day")
);
--> statement-breakpoint
ALTER TABLE "essay_drafts" ADD COLUMN "view_count" integer DEFAULT 0 NOT NULL;