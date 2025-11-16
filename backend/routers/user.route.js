import express from "express";
import { forgotEmailMiddleware, forgotPhoneMiddlewarre, loginMiddlewareByEmail, loginMiddlewareByPhoneNumber, profileUpdateMiddleware, resetPasswordMiddleware, signupMiddleware, updatePasswordMiddleware, verifyOtpMiddleware } from "../middlewares/user.middleware.js";
import { adminSignupController, deleteAccountController, forgotPasswordEmailController, forgotPasswordPhoneController, getIdByAccountDetailsController, loginControllerByEmail, loginControllerByPhone, logoutController, resetPasswordEmailController, resetPasswordPhoneController, signupController, updatePasswordController, updateProfileController, verifyEmailController, verifyPhoneController } from "../controllers/user.controller.js";
import { verifyCookiesForUser } from "../utils/verifyCookies.js";

const userRouter = express.Router();

userRouter.route("/signup").post(signupMiddleware, signupController);
userRouter.route("/verify-email/otp").post(verifyOtpMiddleware, verifyEmailController);
userRouter.route("/verify-phone/otp").post(verifyOtpMiddleware, verifyPhoneController);
userRouter.route("/login-email").post(loginMiddlewareByEmail, loginControllerByEmail);
userRouter.route("/login-phone").post(loginMiddlewareByPhoneNumber, loginControllerByPhone);
userRouter.route("/logout").post(verifyCookiesForUser, logoutController);
userRouter.route("/forgot-password/email").post(forgotEmailMiddleware, forgotPasswordEmailController);
userRouter.route("/reset-password/email").post(resetPasswordMiddleware, resetPasswordEmailController);
userRouter.route("/forgot-password/phone").post(forgotPhoneMiddlewarre, forgotPasswordPhoneController);
userRouter.route("/reset-password/phone").post(resetPasswordMiddleware, resetPasswordPhoneController);
userRouter.route("/delete-account").delete(verifyCookiesForUser, deleteAccountController);
userRouter.route("/profile-details").get(verifyCookiesForUser, getIdByAccountDetailsController);
userRouter.route("/profile-update").put(verifyCookiesForUser, profileUpdateMiddleware, updateProfileController);
userRouter.route("/update-password").put(verifyCookiesForUser, updatePasswordMiddleware, updatePasswordController);
userRouter.route("/admin-signup").post(signupMiddleware, adminSignupController);

export default userRouter;