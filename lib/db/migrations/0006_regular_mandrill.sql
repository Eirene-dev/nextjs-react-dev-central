CREATE TABLE "essay_comments" (
	"id" serial PRIMARY KEY NOT NULL,
	"essay_id" integer NOT NULL,
	"parent_id" integer,
	"author_id" text NOT NULL,
	"author_provider" text NOT NULL,
	"author_name" text NOT NULL,
	"author_image" text,
	"body" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "essay_comments_essay_created_idx" ON "essay_comments" USING btree ("essay_id","created_at");