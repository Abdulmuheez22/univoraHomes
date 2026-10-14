import { db } from "../src/test-db.js";
import type { Request, Response } from "express";
import { asc, eq, inArray, and } from "drizzle-orm";
import {
  connectionTable,
  usersTable,
  propertyTable,
  tenantSaveTable,
} from "../src/db/schema.js";
import cloudinary from "../config/cloudinary.config.js";
import { propertiesImgTable } from "../src/db/schema.js";
import { addPropertyValidation } from "../utils/property.validate.js";
import {
  collectFieldErrors,
  summarizeFieldErrors,
} from "../utils/validationErrors.js";

export const addProperty = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, req.user.id));

    if (!user) {
      return res.status(401).json({ message: "unauthorized" });
    }

    const files = (req.files as Express.Multer.File[] | undefined) ?? [];

    // Every field is checked at once so the form can highlight all of them,
    // not just the first problem it runs into.
    const validated = addPropertyValidation.safeParse(body);
    if (!validated.success) {
      const fieldErrors = collectFieldErrors(validated.error);
      return res.status(400).json({
        message: summarizeFieldErrors(fieldErrors),
        errors: fieldErrors,
      });
    }

    if (files.length === 0) {
      return res.status(400).json({
        message: "Add at least one property photo.",
        errors: { photos: "Add at least one property photo." },
      });
    }

    if (files.length > 5) {
      return res.status(400).json({
        message: "A property can have a maximum of 5 photos.",
        errors: { photos: "A property can have a maximum of 5 photos." },
      });
    }

    const results = await Promise.all(
      files.map(
        (file) =>
          new Promise<any>((resolve, reject) => {
            cloudinary.uploader
              .upload_stream({ folder: "properties" }, (err, result) =>
                err ? reject(err) : resolve(result),
              )
              .end(file.buffer);
          }),
      ),
    );

    const images = results.map((r) => ({
      imageUrl: r.secure_url,
      imagePublicId: r.public_id,
    }));

    const [property] = await db
      .insert(propertyTable)
      .values({
        landLordId: user.id,
        propertyName: validated.data.propertyName,
        propertyType: validated.data.propertyType,
        propertyAddress: validated.data.address,
        city: validated.data.city,
        state: validated.data.state,
        propertyCategory: validated.data.propertyCategory,
        description: validated.data.description,
        targetRent: validated.data.targetRent,
      })
      .returning({ id: propertyTable.propertyId });

    if (!property) {
      return res.status(500).json({ message: "could not create property" });
    }

    await db
      .insert(propertiesImgTable)
      .values(images.map((img: any) => ({ ...img, propertyId: property.id })));

    return res
      .status(201)
      .json({ message: "property added", propertyId: property.id });
  } catch (error) {
    console.log("this error is from the addProperty catch: ", error);
    return res.status(500).json({ message: "something went wrong" });
  }
};

export const fetchProperties = async (req: Request, res: Response) => {
  try {
    const requestedLimit = Number(req.query.limit);
    const requestedOffset = Number(req.query.offset);
    const limit =
      Number.isInteger(requestedLimit) && requestedLimit > 0
        ? Math.min(requestedLimit, 50)
        : 12;
    const offset =
      Number.isInteger(requestedOffset) && requestedOffset >= 0
        ? requestedOffset
        : 0;

    const propertyCategory =
      typeof req.query.propertyCategory === "string"
        ? req.query.propertyCategory.trim()
        : "";
    const filters = propertyCategory
      ? eq(propertyTable.propertyCategory, propertyCategory)
      : undefined;

    const properties = await db
      .select()
      .from(propertyTable)
      .where(filters)
      .orderBy(asc(propertyTable.propertyId))
      .limit(limit)
      .offset(offset);

    const ids = properties.map((property) => property.propertyId);

    const images =
      ids.length > 0
        ? await db
            .select({
              propertyId: propertiesImgTable.propertyId,
              imageUrl: propertiesImgTable.imageUrl,
            })
            .from(propertiesImgTable)
            .where(inArray(propertiesImgTable.propertyId, ids))
        : [];

    const frontendProperties = properties.map((p) => ({
      propertyId: p.propertyId,
      propertyName: p.propertyName,
      propertyType: p.propertyType,
      propertyCategory: p.propertyCategory,
      propertyAddress: p.propertyAddress,
      state: p.state,
      city: p.city,
      description: p.description,
      target: p.targetRent,
      propertyImages: images
        .filter((image) => image.propertyId === p.propertyId)
        .map((image) => image.imageUrl),
    }));

    return res.status(200).json({ properties: frontendProperties });
  } catch (error) {
    console.log("this error is from the fetchProperties catch: ", error);
    return res.status(500).json({ message: "Error fetching properties" });
  }
};

