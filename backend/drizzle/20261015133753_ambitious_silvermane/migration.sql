CREATE TYPE "role" AS ENUM('landlord', 'tenant', 'agent');--> statement-breakpoint
CREATE TABLE "connectionTable" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"landLordId" varchar NOT NULL,
	"tenatId" varchar NOT NULL,
	"propertyId" varchar NOT NULL,
	"requestStatus" varchar NOT NULL
);
--> statement-breakpoint
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
	"propertyCategory" varchar DEFAULT 'Uncategorized' NOT NULL,
	"description" varchar NOT NULL,
	"targetRent" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tenatSavedProp" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"userId" varchar NOT NULL,
	"propertyId" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"fullName" varchar(255) NOT NULL,
	"role" "role" NOT NULL,
	"email" varchar(255) NOT NULL UNIQUE,
	"otp" varchar(255),
	"otpExpiry" timestamp,
	"resetOtp" varchar(255),
	"resetOtpExpiry" timestamp,
	"resetOtpAttempts" integer DEFAULT 0 NOT NULL,
	"isVerified" boolean DEFAULT false NOT NULL,
	"phoneNumber" varchar(20),
	"state" varchar(255),
	"city" varchar(255),
	"password" varchar(255)
);
--> statement-breakpoint
ALTER TABLE "propertiesImg" ADD CONSTRAINT "propertiesImg_propertyId_properties_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("propertyId");--> statement-breakpoint
ALTER TABLE "properties" ADD CONSTRAINT "properties_landLordId_users_id_fkey" FOREIGN KEY ("landLordId") REFERENCES "users"("id");