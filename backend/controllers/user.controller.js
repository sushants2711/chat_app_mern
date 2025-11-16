import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import userModel from "../models/user.model.js";
import { generateOtp } from "../utils/code.generator.js";
import { sendCookies } from "../utils/sendCookies.js";
import { deleteEmailMessage, sendForgotEmail, sendForgotEmailConfirmation, sendLoginEmail, sendVerificationEmail, sendWelcomeEmail } from "../message/email.js";
import { sendPhoneForgotOtp, sendPhoneVerificationOtp, sendPhoneWelcomeEmail } from "../message/phone.js";


// signup controller
export const signupController = async (req, res) => {
    try {
        const { name, email, phoneNumber, password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "Password not match"
                });
        };

        const userExist = await userModel.findOne({ email });

        if (userExist) {

            if (userExist.isVerifiedEmail && userExist.isVerifiedPhone) {
                return res
                    .status(400)
                    .json({
                        success: false,
                        message: "User already exists"
                    });
            };

            if (userExist.phoneNumber !== phoneNumber) {
                const uniquePhoneNumberExist = await userModel.findOne({ phoneNumber });

                if (uniquePhoneNumberExist) {
                    return res
                        .status(400)
                        .json({
                            success: false,
                            message: "Phone must be unique"
                        });
                };
            };

            if (userExist.name !== name) {
                userExist.name = name;
            }



            userExist.phoneNumber = phoneNumber;

            const salt_round = 10;
            const hash_pass = await bcrypt.hash(password, salt_round);

            userExist.password = hash_pass;

            const verificationCodeEmail = generateOtp();
            userExist.verificationTokenEmail = verificationCodeEmail;
            userExist.verificationTokenExpiresAtEmail = Date.now() + 24 * 60 * 60 * 1000;

            // for mobile otp verification 
            const verificationCodePhone = generateOtp();
            userExist.verificationTokenPhone = verificationCodePhone;
            userExist.verificationTokenExpiresAtPhone = Date.now() + 24 * 60 * 60 * 1000;

            userExist.lastLogin = new Date();

            await userExist.save();

            sendCookies(userExist._id, res);

            // await sendVerificationEmail(userExist.email, userExist.name, newVerificationToken).then(() => console.log("Email Send Successfully")).catch((error) => console.error(`Error occured while sending a email, ${error}`));

            try {
                await sendVerificationEmail(userExist.email, userExist.name, verificationCodeEmail);
                console.log("Email sent successfully");
            }
            catch (error) {
                return res
                    .status(500)
                    .json({
                        success: false,
                        message: "Failed to send Verification email",
                        error: error.message
                    });
            };

            try {
                await sendPhoneVerificationOtp(userExist.phoneNumber, userExist.name, verificationCodePhone);
                console.log("Phone otp sent successfully");
            }
            catch (error) {
                return res
                    .status(500)
                    .json({
                        success: false,
                        message: "Failed to send Verification otp on mobile",
                        error: error.message
                    });
            }

            return res
                .status(201)
                .json({
                    success: true,
                    message: "Otp send successfully",
                    name: name,
                    email: email,
                    role: userExist.isAdmin
                });
        };

        const uniquePhoneNumberExist = await userModel.findOne({ phoneNumber });

        if (uniquePhoneNumberExist) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "Number already Exist."
                });
        };

        const salt_round = 10;
        const hash_password = await bcrypt.hash(password, salt_round);

        const verificationCodeEmail = generateOtp();

        const verificationCodePhone = generateOtp();

        const user = new userModel({
            name,
            email,
            phoneNumber,
            password: hash_password,
            verificationTokenEmail: verificationCodeEmail,
            verificationTokenExpiresAtEmail: Date.now() + 24 * 60 * 60 * 1000,  // 24 hr time for
            verificationTokenPhone: verificationCodePhone,
            verificationTokenExpiresAtPhone: Date.now() + 24 * 60 * 60 * 1000
        });

        await user.save();

        sendCookies(user._id, res);

        try {
            await sendVerificationEmail(user.email, user.name, verificationCodeEmail);
            console.log("Email sent successfully");
        }
        catch (error) {
            return res
                .status(500)
                .json({
                    success: false,
                    message: "Failed to send Verification email",
                    error: error.message
                });
        };

        try {
            await sendPhoneVerificationOtp(user.phoneNumber, user.name, verificationCodePhone);
            console.log("Phone otp sent successfully");
        }
        catch (error) {
            return res
                .status(500)
                .json({
                    success: false,
                    message: "Failed to send Verification otp on mobile",
                    error: error.message
                });
        };

        return res
            .status(201)
            .json({
                success: true,
                message: "User created successfully",
                name: name,
                email: email,
                role: user.isAdmin
            });

    } catch (error) {
        return res
            .status(500)
            .json({
                success: false,
                message: "Internal server error",
                error: error.message
            });
    };
};

