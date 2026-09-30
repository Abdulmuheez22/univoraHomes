
CREATE TABLE "properties" (
	"propertyId" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"landLordId" uuid NOT NULL,
	"propertyName" varchar NOT NULL,
	"propertyAddress" varchar NOT NULL,
	"city" varchar NOT NULL,
	"state" varchar NOT NULL,
	"totalUnits" varchar NOT NULL,
	"description" varchar NOT NULL,
	"targetRent" varchar NOT NULL
);
--> statement-breakpoint

--> statement-breakpoint
ALTER TABLE "properties" ADD CONSTRAINT "properties_landLordId_users_id_fkey" FOREIGN KEY ("landLordId") REFERENCES "users"("id");