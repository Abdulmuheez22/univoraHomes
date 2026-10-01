CREATE TABLE "propertiesImg" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"propertyId" uuid NOT NULL,
	"imageUrl" varchar NOT NULL,
	"imagePublicId" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "properties" (
	"propertyId" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"landLordId" uuid NOT NULL,
	"propertyName" varchar NOT NULL,
	"propertyType" varchar NOT NULL,
	"propertyAddress" varchar NOT NULL,
	"city" varchar NOT NULL,
	"state" varchar NOT NULL,
	"totalUnits" varchar NOT NULL,
	"description" varchar NOT NULL,
	"targetRent" varchar NOT NULL
);
--> statement-breakpoint
ALTER TABLE "propertiesImg" ADD CONSTRAINT "propertiesImg_propertyId_properties_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("propertyId");--> statement-breakpoint
ALTER TABLE "properties" ADD CONSTRAINT "properties_landLordId_users_id_fkey" FOREIGN KEY ("landLordId") REFERENCES "users"("id");