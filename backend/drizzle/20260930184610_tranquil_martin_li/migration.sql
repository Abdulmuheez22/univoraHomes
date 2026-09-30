ALTER TABLE "properties" ADD COLUMN "propertyType" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "properties" ALTER COLUMN "totalUnits" SET DATA TYPE integer USING "totalUnits"::integer;