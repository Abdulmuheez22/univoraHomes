import type { Request, Response, NextFunction } from "express";
export declare const populateDashboard: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>>>;
export declare const userProfile: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateUserProfile: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteUserAccount: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const fetchSavedProperties: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const fetchLandlordTenant: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const fetchTenantLandLord: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const switchRole: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=dashboard.controller.d.ts.map