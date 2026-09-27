import axios from "axios";
import api from "../axios";

export const signUp = async (form) => {
  const res = await api.post("/createUser/signUp", form);
  return res.data;
};

export const verifyOtp = async (otp) => {
  const response = await api.post("/user/verifyUser", otp);
  return response.data;
};