// Email verified controller
export const verifyEmailController = async (req, res) => {
    try {
        const { code } = req.body;

        const codeExist = await userModel.findOne({
            verificationTokenEmail: code,
            verificationTokenExpiresAtEmail: { $gt: Date.now() }
        });

        if (!codeExist) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "Invalid credentials or verification code expired"
                });
        };

        codeExist.isVerifiedEmail = true;
        codeExist.verificationTokenEmail = undefined;
        codeExist.verificationTokenExpiresAtEmail = undefined;

        await codeExist.save();

        await sendCookies(codeExist._id, res);

        try {
            await sendWelcomeEmail(codeExist.email, codeExist.name);
            console.log("Email sent successfully");
        }
        catch (error) {
            return res
                .status(500)
                .json({
                    success: false,
                    message: "Failed to send verification email",
                    error: error.message
                });
        };

        return res
            .status(200)
            .json({
                success: true,
                message: "Email verified successfull"
            });

    } catch (error) {
        return res
            .status(500)
            .json({
                success: false,
                message: "Internal Server Error",
                error: error.message
            });
    };
};

// phoneNumber verified controller
export const verifyPhoneController = async (req, res) => {
    try {
        const { code } = req.body;

        const codeExist = await userModel.findOne({
            verificationTokenPhone: code,
            verificationTokenExpiresAtPhone: { $gt: Date.now() }
        });

        if (!codeExist) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "Invalid credentials or verification code expired"
                });
        };

        codeExist.isVerifiedPhone = true;
        codeExist.verificationTokenPhone = undefined;
        codeExist.verificationTokenExpiresAtPhone = undefined;

        await codeExist.save();

        await sendCookies(codeExist._id, res);

        try {
            await sendPhoneWelcomeEmail(codeExist.phoneNumber, codeExist.name);
            console.log("Message sent successfully");
        }
        catch (error) {
            return res
                .status(500)
                .json({
                    success: false,
                    message: "Failed to send message on phoneNumber",
                    error: error.message
                });
        };

        return res
            .status(200)
            .json({
                success: true,
                message: "Phone Number verified successfull"
            });

    } catch (error) {
        return res
            .status(500)
            .json({
                success: false,
                message: "Internal Server Error",
                error: error.message
            });
    };
};

// Login controller by email
export const loginControllerByEmail = async (req, res) => {
    try {
        const { email, password } = req.body;

        const userExist = await userModel.findOne({ email });

        if (!userExist) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "Email not Exist"
                });
        };

        if (userExist) {
            if (!userExist.isVerifiedEmail) {
                return res
                    .status(400)
                    .json({
                        success: false,
                        message: "Invalid credentials please verified your Email Account first"
                    });
            };
            if (!userExist.isVerifiedPhone) {
                return res
                    .status(400)
                    .json({
                        success: false,
                        message: "Invalid credentials please verified your Phone Number first"
                    });
            };
        };

        const isEqualPassword = await bcrypt.compare(password, userExist.password);

        if (!isEqualPassword) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "Invalid credentials, Password not match"
                });
        };

        userExist.lastLogin = new Date();

        await userExist.save();

        await sendCookies(userExist._id, res);

        try {
            await sendLoginEmail(userExist.email, userExist.name);
            console.log("Login Email sent successfully");
        }
        catch (error) {
            return res
                .status(500)
                .json({
                    success: false,
                    message: "Failed to send Login Email",
                    error: error.message
                });
        };

        return res
            .status(200)
            .json({
                success: true,
                message: "Logged in Successfully",
                name: userExist.name,
                email: userExist.email,
                role: userExist.isAdmin
            });
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

