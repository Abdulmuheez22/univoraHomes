





import type { Request, Response, NextFunction } from "express"






export const showReqMethod = (req: Request, res: Response, next: NextFunction) => {
   console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`)
   next()
}