CREATE TABLE "connectionTable" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"landLordId" varchar NOT NULL,
	"tenatId" varchar NOT NULL,
	"propertyId" varchar NOT NULL,
	"requestStatus" varchar NOT NULL
);