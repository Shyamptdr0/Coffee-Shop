import mongoose from "mongoose";


export const connectDB = async () =>{
    try{
        const connection = await mongoose.connect(process.env.MONGO_URI);
    }catch (error) {
        console.log("Error connecting to database ", error)
        process.exit(1); //exit with failure
    }
}