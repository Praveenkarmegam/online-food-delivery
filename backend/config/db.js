import mongoose from "mongoose";

export const  connectDB = async () =>{

    await mongoose.connect("mongodb+srv://praveen:praveen@nearbyhunt.ak8z7.mongodb.net/food-delivery").then(()=>console.log("DB Connected"));
   
}


// add your mongoDB connection string above.
// Do not use '@' symbol in your database user's password else it will show an error.