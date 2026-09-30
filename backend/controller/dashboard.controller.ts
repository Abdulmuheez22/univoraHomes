import { id } from 'zod/locales';
import type { Request, Response, NextFunction } from "express"
import { db } from "../src/test-db"
import { usersTable } from "../src/db/schema"
import { eq } from "drizzle-orm"
import { email } from 'zod';



export const populateDashboard = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.user.id))
        if(!user){ return res.status(401).json({message: 'unautorized'})}

        console.log(user)

       const frontendUser = {
        userName: user.fullName,
        role: user.role,
        email: user.email,
        phoneNumber: user.phoneNumber,
        state: user.state,
        city: user.city 
       }
       
       return res.status(200).json({"userData": frontendUser})

    } catch (error) {
        console.log("this error is from the populateDashboard catch :", error)
        return res.status(500).json({message: "something went wrong"})
    }
}

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
