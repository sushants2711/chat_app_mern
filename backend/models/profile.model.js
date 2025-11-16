import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
    profile_url: {
        type: String,
        required: true
    },
    profile_id: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true });

export default mongoose.model("Profile", profileSchema);