import { db } from "../src/test-db.js";
import { connectionTable, tenantSaveTable, usersTable } from "../src/db/schema.js";
import { and, eq, inArray, or } from "drizzle-orm";
import { propertiesImgTable, propertyTable } from '../src/db/schema.js';
import { profileUpdateValidator } from "../utils/user.validate.js";
import cloudinary from "../config/cloudinary.config.js";
export const populateDashboard = async (req, res, next) => {
    try {
        const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.user.id));
        if (!user) {
            return res.status(401).json({ message: 'unautorized' });
        }
        // console.log(user)
        const landLordProperty = await db.select().from(propertyTable).where(eq(propertyTable.landLordId, user.id));
        // console.log(landLordProperty.length)
        const frontendUser = {
            userName: user.fullName,
            role: user.role,
            email: user.email,
            phoneNumber: user.phoneNumber,
            state: user.state,
            city: user.city,
            totalProperties: landLordProperty.length,
            propertyCategories: new Set(landLordProperty.map((property) => property.propertyCategory)).size,
        };
        return res.status(200).json({ "userData": frontendUser });
    }
    catch (error) {
        console.log("this error is from the populateDashboard catch :", error);
        return res.status(500).json({ message: "something went wrong" });
    }
};
export const userProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const [user] = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.id, userId));
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const frontendUser = {
            userName: user.fullName,
            userEmail: user.email,
            userPhone: user.phoneNumber,
            userState: user.state,
            userCity: user.city,
            userRole: user.role,
        };
        return res.status(200).json({ user: frontendUser });
    }
    catch (error) {
        console.log("this error is from the userProfile catch: ", error);
        return res.status(500).json({ message: "Unable to fetch user profile" });
    }
};
export const updateUserProfile = async (req, res) => {
    const validatedProfile = profileUpdateValidator.safeParse(req.body);
    if (!validatedProfile.success) {
        return res.status(400).json({ message: validatedProfile.error.issues[0]?.message ?? "Invalid profile details" });
    }
    try {
        const [user] = await db
            .update(usersTable)
            .set(validatedProfile.data)
            .where(eq(usersTable.id, req.user.id))
            .returning();
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({
            user: {
                userName: user.fullName,
                userEmail: user.email,
                userPhone: user.phoneNumber,
                userState: user.state,
                userCity: user.city,
                userRole: user.role,
            },
        });
    }
    catch (error) {
        if (typeof error === "object" &&
            error !== null &&
            "code" in error &&
            error.code === "23505") {
            return res.status(409).json({ message: "That phone number is already in use" });
        }
        console.log("this error is from the updateUserProfile catch: ", error);
        return res.status(500).json({ message: "Unable to update your profile" });
    }
};
export const deleteUserAccount = async (req, res) => {
    try {
        const userId = req.user.id;
        const deletion = await db.transaction(async (tx) => {
            const [existingUser] = await tx
                .select({ id: usersTable.id })
                .from(usersTable)
                .where(eq(usersTable.id, userId));
            if (!existingUser)
                return { userFound: false, images: [] };
            const ownedProperties = await tx
                .select({ propertyId: propertyTable.propertyId })
                .from(propertyTable)
                .where(eq(propertyTable.landLordId, userId));
            const propertyIds = ownedProperties.map(({ propertyId }) => propertyId);
            const images = propertyIds.length > 0
                ? await tx
                    .select({ imagePublicId: propertiesImgTable.imagePublicId })
                    .from(propertiesImgTable)
                    .where(inArray(propertiesImgTable.propertyId, propertyIds))
                : [];
            if (propertyIds.length > 0) {
                await tx.delete(propertiesImgTable).where(inArray(propertiesImgTable.propertyId, propertyIds));
                await tx.delete(propertyTable).where(inArray(propertyTable.propertyId, propertyIds));
            }
            await tx.delete(tenantSaveTable).where(propertyIds.length > 0
                ? or(eq(tenantSaveTable.userId, userId), inArray(tenantSaveTable.propertyId, propertyIds))
                : eq(tenantSaveTable.userId, userId));
            await tx.delete(connectionTable).where(or(eq(connectionTable.landLordId, userId), eq(connectionTable.tenatId, userId)));
            await tx.delete(usersTable).where(eq(usersTable.id, userId));
            return { userFound: true, images };
        });
        if (!deletion.userFound) {
            return res.status(404).json({ message: "User not found" });
        }
        const cleanupResults = await Promise.allSettled(deletion.images.map(({ imagePublicId }) => cloudinary.uploader.destroy(imagePublicId)));
        const failedImageCleanup = cleanupResults.filter((result) => result.status === "rejected");
        if (failedImageCleanup.length > 0) {
            console.error(`Account ${userId} was deleted, but ${failedImageCleanup.length} property image(s) could not be removed from Cloudinary.`, failedImageCleanup);
        }
        const isProduction = process.env.NODE_ENV === "production";
        return res
            .clearCookie("token", {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "strict" : "lax",
        })
            .status(200)
            .json({ message: "Account deleted successfully" });
    }
    catch (error) {
        console.log("this error is from the deleteUserAccount catch: ", error);
        return res.status(500).json({ message: "Unable to delete your account" });
    }
};
export const fetchSavedProperties = async (req, res) => {
    try {
        const user = req.user?.id;
        if (!user) {
            return res.status(200).json({ properties: [] });
        }
        const savedProperties = await db
            .select({ propertyId: tenantSaveTable.propertyId })
            .from(tenantSaveTable)
            .where(eq(tenantSaveTable.userId, user));
        const propertyIds = savedProperties.map(({ propertyId }) => propertyId);
        if (propertyIds.length === 0) {
            return res.status(200).json({ properties: [] });
        }
        const properties = await db
            .select()
            .from(propertyTable)
            .where(inArray(propertyTable.propertyId, propertyIds));
        const images = await db
            .select({
            propertyId: propertiesImgTable.propertyId,
            imageUrl: propertiesImgTable.imageUrl,
        })
            .from(propertiesImgTable)
            .where(inArray(propertiesImgTable.propertyId, propertyIds));
        const savedPropertyIds = new Set(propertyIds);
        const frontendProperties = properties
            .filter((property) => savedPropertyIds.has(property.propertyId))
            .map((property) => ({
            propertyId: property.propertyId,
            propertyName: property.propertyName,
            propertyType: property.propertyType,
            propertyCategory: property.propertyCategory,
            propertyAddress: property.propertyAddress,
            city: property.city,
            state: property.state,
            targetRent: property.targetRent,
            propertyImages: images
                .filter((image) => image.propertyId === property.propertyId)
                .map((image) => image.imageUrl),
        }));
        return res.status(200).json({ properties: frontendProperties });
    }
    catch (error) {
        console.log("this error is from fetchSavedProperties catch: ", error);
        return res.status(500).json({ message: "Unable to fetch saved properties" });
    }
};
export const fetchLandlordTenant = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const connections = await db
            .select()
            .from(connectionTable)
            .where(and(eq(connectionTable.landLordId, userId), eq(connectionTable.requestStatus, "Accepted")));
        if (connections.length === 0) {
            return res.status(200).json({ tenants: [] });
        }
        const propertyIds = connections.map((c) => c.propertyId);
        const tenantIds = connections.map((c) => c.tenatId);
        const [properties, tenants] = await Promise.all([
            db
                .select()
                .from(propertyTable)
                .where(inArray(propertyTable.propertyId, propertyIds)),
            db
                .select()
                .from(usersTable)
                .where(inArray(usersTable.id, tenantIds)),
        ]);
        const propertyMap = new Map(properties.map((p) => [p.propertyId, p]));
        const tenantMap = new Map(tenants.map((t) => [t.id, t]));
        const result = connections.map((conn) => {
            const property = propertyMap.get(conn.propertyId);
            const tenant = tenantMap.get(conn.tenatId);
            return {
                property: {
                    propertyName: property?.propertyName ?? null,
                    propertyAddress: property?.propertyAddress ?? null,
                    propertyType: property?.propertyType ?? null,
                    propertyCategory: property?.propertyCategory ?? null,
                },
                tenant: {
                    tenantId: tenant?.id ?? null,
                    tenantName: tenant?.fullName ?? null,
                    tenantEmail: tenant?.email ?? null,
                    tenantNumber: tenant?.phoneNumber ?? null,
                    tenantCity: tenant?.city ?? null,
                    tenantState: tenant?.state ?? null,
                },
            };
        });
        return res.status(200).json({ tenants: result });
    }
    catch (error) {
        console.error("fetchLandlordTenant error:", error);
        return res.status(500).json({ message: "Unable to fetch landlord tenants" });
    }
};
export const fetchTenantLandLord = async (req, res) => {
    try {
        const userId = req.user.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const connections = await db
            .select()
            .from(connectionTable)
            .where(and(eq(connectionTable.tenatId, userId), eq(connectionTable.requestStatus, "Accepted")));
        if (connections.length === 0) {
            return res.status(200).json({ landlords: [] });
        }
        const propertyIds = connections.map((c) => c.propertyId);
        const landlordId = connections.map((c) => c.landLordId);
        const [properties, landlord] = await Promise.all([
            db
                .select()
                .from(propertyTable)
                .where(inArray(propertyTable.propertyId, propertyIds)),
            db
                .select()
                .from(usersTable)
                .where(inArray(usersTable.id, landlordId)),
        ]);
        const propertyMap = new Map(properties.map((p) => [p.propertyId, p]));
        const landlordMap = new Map(landlord.map((t) => [t.id, t]));
        const result = connections.map((conn) => {
            const property = propertyMap.get(conn.propertyId);
            const landlord = landlordMap.get(conn.landLordId);
            return {
                property: {
                    propertyName: property?.propertyName ?? null,
                    propertyAddress: property?.propertyAddress ?? null,
                    propertyType: property?.propertyType ?? null,
                    propertyCategory: property?.propertyCategory ?? null,
                },
                landlord: {
                    landlordName: landlord?.fullName ?? null,
                    landlordEmail: landlord?.email ?? null,
                    landlordNumber: landlord?.phoneNumber ?? null,
                },
            };
        });
        return res.status(200).json({ landlords: result });
    }
    catch (error) {
        console.error("fetchTenantLandLord error:", error);
        return res.status(500).json({ message: "Unable to fetch landlords" });
    }
};
export const switchRole = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const newRole = req.body?.newRole;
        if (newRole !== "landlord" && newRole !== "tenant") {
            return res.status(400).json({
                message: "newRole must be either landlord or tenant",
            });
        }
        const [currentUser] = await db
            .select({ role: usersTable.role })
            .from(usersTable)
            .where(eq(usersTable.id, userId));
        if (!currentUser) {
            return res.status(404).json({ message: "User not found" });
        }
        if (currentUser.role !== newRole) {
            await db
                .update(usersTable)
                .set({ role: newRole })
                .where(eq(usersTable.id, userId));
        }
        return res
            .status(200)
            .json({ message: "Account switched successfully", role: newRole });
    }
    catch (error) {
        console.error("switchRole error:", error);
        return res.status(500).json({ message: "Error switching role" });
    }
};
//# sourceMappingURL=dashboard.controller.js.map