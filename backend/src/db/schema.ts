import {
  timestamp,
  boolean,
  pgTable,
  varchar,
  uuid,
  pgEnum,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["landlord", "tenant", "agent"]);

export const usersTable = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),

  fullName: varchar("fullName", { length: 255 }).notNull(),

  role: roleEnum("role").notNull(),

  email: varchar("email", { length: 255 }).notNull().unique(),

  otp: varchar("otp", { length: 255 }),

  otpExpiry: timestamp("otpExpiry"),

  isVerified: boolean("isVerified").default(false).notNull(),

  phoneNumber: varchar("phoneNumber", { length: 20 }).notNull().unique(),

  state: varchar("state", { length: 255 }),

  city: varchar("city", { length: 255 }),

  password: varchar("password", { length: 255 }).notNull(),
});




export const propertyTable = pgTable("properties", {

    propertyId: uuid("propertyId").primaryKey().defaultRandom(),

    landLordId: uuid("landLordId").notNull().references(()=> usersTable.id),
  
    propertyName: varchar().notNull(),
  
    propertyAddress: varchar().notNull(),
  
    city: varchar().notNull(),
  
    state: varchar().notNull(),
  
    totalUnits: varchar().notNull(),
  
    description: varchar().notNull(),
  
    targetRent: varchar().notNull(),
});

// {
//     propertyName: '',
//     propertyType: 'Multi-Family',
//     address: '',
//     city: '',
//     state: '',
//     totalUnits: 1,
//     description: '',
//     targetRent: '',
//   });
