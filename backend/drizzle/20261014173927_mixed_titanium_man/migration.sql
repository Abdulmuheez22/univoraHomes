ALTER TABLE "users"
  ADD COLUMN IF NOT EXISTS "resetOtp" varchar(255),
  ADD COLUMN IF NOT EXISTS "resetOtpExpiry" timestamp,
  ADD COLUMN IF NOT EXISTS "resetOtpAttempts" integer DEFAULT 0;