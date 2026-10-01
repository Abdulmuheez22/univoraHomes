import { db } from './../src/test-db';
import type { Request, Response } from "express";
import { eq } from "drizzle-orm";
import { usersTable, propertyTable } from "../src/db/schema";
import cloudinary from "../config/cloudinary.config";
import { propertiesImgTable } from '../src/db/schema';

export const addProperty = async (req: Request, res: Response) => {
  try {
    console.log("req.body: ", req.body)
    console.log('req.file: ', req.files)
      const body = req.body;
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, req.user.id));

    if (!user) {
      return res.status(401).json({ message: "unauthorized" });
    }

    if (!req.files) {
        return res.status(400).json({ message: "Image is required" });
    }
    
   const files = req.files as Express.Multer.File[];

const results = await Promise.all(
  files.map(
    (file) =>
      new Promise<any>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "properties" }, (err, result) =>
            err ? reject(err) : resolve(result)
          )
          .end(file.buffer);
      })
  )
);  

    const images = results.map((r) => ({
  imageUrl: r.secure_url,
  imagePublicId: r.public_id,
}));


    const [property] = await db.insert(propertyTable).values({
      landLordId: user.id,
      propertyName: body.propertyName,
      propertyType: body.propertyType,
      propertyAddress: body.address,
      city: body.city,
      state: body.state,
      totalUnits: body.totalUnits,
      description: body.description,
      targetRent: body.targetRent
    }).returning({ id: propertyTable.propertyId});

    if (!property) {
  return res.status(500).json({ message: "could not create property" });
}

    await db.insert(propertiesImgTable).values(
        images.map((img: any) => ({ ...img, propertyId: property.id })))

    return res.status(201).json({ message: "property added" });
  } catch (error) {
    console.log("this error is from the addProperty catch: ", error);
    return res.status(500).json({ message: "something went wrong" });
  }
};
