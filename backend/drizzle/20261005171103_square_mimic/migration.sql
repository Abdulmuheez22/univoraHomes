
--> statement-breakpoint
CREATE TABLE "tenatSavedProp" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"userId" varchar NOT NULL,
	"propertyId" varchar NOT NULL
);
