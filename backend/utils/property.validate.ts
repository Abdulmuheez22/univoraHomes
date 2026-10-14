import * as z from "zod";

export const PROPERTY_CATEGORIES = [
  "Multi-Family",
  "Hostel",
  "Land",
  "Office space",
  // Kept for the properties that were created before a category was picked.
  "Uncategorized",
] as const;

export const PROPERTY_TYPES = [
  "Multi-Family",
  "Single-Family",
  "Commercial",
  "Duplex",
] as const;

const propertyName = z
  .string()
  .trim()
  .min(10, "Property name must be at least 10 characters")
  .max(120, "Property name must be at most 120 characters");

const address = z
  .string()
  .trim()
  .min(5, "Street address must be at least 5 characters")
  .max(200, "Street address must be at most 200 characters");

const city = z
  .string()
  .trim()
  .min(2, "City must be at least 2 characters")
  .max(100, "City must be at most 100 characters");

const state = z
  .string()
  .trim()
  .min(2, "State is required")
  .max(100, "State must be at most 100 characters");

const description = z
  .string()
  .trim()
  .min(20, "Description must be at least 20 characters")
  .max(1000, "Description must be at most 1000 characters");

/* The column is a varchar, so the value is stored as plain digits ("450000").
   That keeps it parseable — the listing filters and sorts on Number(rent). */
const targetRent = z
  .union([z.string(), z.number()])
  .transform((value) => String(value).replace(/[^\d]/g, ""))
  .refine((value) => value.length > 0, "Target rent is required")
  .refine((value) => Number(value) > 0, "Target rent must be more than zero")
  .refine(
    (value) => Number(value) <= 1_000_000_000,
    "Target rent is higher than this platform allows",
  );

export const addPropertyValidation = z.object({
  propertyName,
  propertyType: z.enum(PROPERTY_TYPES),
  propertyCategory: z.enum(PROPERTY_CATEGORIES),
  address,
  city,
  state,
  description,
  targetRent,
});
