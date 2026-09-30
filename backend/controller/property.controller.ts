import type { Request, Response, NextFunction } from "express";
import { db } from "../src/test-db";
import { usersTable } from "../src/db/schema";
import { eq } from "drizzle-orm";


export const addProperty = async (req: Request, res: Response) => {
    try {
        const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.user.id))
        if(!user){ return res.status(401).json({message: 'unautorized'})}

        const propertyData = req.body()
        console.log(`user: ${user}, property: ${propertyData}`)


    } catch (error) {
        console.log("this error is from the appProperty catch: ", error)
        return res.status(500).json("something went wrong")
        
    }   
}




//   propertyId: uuid("propertyId").primaryKey().defaultRandom(),

//     landLordId: uuid("landLordId").notNull().references(()=> usersTable.id),
  
//     propertyName: varchar().notNull(),
  
//     propertyAddress: varchar().notNull(),
  
//     city: varchar().notNull(),
  
//     state: varchar().notNull(),
  
//     totalUnits: varchar().notNull(),
  
//     description: varchar().notNull(),
  
//     targetRent: varchar().notNull()