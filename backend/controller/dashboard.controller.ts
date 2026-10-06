import { id } from 'zod/locales';
import type { Request, Response, NextFunction } from "express"
import { db } from "../src/test-db"
import { tenantSaveTable, usersTable } from "../src/db/schema"
import { eq, inArray } from "drizzle-orm"
import { propertiesImgTable, propertyTable } from '../src/db/schema';



export const populateDashboard = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.user.id))
        if(!user){ return res.status(401).json({message: 'unautorized'})}

        // console.log(user)

        const landLordProperty = await db.select().from(propertyTable).where(eq(propertyTable.landLordId, user.id))

        // console.log(landLordProperty.length)

    const frontendTotalUnit =  landLordProperty.map((unit) => unit.totalUnits)
    const frontendTotalUnitItg = frontendTotalUnit.reduce((acc, val) => acc + Number(val), 0)
    console.log(frontendTotalUnitItg)

       const frontendUser = {
        userName: user.fullName,
        role: user.role,
        email: user.email,
        phoneNumber: user.phoneNumber,
        state: user.state,
        city: user.city,
        totalProperties: landLordProperty.length,
        totalUnit: frontendTotalUnitItg,
        occupiedUnits: "0",
        vacantUnit: frontendTotalUnitItg
       }
       
       return res.status(200).json({"userData": frontendUser})

    } catch (error) {
        console.log("this error is from the populateDashboard catch :", error)
        return res.status(500).json({message: "something went wrong"})
    }
}

export const userProfile = async (req: Request, res: Response) => {
    try {
        const userId = req.user.id
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" })
        }

        const [user] = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.id, userId))

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        const frontendUser = {
            userName: user.fullName,
            userEmail: user.email,
            userPhone: user.phoneNumber,
            userState: user.state,
            userCity: user.city,
            userRole: user.role,
        }

        return res.status(200).json({ user: frontendUser })
    } catch (error) {
        console.log("this error is from the userProfile catch: ", error)
        return res.status(500).json({ message: "Unable to fetch user profile" })
    }
}


export const fetchSavedProperties = async (req: Request, res: Response) => {
    try {
        const user = req.user.id
        if(!user){return res.status(401).json({message: "Unauthorized"})}

        const savedProperties = await db
            .select({ propertyId: tenantSaveTable.propertyId })
            .from(tenantSaveTable)
            .where(eq(tenantSaveTable.userId, user))

        const propertyIds = savedProperties.map(({ propertyId }) => propertyId)
        if (propertyIds.length === 0) {
            return res.status(200).json({ properties: [] })
        }

        const properties = await db
            .select()
            .from(propertyTable)
            .where(inArray(propertyTable.propertyId, propertyIds))

        const images = await db
            .select({
                propertyId: propertiesImgTable.propertyId,
                imageUrl: propertiesImgTable.imageUrl,
            })
            .from(propertiesImgTable)
            .where(inArray(propertiesImgTable.propertyId, propertyIds))

        const savedPropertyIds = new Set(propertyIds)
        const frontendProperties = properties
            .filter((property) => savedPropertyIds.has(property.propertyId))
            .map((property) => ({
                propertyId: property.propertyId,
                propertyName: property.propertyName,
                propertyType: property.propertyType,
                propertyAddress: property.propertyAddress,
                city: property.city,
                state: property.state,
                targetRent: property.targetRent,
                propertyImages: images
                    .filter((image) => image.propertyId === property.propertyId)
                    .map((image) => image.imageUrl),
            }))

        return res.status(200).json({ properties: frontendProperties })
        
    } catch (error) {
        console.log("this error is from fetchSavedProperties catch: ", error)
        return res.status(500).json({ message: "Unable to fetch saved properties" })
    }
} 


    // const landLordProperty = await db.select().from(propertyTable).where(eq(propertyTable.propertyId, user.id))

    // if(landLordProperty.length === 0) { return res.status(404).json({message: "You don't have a Property yet!"})}

    // const frontendLandLordProp = {
    //   totalProperties: landLordProperty.length,
    //   totalUnit: landLordProperty.map((unit) => unit.totalUnits),
    //   occupiedUnits: landLordProperty.map((unit) => unit.totalUnits),
    // }


// {
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
// }
