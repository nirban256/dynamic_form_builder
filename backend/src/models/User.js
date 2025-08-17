import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: String,
        airTableId: String,
        accessToken: String,
        refreshToken: String,
    },
    {
        timestamps: true
    }
);

export default mongoose.model("User", userSchema);