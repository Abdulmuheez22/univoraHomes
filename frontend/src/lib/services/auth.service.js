import axios from "axios";
import api from "../axios";









export const signUp = async (form) => {
    const res = await api.post("/createUser/signUp", form)
    console.log("server response: ", res)
    return res.data
}