export const fetchPropertyById = async (req: Request, res: Response) => {
  try {
    const { propertyId } = req.params;
    if (typeof propertyId !== "string") {
      return res.status(400).json({ message: "A property ID is required" });
    }

    const [property] = await db
      .select()
      .from(propertyTable)
      .where(eq(propertyTable.propertyId, propertyId));

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    const images = await db
      .select({ imageUrl: propertiesImgTable.imageUrl })
      .from(propertiesImgTable)
      .where(eq(propertiesImgTable.propertyId, property.propertyId));

    return res.status(200).json({
      property: {
        propertyId: property.propertyId,
        propertyName: property.propertyName,
        propertyType: property.propertyType,
        propertyCategory: property.propertyCategory,
        propertyAddress: property.propertyAddress,
        state: property.state,
        city: property.city,
        description: property.description,
        target: property.targetRent,
        propertyImages: images.map((image) => image.imageUrl),
      },
    });
  } catch (error) {
    console.log("this error is from the fetchPropertyById catch: ", error);
    return res.status(500).json({ message: "Error fetching property" });
  }
};

export const landLordProperties = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const landlordProperties = await db
      .select()
      .from(propertyTable)
      .where(eq(propertyTable.landLordId, userId));

    const propertyIds = landlordProperties.map((property) => property.propertyId);
    const images = propertyIds.length
      ? await db
          .select({
            propertyId: propertiesImgTable.propertyId,
            imageUrl: propertiesImgTable.imageUrl,
          })
          .from(propertiesImgTable)
          .where(inArray(propertiesImgTable.propertyId, propertyIds))
      : [];

    const frontendProperties = landlordProperties.map((property) => ({
      propertyId: property.propertyId,
      propertyName: property.propertyName,
      propertyType: property.propertyType,
      propertyCategory: property.propertyCategory,
      propertyAddress: property.propertyAddress,
      description: property.description,
      targetRent: property.targetRent,
      state: property.state,
      city: property.city,
      propertyImages: images
        .filter((image) => image.propertyId === property.propertyId)
        .map((image) => image.imageUrl),
    }));

    const summary = {
      totalProperties: landlordProperties.length,
      propertyCategories: new Set(
        landlordProperties.map((property) => property.propertyCategory),
      ).size,
    };

    return res.status(200).json({ properties: frontendProperties, summary });
  } catch (error) {
    console.log("this error is from landLordProperties catch: ", error);
    return res
      .status(500)
      .json({ message: "Error fetching landlord properties" });
  }
};

export const updateLandlordProperty = async (req: Request, res: Response) => {
  const uploadedImages: { secure_url: string; public_id: string }[] = [];

  try {
    const { propertyId } = req.params;
    const userId = req.user.id;
    const body = req.body;
    const requiredFields = [
      "propertyName",
      "propertyType",
      "propertyCategory",
      "address",
      "city",
      "state",
      "description",
      "targetRent",
    ];

    if (typeof propertyId !== "string" || !propertyId) {
      return res.status(400).json({ message: "A property ID is required" });
    }

    const missingField = requiredFields.find(
      (field) =>
        typeof body[field] !== "string" || !body[field].trim(),
    );
    if (missingField) {
      return res.status(400).json({
        message: `${missingField} is required`,
      });
    }
    // Same rule as adding a property: rent is stored as plain digits so the
    // listing can filter and sort on Number(rent).
    const targetRent = body.targetRent.replace(/[^\d]/g, "");
    if (!targetRent || Number(targetRent) <= 0) {
      return res.status(400).json({
        message: "Target rent must be a valid amount",
        errors: { targetRent: "Enter the target rent as a number." },
      });
    }
    if (Number(targetRent) > 1_000_000_000) {
      return res.status(400).json({
        message: "Target rent is higher than this platform allows",
        errors: {
          targetRent: "Target rent is higher than this platform allows.",
        },
      });
    }

    const [property] = await db
      .select({ propertyId: propertyTable.propertyId })
      .from(propertyTable)
      .where(
        and(
          eq(propertyTable.propertyId, propertyId),
          eq(propertyTable.landLordId, userId),
        ),
      );

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    const files = (req.files as Express.Multer.File[] | undefined) ?? [];
    const currentImages = await db
      .select({ id: propertiesImgTable.id })
      .from(propertiesImgTable)
      .where(eq(propertiesImgTable.propertyId, propertyId));

    if (currentImages.length + files.length > 5) {
      return res.status(400).json({
        message: "A property can have a maximum of 5 photos.",
      });
    }

    const uploadResults = await Promise.allSettled(
      files.map(
        (file) =>
          new Promise<{ secure_url: string; public_id: string }>(
            (resolve, reject) => {
              cloudinary.uploader
                .upload_stream({ folder: "properties" }, (error, result) => {
                  if (error) {
                    reject(error);
                  } else if (!result) {
                    reject(new Error("Cloudinary returned no image result"));
                  } else {
                    resolve(result);
                  }
                })
                .end(file.buffer);
            },
          ),
      ),
    );
    const uploadFailure = uploadResults.find(
      (result) => result.status === "rejected",
    );
    uploadedImages.push(
      ...uploadResults.flatMap((result) =>
        result.status === "fulfilled" ? [result.value] : [],
      ),
    );
    if (uploadFailure?.status === "rejected") {
      throw uploadFailure.reason;
    }

    await db.transaction(async (tx) => {
      await tx
        .update(propertyTable)
        .set({
          propertyName: body.propertyName.trim(),
          propertyType: body.propertyType.trim(),
          propertyCategory: body.propertyCategory.trim(),
          propertyAddress: body.address.trim(),
          city: body.city.trim(),
          state: body.state.trim(),
          description: body.description.trim(),
          targetRent,
        })
        .where(
          and(
            eq(propertyTable.propertyId, propertyId),
            eq(propertyTable.landLordId, userId),
          ),
        );

      if (uploadedImages.length > 0) {
        await tx.insert(propertiesImgTable).values(
          uploadedImages.map((image) => ({
            propertyId,
            imageUrl: image.secure_url,
            imagePublicId: image.public_id,
          })),
        );
      }
    });

    return res.status(200).json({ message: "Property updated successfully" });
  } catch (error) {
    const cleanupResults = await Promise.allSettled(
      uploadedImages.map((image) => cloudinary.uploader.destroy(image.public_id)),
    );
    if (cleanupResults.some((result) => result.status === "rejected")) {
      console.error(
        "Some uploaded property images could not be cleaned up after an update failure.",
        cleanupResults,
      );
    }
    console.error("Error updating landlord property:", error);
    return res.status(500).json({ message: "Unable to update property" });
  }
};

