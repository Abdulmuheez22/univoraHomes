import type { Request, Response } from "express";
import { eq } from "drizzle-orm";
import { db } from "../src/test-db";
import { usersTable, propertyTable } from "../src/db/schema";
import cloudinary from "../config/cloudinary.config";

export const addProperty = async (req: Request, res: Response) => {
  try {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, req.user.id));

    if (!user) {
      return res.status(401).json({ message: "unauthorized" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

   const result: any =  await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "properties",
            transformation: { width: 1200, crop: "limit", quality: "auto" },
          },
          (error, result) => (error ? reject(error) : resolve(result)),
        )
        .end(req.file!.buffer);
    });

    const body = req.body;

    await db.insert(propertyTable).values({
      landLordId: user.id,
      propertyName: body.propertyName,
      propertyType: body.propertyType,
      propertyAddress: body.address,
      city: body.city,
      state: body.state,
      totalUnits: body.totalUnits,
      description: body.description,
      targetRent: body.targetRent,
      imageUrl: result.secure_url,
      imagePublicId: result.public_id
    });

    return res.status(201).json({ message: "property added" });
  } catch (error) {
    console.log("this error is from the addProperty catch: ", error);
    return res.status(500).json({ message: "something went wrong" });
  }
};
