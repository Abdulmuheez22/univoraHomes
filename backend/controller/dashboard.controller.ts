import type { Request, Response, NextFunction } from "express"
import { db } from "../src/test-db"
import { usersTable } from "../src/db/schema"
import { eq } from "drizzle-orm"



export const populateDashboard = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await db.select().from(usersTable).where(eq(usersTable.id, req.user.id))
        if(!user){ return res.status(401).json({message: 'unautorized'})}
    } catch (error) {
        console.log("this error is from the populateDashboard catch :", error)
        return res.status(500).json({message: "something went wrong"})
    }
}