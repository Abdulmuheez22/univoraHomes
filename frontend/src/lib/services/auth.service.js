import axios from "axios";
import api from "../axios";

export const signUp = async (form) => {
  const res = await api.post("/auth/signUp", form);
  return res.data;
};

export const verifyOtp = async (otp) => {
  const response = await api.post("/auth/verifyUser", otp, {withCredentials: true});
  return response.data;
};


export const signIn = async (user) => {
  const response = await api.post("/auth/signIn", user, {withCredentials: true,})
  return response.data
}

export const addProperty = async (body) => {
  const response = await api.post("/property/addProperty", body, {withCredentials: true})
  return response.data
}


export const showProperties = async () => {
  // const response = await api.get(/)
}