export const deleteLandlordProperty = async (req: Request, res: Response) => {
  try {
    const { propertyId } = req.params;
    const userId = req.user.id;

    if (typeof propertyId !== "string" || !propertyId) {
      return res.status(400).json({ message: "A property ID is required" });
    }

    const deletion = await db.transaction(async (tx) => {
      const [property] = await tx
        .select({ propertyId: propertyTable.propertyId })
        .from(propertyTable)
        .where(
          and(
            eq(propertyTable.propertyId, propertyId),
            eq(propertyTable.landLordId, userId),
          ),
        );

      if (!property) return null;

      const images = await tx
        .select({ imagePublicId: propertiesImgTable.imagePublicId })
        .from(propertiesImgTable)
        .where(eq(propertiesImgTable.propertyId, propertyId));

      await tx
        .delete(tenantSaveTable)
        .where(eq(tenantSaveTable.propertyId, propertyId));
      await tx
        .delete(connectionTable)
        .where(eq(connectionTable.propertyId, propertyId));
      await tx
        .delete(propertiesImgTable)
        .where(eq(propertiesImgTable.propertyId, propertyId));
      await tx
        .delete(propertyTable)
        .where(
          and(
            eq(propertyTable.propertyId, propertyId),
            eq(propertyTable.landLordId, userId),
          ),
        );

      return images;
    });

    if (!deletion) {
      return res.status(404).json({ message: "Property not found" });
    }

    const cleanupResults = await Promise.allSettled(
      deletion.map(({ imagePublicId }) =>
        cloudinary.uploader.destroy(imagePublicId),
      ),
    );
    const failedImageCleanup = cleanupResults.filter(
      (result) => result.status === "rejected",
    );
    if (failedImageCleanup.length > 0) {
      console.error(
        `Property ${propertyId} was deleted, but ${failedImageCleanup.length} image(s) could not be removed from Cloudinary.`,
        failedImageCleanup,
      );
    }

    return res.status(200).json({
      message:
        failedImageCleanup.length > 0
          ? "Property deleted, but some photos could not be removed."
          : "Property deleted successfully",
      imageCleanupPending: failedImageCleanup.length > 0,
    });
  } catch (error) {
    console.error("Error deleting landlord property:", error);
    return res.status(500).json({ message: "Unable to delete property" });
  }
};

export const saveProperty = async (req: Request, res: Response) => {
  try {
    // console.log("req.body", req.body)
    // if (!req.body) {
    //   return res.status(400).json({ message: "No Request Read" });
    // }
    const userId = req.user.id;

    const propertyId = req.body.propertyId;

    if (!propertyId) {
      return res.status(400).json({ message: "propertyId is required" });
    }

    const dbSavedProperty = {
      userId: userId,
      propertyId: propertyId,
    };

    await db
      .insert(tenantSaveTable)
      .values(dbSavedProperty)
      .onConflictDoNothing();

    return res.status(200).json({ message: "Property Saved" });
  } catch (error) {
    console.log("this error is fro the saveProperty catch: ", error);
    return res.status(500).json({ message: "Erro saving property" });
  }
};

export const unSaveProperty = async (req: Request, res: Response) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ message: "No Request read" });
    }

    const stringPropertyId = req.params.id.toString();

    // Must be scoped to BOTH the user and the property. Deleting by
    // propertyId alone wipes every other tenant's save for that property.
    await db
      .delete(tenantSaveTable)
      .where(
        and(
          eq(tenantSaveTable.userId, req.user.id),
          eq(tenantSaveTable.propertyId, stringPropertyId),
        ),
      );

    return res.status(200).json({ message: "Property Unsaved" });
  } catch (error) {
    console.log("this error is from unsaveproperty catch: ", error);
    return res.status(500).json({ message: "error unsaving property" });
  }
};
// tenantSaveTable



