import mongoose from "mongoose";
import { ENV_VARS } from "./envVars.js";

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(ENV_VARS.MONGO_URI)
        console.log(`mongoDb connected`)
    } catch (error) {
        console.log(`error connecting to DB: ${error.message}`)
        process.exit(1);
    }
}