import { transporter } from "../config/email.config.js";
import { deleteAccountEmailTemplate, forgotPasswordEmailTemplate, loginEmailTemplate, passwordResetConfirmationTemplate, verificationEmailTemplate, welcomeEmailTemplate } from "./emailTemplate.message.js";

const EMAIL_NAME = process.env.EMAIL_NAME;
const EMAIL_USER = process.env.EMAIL_USER;

// send a verification email - new user
export const sendVerificationEmail = async (email, name, verificationCode) => {

    if (!email)
        throw new Error("Email Id is missing");

    if (!name) throw new Error("Name is missing");

    if (!verificationCode) throw new Error("Verification Code is missing");

    try {
        const info = await transporter.sendMail({
            from: `"${EMAIL_NAME}" <${EMAIL_USER}>`,
            to: email,
            subject: "Verify Your Email",
            html: verificationEmailTemplate(name, verificationCode)
        });

        return info;

    } catch (error) {
        throw new Error(error.message);
    };
};

// send a welcome email - new user welcome
export const sendWelcomeEmail = async (email, name) => {

    if (!email) throw new Error("Email is missing");

    if (!name) throw new Error("Name is missing");

    try {
        const info = await transporter.sendMail({
            from: `"${EMAIL_NAME}" <${EMAIL_USER}>`,
            to: email,
            subject: "Email Verified Successfully",
            html: welcomeEmailTemplate(name)
        });

        return info;

    } catch (error) {
        throw new Error(error.message);
    };
};

// send a login email - every time when user is login get a email
export const sendLoginEmail = async (email, name) => {
    if (!email) throw new Error("Email is missing");

    if (!name) throw new Error("Name is missing");

    try {
        const info = await transporter.sendMail({
            from: `"${EMAIL_NAME}" <${EMAIL_USER}>`,
            to: email,
            subject: "Login Successfully",
            html: loginEmailTemplate(name)
        });

        return info;

    } catch (error) {
        throw new Error(error.message);
    };
};

// send a forgot password email - request
export const sendForgotEmail = async (email, name, verificationCode) => {
    if (!email) throw new Error("Email Id is missing");

    if (!name) throw new Error("Name is missing");

    if (!verificationCode) throw new Error("Verification Code is missing");

    try {
        const info = await transporter.sendMail({
            from: `"${EMAIL_NAME}" <${EMAIL_USER}>`,
            to: email,
            subject: "Reset Password",
            html: forgotPasswordEmailTemplate(name, verificationCode)
        });

        return info;

    } catch (error) {
        throw new Error(error.message);
    };
};

// send a forgot email confirmation - success
export const sendForgotEmailConfirmation = async (email, name) => {

    if (!email) throw new Error("Email id is missing");

    if (!name) throw new Error("Name is missing");

    try {
        const info = await transporter.sendMail({
            from: `"${EMAIL_NAME}" <${EMAIL_USER}>`,
            to: email,
            subject: "Password Reset Successfully",
            html: passwordResetConfirmationTemplate(name)
        });

        return info;

    } catch (error) {
        throw new Error(error.message);
    };
};

// send a delete email - delete
export const deleteEmailMessage = async (email, name) => {

    if (!email) throw new Error("Email Id is missing");

    if (!name) throw new Error("Name is missing");

    try {
        const info = transporter.sendMail({
            from: `"${EMAIL_NAME}" <${EMAIL_USER}>`,
            to: email,
            subject: "Account Delete Message",
            html: deleteAccountEmailTemplate(name)
        });

        return info;

    } catch (error) {
        throw new Error(error.message);
    };
};