// login controller by phone number
export const loginControllerByPhone = async (req, res) => {
    try {
        const { phoneNumber, password } = req.body;

        const userExist = await userModel.findOne({ phoneNumber });

        if (!userExist) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "Phone Number not exist"
                });
        };

        if (userExist) {
            if (!userExist.isVerifiedEmail) {
                return res
                    .status(400)
                    .json({
                        success: false,
                        message: "Invalid credentials please verified your Email Account first"
                    });
            };
            if (!userExist.isVerifiedPhone) {
                return res
                    .status(400)
                    .json({
                        success: false,
                        message: "Invalid credentials please verified your Phone Number first"
                    });
            };
        };

        const isEqualPassword = await bcrypt.compare(password, userExist.password);

        if (!isEqualPassword) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "Invalid Credentials, Password not match"
                });
        };

        userExist.lastLogin = new Date();

        await userExist.save();

        await sendCookies(userExist._id, res);

        return res
            .status(200)
            .json({
                success: true,
                message: "Logged in Successfully",
                name: userExist.name,
                email: userExist.email,
                role: userExist.isAdmin
            });
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

// Logout controller
export const logoutController = async (req, res) => {
    try {
        const loggedInUser = req.user._id;

        if (!loggedInUser) {
            return res
                .status(403)
                .json({
                    success: false,
                    message: "User Id is missing",
                });
        };

        if (!mongoose.Types.ObjectId.isValid(loggedInUser)) {
            return res
                .status(403)
                .json({
                    success: false,
                    message: "Invalid Id format",
                });
        };

        res.cookie("securityPatch", "", { maxAge: 0 });

        return res
            .status(200)
            .json({
                success: true,
                message: "Logout successfully",
            });
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

// forgot password controller email
export const forgotPasswordEmailController = async (req, res) => {
    try {
        const { email } = req.body;

        const emailExist = await userModel.findOne({ email });

        if (!emailExist) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "Email not exist"
                });
        };

        if (emailExist) {
            if (!emailExist.isVerifiedEmail) {
                return res
                    .status(400)
                    .json({
                        success: false,
                        message: "Email not Verified"
                    });
            };
            if (!emailExist.isVerifiedPhone) {
                return res
                    .status(400)
                    .json({
                        success: false,
                        message: "Phone Number not Verified"
                    });
            };
        };

        const code = generateOtp();

        emailExist.resetPasswordTokenEmail = code;
        emailExist.resetPasswordExpiresAtEmail = Date.now() + 24 * 60 * 60 * 1000;

        await emailExist.save();

        await sendCookies(emailExist._id, res);

        try {
            await sendForgotEmail(emailExist.email, emailExist.name, code);
            console.log("Forgot email sent successfully");
        } catch (error) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "Failed to send forgot email otp"
                });
        };

        return res
            .status(200)
            .json({
                success: true,
                message: "Code send successfully on your email"
            });

    } catch (error) {
        return res
            .status(500)
            .json({
                success: false,
                message: "Internal Server Error",
                error: error.message
            });
    };
};

// forgot password controller phone
export const forgotPasswordPhoneController = async (req, res) => {
    try {
        const { phoneNumber } = req.body;

        const phoneExist = await userModel.findOne({ phoneNumber });

        if (!phoneExist) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "PhoneNumber not exist"
                });
        };

        if (phoneExist) {
            if (!phoneExist.isVerifiedEmail) {
                return res
                    .status(400)
                    .json({
                        success: false,
                        message: "Email not Verified"
                    });
            };
            if (!phoneExist.isVerifiedPhone) {
                return res
                    .status(400)
                    .json({
                        success: false,
                        message: "Phone Number not Verified"
                    });
            };
        };

        const code = generateOtp();

        phoneExist.resetPasswordTokenPhone = code;
        phoneExist.resetPasswordExpiresAtPhone = Date.now() + 24 * 60 * 60 * 1000;

        await phoneExist.save();

        await sendCookies(phoneExist._id, res);

        try {
            await sendPhoneForgotOtp(phoneExist.phoneNumber, phoneExist.name, code);
            console.log("Forgot message at phone Number sent successfully");
        }
        catch (error) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "Failed to send forgot message at phone number"
                });
        };

        return res
            .status(200)
            .json({
                success: true,
                message: "Code send successfully on your PhoneNumber"
            });
    }
    catch (error) {
        return res
            .status(500)
            .json({
                success: false,
                message: "Internal Server error",
                error: error.message
            });
    };
};

