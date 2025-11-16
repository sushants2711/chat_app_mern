import { twilioClient } from "../config/twilio.config.js";


export const sendPhoneVerificationOtp = async (phoneNumber, name, code) => {

    if (!phoneNumber) throw new Error("Phone Number is missing");

    if (!name) throw new Error("Name is missing")

    if (!code) throw new Error("Verification code is missing");

    try {
        const message = await twilioClient.messages.create({
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phoneNumber,
            body: `Your PingMe verification code is ${code}`,
        });

        return message;

    } catch (error) {
        throw new Error(error.message);
    };
};

export const sendPhoneWelcomeEmail = async (phoneNumber, name) => {
    if (!phoneNumber) throw new Error("Phone Number is missing");

    if (!name) throw new Error("Name is missing");

    try {
        const message = await twilioClient.messages.create({
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phoneNumber,
            body: `${name} your Phone Number Verified Successfully`,
        });

        return message;
    } catch (error) {
        throw new Error(error.message);
    };
};

export const sendPhoneForgotOtp = async (phoneNumber, name, code) => {
    if (!phoneNumber) throw new Error("Phone Number is missing");

    if (!name) throw new Error("Name is missing")

    if (!code) throw new Error("Verification code is missing");

    try {
        const message = await twilioClient.messages.create({
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phoneNumber,
            body: `Your password reset code for PingMe is ${code}.`
        });

        return message;

    } catch (error) {
        throw new Error(error.message);
    };
};

