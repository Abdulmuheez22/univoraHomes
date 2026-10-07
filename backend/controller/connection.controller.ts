import type { Request, Response } from "express";
import { db } from "../src/test-db";
import { connectionTable, propertyTable } from "../src/db/schema";
import { eq } from "drizzle-orm";

export const connectionRequest = async (req: Request, res: Response) => {
    try {
        const userId = req.user.id

        if(!userId){return res.status(401).json({message: "Unautorized"})}

        const propertyId = req.body.propertyId

        const [landLordId] = await db.select({landLordId: propertyTable.landLordId}).from(propertyTable).where(eq(propertyTable.propertyId, propertyId)) 

        await db.insert(connectionTable).values({propertyId: propertyId, userId: userId})
        
        return console.log(landLordId)
    } catch (error) {
        console.log("this error is from connectionRequest catch: ", error)
    }
};


////you are supose to save the landlord id not the property id