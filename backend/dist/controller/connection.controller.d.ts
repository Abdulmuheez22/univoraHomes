import type { Request, Response } from "express";
export declare const connectionRequest: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getConnectionRequestStatus: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getTenantConnectionRequests: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateLandLordConnectionRequest: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const acceptConnectionRequest: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const declineConnectionRequest: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=connection.controller.d.ts.map