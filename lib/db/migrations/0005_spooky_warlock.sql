CREATE TABLE "essay_reactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"essay_id" integer,
	"reactor_id" text,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "essay_reactions_unique" UNIQUE("essay_id","reactor_id")
);
--> statement-breakpoint
ALTER TABLE "essay_drafts" ADD COLUMN "reaction_count" integer DEFAULT 0 NOT NULL;