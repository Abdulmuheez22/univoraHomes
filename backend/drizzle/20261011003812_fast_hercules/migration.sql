ALTER TABLE "properties" ADD COLUMN "propertyCategory" varchar DEFAULT 'Uncategorized' NOT NULL;--> statement-breakpoint
ALTER TABLE "properties" DROP COLUMN "totalUnits";