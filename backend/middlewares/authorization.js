
import { getTokenData } from "../utilities/general.js";
import mongoose from "mongoose";
import { log } from "./logger.js";
const ObjectId = mongoose.Types.ObjectId;

export default async (req, res, next) => {
    try {
        const { token } = req.cookies;
        
        if (!token) {
            throw new Error("No token found");
        }
        
        const userData = await getTokenData(token);
        if(!userData){
            throw new Error("Invalid token data");
        }
        
        userData.id = new ObjectId(userData._id || userData.id);
        req.user = userData;
        req.user._id = userData.id.toString();
        
        next();
    } catch (er) {
        console.log("Authorization error:", er.message);
        res.status(401).json({
            success: false,
            message: "Unauthorized - please login again",
            redirect: "/login"
        });
    }
};
