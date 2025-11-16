import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    lastLogin: {
        type: Date,
        default: Date.now
    },
    isVerifiedEmail: {
        type: Boolean,
        default: false
    },
    isVerifiedPhone: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    resetPasswordTokenEmail: {
        type: String
    },
    resetPasswordExpiresAtEmail: {
        type: Date
    },
    resetPasswordTokenPhone: {
        type: String
    },
    resetPasswordExpiresAtPhone: {
        type: Date
    },
    verificationTokenPhone: {
        type: String
    },
    verificationTokenExpiresAtPhone: {
        type: Date
    },
    verificationTokenEmail: {
        type: String
    },
    verificationTokenExpiresAtEmail: {
        type: Date
    }
}, { timestamps: true, minimize: true });

export default mongoose.model("User", userSchema);