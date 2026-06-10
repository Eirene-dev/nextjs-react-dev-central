CREATE TABLE "anatomy_vote" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"option" text NOT NULL,
	"voter_token" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "anatomy_vote_unique" UNIQUE("slug","voter_token")
);
--> statement-breakpoint
CREATE INDEX "anatomy_vote_slug_idx" ON "anatomy_vote" USING btree ("slug");