CREATE TYPE "role" AS ENUM('landlord', 'tenant', 'agent');--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"fullName" varchar(255) NOT NULL,
	"role" "role" NOT NULL,
	"email" varchar(255) NOT NULL UNIQUE,
	"otp" varchar(255),
	"otpExpiry" timestamp,
	"isVerified" boolean DEFAULT false NOT NULL,
	"phoneNumber" varchar(20) NOT NULL UNIQUE,
	"state" varchar(255),
	"city" varchar(255),
	"password" varchar(255) NOT NULL
);
