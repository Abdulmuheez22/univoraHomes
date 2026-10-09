import api from "../axios";

export const signUp = async (form) => {
  const res = await api.post("/auth/signUp", form);
  return res.data;
};

export const verifyOtp = async (otp) => {
  const response = await api.post("/auth/verifyOtp", otp, { withCredentials: true });
  return response.data;
};


export const signIn = async (user) => {
  const response = await api.post("/auth/signIn", user, {withCredentials: true,})
  return response.data
}

export const signOut = async () => {
  const response = await api.post("/auth/signOut", {}, { withCredentials: true });
  return response.data;
};

export const addProperty = async (body) => {
  const response = await api.post("/property/addProperty", body, {withCredentials: true})
  return response.data
}


export const saveProperty = async ({ propertyId }) => {
  const response = await api.post(
    "/property/saveProperty",
    { propertyId },
    { withCredentials: true },
  );
  return response.data;
};

export const unSaveProperty = async (propertyId) => {
  const response = await api.delete(
    `/property/unSaveProperty/${propertyId}`,
    { withCredentials: true },  
  );
  return response.data;
};


export const fetchSavedProperties = async () => {
  const response = await api.get("/dashboard/fetchSavedProperties");
  return response.data.properties;
}

export const fetchUserProfile = async () => {
  const response = await api.get("/dashboard/userProfile");
  return response.data.user;
};

export const landLordProperties = async () => {
  const response = await api.get("/property/fetchLandLordProperties");
  return response.data
}

export const connectionRequest = async (propertyId) => {
  const response = await api.post(
    "/connection/connectionRequest",
    { propertyId },
    { withCredentials: true },
  );
  return response.data;
};

export const fetchConnectionRequestStatus = async (propertyId) => {
  const response = await api.get(
    `/connection/connectionRequest/status/${propertyId}`,
    { withCredentials: true },
  );
  return response.data.requested;
};

export const fetchLandlordConnectionRequests = async () => {
  const response = await api.get(
    "/connection/updateLandLordConnectionRequest",
    { withCredentials: true },
  );
  return response.data.requests;
};

export const fetchTenantConnectionRequests = async () => {
  const response = await api.get("/connection/myConnectionRequests", {
    withCredentials: true,
  });
  return response.data.requests;
};