import mongoose from "mongoose";
import dns from "dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

export const connectDB = async () => {
    await mongoose.connect("mongodb+srv://praveen:praveen@nearbyhunt.ak8z7.mongodb.net/food-delivery").then(()=>console.log("DB Connected"));
}


// add your mongoDB connection string above.
// Do not use '@' symbol in your database user's password else it will show an error.