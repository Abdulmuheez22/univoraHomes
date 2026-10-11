export declare const sendOtpEmail: (userEmail: string, otp: string) => Promise<void>;
export declare const notifyTenant: (tenantEmail: string, tenantName: string, propertyName: string, propertyAddress: string) => Promise<void>;
export declare const notifyLandlord: (userEmail: string, landlordName: string, tenantName: string, propertyName: string) => Promise<void>;
export declare const notifyTenantOnDecline: (tenantEmail: string, tenantName: string, propertyName: string, propertyAddress: string) => Promise<void>;
//# sourceMappingURL=otpMail.services.d.ts.map