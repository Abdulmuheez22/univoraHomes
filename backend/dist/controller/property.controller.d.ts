import type { Request, Response } from "express";
export declare const addProperty: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const fetchProperties: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const fetchPropertyById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const landLordProperties: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=property.controller.d.ts.map