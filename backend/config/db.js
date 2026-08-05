import mongoose from "mongoose";
import dns from "dns";

try {
    dns.setServers(["8.8.8.8", "8.8.4.4"]);
} catch (e) {
    console.log("DNS setServers warning:", e.message);
}

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("DB Connected");
    } catch (error) {
        console.error("DB Connection Error:", error.message);
    }
}


// add your mongoDB connection string above.
// Do not use '@' symbol in your database user's password else it will show an error.