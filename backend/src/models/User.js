import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    profile: {
        type: String,
        default: ""
    },
    gender:{
        type:String,
        enum:["male", "female"],
        required:true
    }

})

const User = mongoose.model("User", UserSchema);
export default User;