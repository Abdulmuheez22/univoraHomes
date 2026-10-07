CREATE TABLE "connectionTable" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"propertyId" varchar NOT NULL,
	"userId" varchar NOT NULL
);
