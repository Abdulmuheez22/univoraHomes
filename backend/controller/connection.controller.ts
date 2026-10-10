import type { Request, Response } from "express";
import { db } from "../src/test-db";
import { connectionTable, propertyTable, usersTable } from "../src/db/schema";
import { and, eq, inArray } from "drizzle-orm";
import { notifyLandlord, notifyTenant, notifyTenantOnDecline } from "../services/otpMail.services";

export const connectionRequest = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const propertyId = req.body.propertyId;
    if (!propertyId) {
      return res.status(400).json({ message: "Property ID is required" });
    }

    const [property] = await db
      .select()
      .from(propertyTable)
      .where(eq(propertyTable.propertyId, propertyId));

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    const [existingRequest] = await db
      .select({ id: connectionTable.id })
      .from(connectionTable)
      .where(
        and(
          eq(connectionTable.tenatId, userId),
          eq(connectionTable.propertyId, propertyId),
        ),
      )
      .limit(1);

    if (existingRequest) {
      return res.status(200).json({
        message: "Connection request already sent",
        requested: true,
      });
    }

    const [landlord] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, property.landLordId));

    if (!landlord) {
      return res.status(404).json({ message: "no Landlord found" });
    }

    const firstName: any = landlord.fullName.trim().split(" ")[0];

    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, userId));

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await notifyLandlord(
      landlord.email,
      firstName,
      user.fullName,
      property.propertyName,
    );

    await db.insert(connectionTable).values({
      landLordId: landlord.id,
      tenatId: userId,
      propertyId: propertyId,
      requestStatus: "Pending",
    });

    return res.status(201).json({ message: "Connection request sent" });
  } catch (error) {
    console.log("this error is from connectionRequest catch: ", error);
    return res
      .status(500)
      .json({ message: "Unable to send connection request" });
  }
};

////you are supose to save the landlord id not the property id

export const getConnectionRequestStatus = async (
  req: Request,
  res: Response,
) => {
  try {
    const userId = req.user.id;
    const propertyId = req.params.propertyId;

    if (typeof propertyId !== "string" || !propertyId) {
      return res.status(400).json({ message: "Property ID is required" });
    }

    const [request] = await db
      .select({ id: connectionTable.id })
      .from(connectionTable)
      .where(
        and(
          eq(connectionTable.tenatId, userId),
          eq(connectionTable.propertyId, propertyId),
        ),
      )
      .limit(1);

    return res.status(200).json({ requested: Boolean(request) });
  } catch (error) {
    console.log("this error is from getConnectionRequestStatus: ", error);
    return res
      .status(500)
      .json({ message: "Unable to fetch connection request status" });
  }
};

export const getTenantConnectionRequests = async (
  req: Request,
  res: Response,
) => {
  try {
    const tenantRequests = await db
      .select()
      .from(connectionTable)
      .where(eq(connectionTable.tenatId, req.user.id));

    const propertyIds = [
      ...new Set(tenantRequests.map((request) => request.propertyId)),
    ];
    const landlordIds = [
      ...new Set(tenantRequests.map((request) => request.landLordId)),
    ];

    const [properties, landlords] = await Promise.all([
      propertyIds.length
        ? db
            .select()
            .from(propertyTable)
            .where(inArray(propertyTable.propertyId, propertyIds))
        : Promise.resolve([]),
      landlordIds.length
        ? db.select().from(usersTable).where(inArray(usersTable.id, landlordIds))
        : Promise.resolve([]),
    ]);

    const propertiesById = new Map(
      properties.map((property) => [property.propertyId, property]),
    );
    const landlordsById = new Map(
      landlords.map((landlord) => [landlord.id, landlord]),
    );

    const requests = tenantRequests.map((request) => {
      const property = propertiesById.get(request.propertyId);
      const landlord = landlordsById.get(request.landLordId);

      return {
        requestId: request.id,
        requestStatus: request.requestStatus,
        propertyId: property?.propertyId ?? null,
        propertyName: property?.propertyName ?? null,
        propertyType: property?.propertyType ?? null,
        propertyAddress: property?.propertyAddress ?? null,
        city: property?.city ?? null,
        state: property?.state ?? null,
        targetRent: property?.targetRent ?? null,
        landlordName: landlord?.fullName ?? null,
      };
    });

    return res.status(200).json({ requests });
  } catch (error) {
    console.log("this error is from getTenantConnectionRequests: ", error);
    return res
      .status(500)
      .json({ message: "Unable to fetch your property inquiries" });
  }
};


