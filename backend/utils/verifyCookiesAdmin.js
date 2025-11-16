import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";

export const verifyCookiesAdmin = async (req, res, next) => {
    try {
        const token = req.cookies.securityPatch;

        if (!token) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "Unauthorized User - No Token Provided"
                });
        };

        const decode = jwt.verify(token, process.env.JWT_SECRET);

        if (!decode) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "User Authorization failed"
                });
        };

        const user = await userModel.findById(decode.userId).select("-password");

        if (!user) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "User not found - Unauthorized"
                });
        };

        if (!user.isAdmin) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "Only admin can allow to see dashboard"
                });
        };

        req.user = user;

        next();

    }
    catch (error) {
        return res
            .status(500)
            .json({
                success: false,
                message: "Internal Server Error",
                error: error.message
            });
    };
};