// reset password controller email
export const resetPasswordEmailController = async (req, res) => {
    try {
        const { code, password } = req.body;

        const codeExist = await userModel.findOne({
            resetPasswordTokenEmail: code,
            resetPasswordExpiresAtEmail: { $gt: Date.now() }
        });

        if (!codeExist) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "Invalid Credentials or Verification code expired"
                });
        };

        const salt_round = 10;
        const hash_password = await bcrypt.hash(password, salt_round)

        codeExist.password = hash_password;
        codeExist.resetPasswordTokenEmail = undefined;
        codeExist.resetPasswordExpiresAtEmail = undefined;

        await codeExist.save();

        await sendCookies(codeExist._id, res);

        try {
            await sendForgotEmailConfirmation(codeExist.email, codeExist.name);
            console.log("Email sent successfully");
        }
        catch (error) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "Failed to sent Verification Success Email",
                    error: error.message
                });
        };

        return res
            .status(200)
            .json({
                success: true,
                message: "Password Update Successfully"
            });

    } catch (error) {
        return res
            .status(500)
            .json({
                success: false,
                message: "Internal Server error",
                error: error.message
            });
    };
};

// reset password controller phone
export const resetPasswordPhoneController = async (req, res) => {
    try {
        const { code, password } = req.body;

        const codeExist = await userModel.findOne({
            resetPasswordTokenPhone: code,
            resetPasswordExpiresAtPhone: { $gt: Date.now() }
        });

        if (!codeExist) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "Invalid Credentials or Verification code expired"
                });
        };

        const salt_round = 10;
        const hash_password = await bcrypt.hash(password, salt_round);

        codeExist.password = hash_password;
        codeExist.resetPasswordTokenPhone = undefined;
        codeExist.resetPasswordExpiresAtPhone = undefined;

        await codeExist.save();

        await sendCookies(codeExist._id, res);

        try {
            await sendForgotEmailConfirmation(codeExist.email, codeExist.name);
            console.log("Email sent successfully");
        }
        catch (error) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "Failed to sent Verification Success Email",
                    error: error.message
                });
        };

        return res
            .status(200)
            .json({
                success: true,
                message: "Password Update Successfully"
            });

    } catch (error) {
        return res
            .status(500)
            .json({
                success: false,
                message: "Internal Server error",
                error: error.message
            });
    };
};

// delete account controller
export const deleteAccountController = async (req, res) => {
    try {
        const loggedInUser = req.user._id;

        if (!loggedInUser) {
            return res
                .status(403)
                .json({
                    success: false,
                    message: "LoggedIn User Id is missing"
                });
        };

        if (!mongoose.Types.ObjectId.isValid(loggedInUser)) {
            return res
                .status(403)
                .json({
                    success: false,
                    message: "Invalid Id format",
                });
        };

        const userExist = await userModel.findById(loggedInUser);

        if (!userExist) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "User not exist"
                });
        };

        if (userExist) {
            if (!userExist.isVerifiedEmail) {
                return res
                    .status(400)
                    .json({
                        success: false,
                        message: "Invalid credentials please verified your Email Account first"
                    });
            };
            if (!userExist.isVerifiedPhone) {
                return res
                    .status(400)
                    .json({
                        success: false,
                        message: "Invalid credentials please verified your Phone Number first"
                    });
            };
        };

        try {
            await deleteEmailMessage(userExist.email, userExist.name);
            console.log("Send delete email successfully");
        }
        catch (error) {
            return res
                .status(500)
                .json({
                    success: false,
                    message: "Failed to sent Verification Delete Email",
                    error: error.message
                });
        };

        await userModel.findByIdAndDelete(userExist._id);

        res.clearCookie("securityPatch");

        return res
            .status(200)
            .json({
                success: true,
                message: "User delete successfull"
            });
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

// get user by id controller
export const getIdByAccountDetailsController = async (req, res) => {
    try {
        const loggedInUser = req.user._id;

        if (!loggedInUser) {
            return res
                .status(403)
                .json({
                    success: false,
                    message: "LoggedIn User Id is missing"
                });
        };

        if (!mongoose.Types.ObjectId.isValid(loggedInUser)) {
            return res
                .status(403)
                .json({
                    success: false,
                    message: "Invalid Id format",
                });
        };

        const userExist = await userModel.findById(loggedInUser, { password: 0 });

        if (!userExist) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "User not exist"
                });
        };

        return res
            .status(200)
            .json({
                success: true,
                message: "User Profile data fetch Successfully",
                data: userExist
            });

    } catch (error) {
        return res
            .status(500)
            .json({
                success: false,
                message: "Internal Server Error",
                error: error.message
            });
    };
};