export const updateLandLordConnectionRequest = async (
  req: Request,
  res: Response,
) => {
  try {
    const landlordId = req.user.id;

    const landlordRequests = await db
      .select()
      .from(connectionTable)
      .where(eq(connectionTable.landLordId, landlordId));

    const propertyIds = [
      ...new Set(landlordRequests.map((request) => request.propertyId)),
    ];
    const tenantIds = [
      ...new Set(landlordRequests.map((request) => request.tenatId)),
    ];

    const [properties, tenants] = await Promise.all([
      propertyIds.length
        ? db
            .select()
            .from(propertyTable)
            .where(inArray(propertyTable.propertyId, propertyIds))
        : Promise.resolve([]),
      tenantIds.length
        ? db.select().from(usersTable).where(inArray(usersTable.id, tenantIds))
        : Promise.resolve([]),
    ]);

    const propertiesById = new Map(
      properties.map((property) => [property.propertyId, property]),
    );
    const tenantsById = new Map(tenants.map((tenant) => [tenant.id, tenant]));

    const requests = landlordRequests.map((request) => {
      const property = propertiesById.get(request.propertyId);
      const tenant = tenantsById.get(request.tenatId);

      return {
        requestId: request.id,
        requestStatus: request.requestStatus,
        propertyId: property?.propertyId ?? null,
        propertyName: property?.propertyName ?? null,
        propertyType: property?.propertyType ?? null,
        propertyAddress: property?.propertyAddress ?? null,
        city: property?.city ?? null,
        state: property?.state ?? null,
        tenantId: tenant?.id ?? null,
        tenantName: tenant?.fullName ?? null,
        tenantEmail: tenant?.email ?? null,
        tenantPhoneNumber: tenant?.phoneNumber ?? null,
      };
    });

    return res.status(200).json({ requests });
  } catch (error) {
    console.log("this error is from updateLandLordConnectionRequest: ", error);
    return res
      .status(500)
      .json({ message: "Unable to fetch connection requests" });
  }
};



export const acceptConnectionRequest = async (
  req: Request,
  res: Response,
) => {
  try {
    const landlordId = req.user.id;
    const requestId = String(req.params.requestId);
    const status = req.body.status;

    if (!requestId) {
      return res.status(400).json({ message: "Request ID is required" });
    }

    if (status !== "Accepted") {
      return res.status(400).json({ message: "Invalid request status" });
    }

    const [request] = await db
      .select()
      .from(connectionTable)
      .where(
        and(
          eq(connectionTable.id, requestId),
          eq(connectionTable.landLordId, landlordId),
        ),
      );

    if (!request) {
      return res.status(404).json({ message: "Connection request not found" });
    }

    const [tenant] = await db.select().from(usersTable).where(eq(usersTable.id, request.tenatId))

    if(!tenant){ return res.status(404).json({message: "Tenant not found"})}

    const [property] = await db.select().from(propertyTable).where(eq(propertyTable.propertyId, request.propertyId))

    if(!property){return res.status(404).json({message: "Property not found"})}

    await notifyTenant(tenant.email, tenant.fullName, property.propertyName, property.propertyAddress) 

    await db
      .update(connectionTable)
      .set({ requestStatus: status })
      .where(eq(connectionTable.id, requestId));

    return res.status(200).json({
      message: `Connection request ${status.toLowerCase()}`,
      requestStatus: status,
    });
  } catch (error) {
    console.log("this error is from respondToConnectionRequest: ", error);
    return res
      .status(500)
      .json({ message: "Unable to update connection request" });
  }
};


export const declineConnectionRequest = async (
  req: Request,
  res: Response,
) => {
  try {
    const landlordId = req.user.id;
    const requestId = String(req.params.requestId);
    const status = req.body.status;

    if (!requestId) {
      return res.status(400).json({ message: "Request ID is required" });
    }

    if (status !== "Declined") {
      return res.status(400).json({ message: "Invalid request status" });
    }

    const [request] = await db
      .select()
      .from(connectionTable)
      .where(
        and(
          eq(connectionTable.id, requestId),
          eq(connectionTable.landLordId, landlordId),
        ),
      );

    if (!request) {
      return res.status(404).json({ message: "Connection request not found" });
    }

    const [tenant] = await db.select().from(usersTable).where(eq(usersTable.id, request.tenatId))

    if(!tenant){ return res.status(404).json({message: "Tenant not found"})}

    const [property] = await db.select().from(propertyTable).where(eq(propertyTable.propertyId, request.propertyId))

    if(!property){return res.status(404).json({message: "Property not found"})}

    await notifyTenantOnDecline(tenant.email, tenant.fullName, property.propertyName, property.propertyAddress) 

    await db
      .update(connectionTable)
      .set({ requestStatus: status })
      .where(eq(connectionTable.id, requestId));

    return res.status(200).json({
      message: `Connection request ${status.toLowerCase()}`,
      requestStatus: status,
    });
  } catch (error) {
    console.log("this error is from respondToConnectionRequest: ", error);
    return res
      .status(500)
      .json({ message: "Unable to update connection request" });
  }
};