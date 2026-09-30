import type { Request, Response, NextFunction } from "express";
import { db } from "../src/test-db";
import { usersTable } from "../src/db/schema";
import { eq } from "drizzle-orm";
import { propertyTable } from "../src/db/schema";


export const addProperty = async (req: Request, res: Response) => {
    try {
        const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.user.id))
        if(!user){ return res.status(401).json({message: 'unautorized'})}

        const propertyData = req.body
        // console.log("user:", user, "property:", propertyData)

        const dbPropertyObj = {
            landLordId: user.id,
            propertyName: propertyData.propertyName,
            propertyType: propertyData.propertyType,
            propertyAddress: propertyData.address,
            city: propertyData.city,
            state: propertyData.state,
            totalUnits: propertyData.totalUnits,
            description: propertyData.description,
            targetRent: propertyData.targetRent
        }

        await db.insert(propertyTable).values(dbPropertyObj)

        return res.status(201).json({message: "property added"})

    } catch (error) {
        console.log("this error is from the appProperty catch: ", error)
        return res.status(500).json("something went wrong")
        
    }   
}


// user: {
//   id: '7a4365c9-62cd-48e1-9bfa-2e33c6df1864',
//   fullName: 'Abdulmuheez kannike',
//   role: 'landlord',
//   email: 'abdulmuheezdev@gmail.com',
//   otp: null,
//   otpExpiry: null,
//   isVerified: true,
//   phoneNumber: '90234567545',
//   state: 'Lagos',
//   city: 'lekki',
//   password: '$2b$10$eRId1pWsgPE9w9nB32118eg/2RNCf6.EVylANHtwkA4NTltuNS9bW'
// } property: {
//   propertyName: 'Libby Chen',
//   propertyType: 'Duplex',
//   address: 'Eligendi ipsam in lo',
//   city: 'Aperiam qui voluptat',
//   state: 'Tenetur recusandae ',
//   totalUnits: '4',
//   description: 'Et temporibus nulla ',
//   targetRent: 'Rerum ad dolorem ad '
// }


//   propertyId: uuid("propertyId").primaryKey().defaultRandom(),

//     landLordId: uuid("landLordId").notNull().references(()=> usersTable.id),
  
//     propertyName: varchar().notNull(),
  
//     propertyAddress: varchar().notNull(),
  
//     city: varchar().notNull(),
  
//     state: varchar().notNull(),
  
//     totalUnits: varchar().notNull(),
  
//     description: varchar().notNull(),
  
//     targetRent: varchar().notNull()