// update profile controller
export const updateProfileController = async (req, res) => {
    try {
        const loggedInUser = req.user._id;

        const { name, email, phoneNumber } = req.body;

        if (!loggedInUser) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "LoggedIn Id is missing"
                });
        };

        if (!mongoose.Types.ObjectId.isValid(loggedInUser)) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "Invalid LoggedIn Id format"
                });
        };

        const userExist = await userModel.findById(loggedInUser);

        if (!userExist) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "User not Exist"
                });
        };

        if (userExist) {
            if (!userExist.isVerifiedEmail) {
                return res
                    .status(400)
                    .json({
                        success: false,
                        message: "Invalid credentials please verified your Email Account first"
                    });
            };
            if (!userExist.isVerifiedPhone) {
                return res
                    .status(400)
                    .json({
                        success: false,
                        message: "Invalid credentials please verified your Phone Number first"
                    });
            };
        };

        if (name) {
            if (userExist.name !== name) {
                userExist.name = name;
            };
        };

        if (email) {
            if (userExist.email !== email) {
                const emailExist = await userModel.findOne({ email });

                if (emailExist) {
                    return res
                        .status(400)
                        .json({
                            success: false,
                            message: "Email already exist in someone else account"
                        });
                };

                const code = generateOtp();
                userExist.verificationTokenEmail = code;
                userExist.isVerifiedEmail = false;

                await userExist.save();

                try {
                    sendVerificationEmail(email, name || userExist.name, code);
                    console.log("Verification email sent successfully");
                }
                catch (error) {
                    return res
                        .status(500)
                        .json({
                            success: false,
                            message: "Failed to send Verification Email",
                            error: error.message
                        });
                };
            };
        };

        if (phoneNumber) {
            if (userExist.phoneNumber !== phoneNumber) {
                const phoneExist = await userModel.findOne({ phoneNumber });

                if (phoneExist) {
                    return res
                        .status(400)
                        .json({
                            success: false,
                            message: "Phone Number already exist in someone else account"
                        });
                };

                const otp = generateOtp();
                userExist.isVerifiedPhone = false;
                userExist.verificationTokenPhone = otp;

                try {
                    await sendPhoneVerificationOtp(phoneNumber, name || userExist.name, otp);
                    console.log("Phone otp send successfully");
                } catch (error) {
                    return res
                        .status(500)
                        .json({
                            success: false,
                            message: "Failed to send Verification Phone otp",
                            error: error.message
                        });
                }
            };
        };

        const updateProfileData = {
            name: name || userExist.name,
            email: email || userExist.email,
            phoneNumber: phoneNumber || userExist.phoneNumber
        };

        const updateProfile = await userModel.findByIdAndUpdate(loggedInUser, updateProfileData, { new: true });

        if (!updateProfile) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "Failed to Update the Profile"
                });
        };

        return res
            .status(200)
            .json({
                success: true,
                message: "Profile data Update Successfully",
                name: updateProfile.name,
                email: updateProfile.email,
                role: updateProfile.isAdmin
            });
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

// update password controller 
export const updatePasswordController = async (req, res) => {
    try {
        const loggedInUser = req.user._id;

        const { password } = req.body;

        if (!loggedInUser) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "LoggedIn Id is missing"
                });
        };

        if (!mongoose.Types.ObjectId.isValid(loggedInUser)) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "Invalid LoggedIn Id format"
                });
        };

        const userExist = await userModel.findById(loggedInUser);

        if (!userExist) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "User not Exist"
                });
        };

        if (userExist) {
            if (!userExist.isVerifiedEmail) {
                return res
                    .status(400)
                    .json({
                        success: false,
                        message: "Invalid credentials please verified your Email Account first"
                    });
            };
            if (!userExist.isVerifiedPhone) {
                return res
                    .status(400)
                    .json({
                        success: false,
                        message: "Invalid credentials please verified your Phone Number first"
                    });
            };
        };

        const salt_round = 10;
        const hash_password = await bcrypt.hash(password, salt_round);

        const updatePassword = await userModel.findByIdAndUpdate(loggedInUser, { password: hash_password }, { new: true });

        if (!updatePassword) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "Failed to Update the Password"
                });
        };

        return res
            .status(200)
            .json({
                success: true,
                message: "Password Update Successfully"
            });
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

