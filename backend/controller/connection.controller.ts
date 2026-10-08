import type { Request, Response } from "express";
import { db } from "../src/test-db";
import { connectionTable, propertyTable } from "../src/db/schema";
import { eq } from "drizzle-orm";

export const connectionRequest = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const propertyId = req.body.propertyId;
    if (!propertyId) {
      return res.status(400).json({ message: "Property ID is required" });
    }

    const [landlord] = await db
      .select({ landLordId: propertyTable.landLordId })
      .from(propertyTable)
      .where(eq(propertyTable.propertyId, propertyId));

    if (!landlord) {
      return res.status(404).json({ message: "Property not found" });
    }

    await db.insert(connectionTable).values({
      landLordId: landlord.landLordId,
      tenatId: userId,
    });

    return res.status(201).json({ message: "Connection request sent" });
  } catch (error) {
    console.log("this error is from connectionRequest catch: ", error);
    return res.status(500).json({ message: "Unable to send connection request" });
  }
};

////you are supose to save the landlord id not the property id
