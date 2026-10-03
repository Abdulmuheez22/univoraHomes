import { id } from 'zod/locales';
import type { Request, Response, NextFunction } from "express"
import { db } from "../src/test-db"
import { usersTable } from "../src/db/schema"
import { eq } from "drizzle-orm"
import { propertyTable } from '../src/db/schema';



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