// admin signup controller
export const adminSignupController = async (req, res) => {
    try {
        const { name, email, phoneNumber, password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "Password not match"
                });
        };

        const userExist = await userModel.findOne({ email });

        if (userExist) {

            if (userExist.isVerifiedEmail && userExist.isVerifiedPhone) {
                return res
                    .status(400)
                    .json({
                        success: false,
                        message: "User already exists"
                    });
            };

            if (userExist.phoneNumber !== phoneNumber) {
                const uniquePhoneNumberExist = await userModel.findOne({ phoneNumber });

                if (uniquePhoneNumberExist) {
                    return res
                        .status(400)
                        .json({
                            success: false,
                            message: "Phone must be unique"
                        });
                };
            };

            if (userExist.name !== name) {
                userExist.name = name;
            }



            userExist.phoneNumber = phoneNumber;

            const salt_round = 10;
            const hash_pass = await bcrypt.hash(password, salt_round);

            userExist.password = hash_pass;

            const verificationCodeEmail = generateOtp();
            userExist.verificationTokenEmail = verificationCodeEmail;
            userExist.verificationTokenExpiresAtEmail = Date.now() + 24 * 60 * 60 * 1000;

            // for mobile otp verification 
            const verificationCodePhone = generateOtp();
            userExist.verificationTokenPhone = verificationCodePhone;
            userExist.verificationTokenExpiresAtPhone = Date.now() + 24 * 60 * 60 * 1000;

            userExist.lastLogin = new Date();

            await userExist.save();

            sendCookies(userExist._id, res);

            try {
                await sendVerificationEmail(userExist.email, userExist.name, verificationCodeEmail);
                console.log("Email sent successfully");
            }
            catch (error) {
                return res
                    .status(500)
                    .json({
                        success: false,
                        message: "Failed to send Verification email",
                        error: error.message
                    });
            };

            try {
                await sendPhoneVerificationOtp(userExist.phoneNumber, userExist.name, verificationCodePhone);
                console.log("Phone otp sent successfully");
            }
            catch (error) {
                return res
                    .status(500)
                    .json({
                        success: false,
                        message: "Failed to send Verification otp on mobile",
                        error: error.message
                    });
            }

            return res
                .status(201)
                .json({
                    success: true,
                    message: "Otp send successfully",
                    name: name,
                    email: email,
                    role: userExist.isAdmin
                });
        };

        const uniquePhoneNumberExist = await userModel.findOne({ phoneNumber });

        if (uniquePhoneNumberExist) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "Number already Exist."
                });
        };

        const salt_round = 10;
        const hash_password = await bcrypt.hash(password, salt_round);

        const verificationCodeEmail = generateOtp();

        const verificationCodePhone = generateOtp();

        const user = new userModel({
            name,
            email,
            phoneNumber,
            password: hash_password,
            isAdmin: true,
            verificationTokenEmail: verificationCodeEmail,
            verificationTokenExpiresAtEmail: Date.now() + 24 * 60 * 60 * 1000,  // 24 hr time for
            verificationTokenPhone: verificationCodePhone,
            verificationTokenExpiresAtPhone: Date.now() + 24 * 60 * 60 * 1000
        });

        await user.save();

        sendCookies(user._id, res);

        try {
            await sendVerificationEmail(user.email, user.name, verificationCodeEmail);
            console.log("Email sent successfully");
        }
        catch (error) {
            return res
                .status(500)
                .json({
                    success: false,
                    message: "Failed to send Verification email",
                    error: error.message
                });
        };

        try {
            await sendPhoneVerificationOtp(user.phoneNumber, user.name, verificationCodePhone);
            console.log("Phone otp sent successfully");
        }
        catch (error) {
            return res
                .status(500)
                .json({
                    success: false,
                    message: "Failed to send Verification otp on mobile",
                    error: error.message
                });
        };

        return res
            .status(201)
            .json({
                success: true,
                message: "User created successfully",
                name: name,
                email: email,
                role: user.isAdmin
            });

    } catch (error) {
        return res
            .status(500)
            .json({
                success: false,
                message: "Internal server error",
                error: error.message
            });
    };
};