const mongoose = require("mongoose")
const UserSchema= new mongoose.Schema({
    firstName:{type:String, required:true},
    lastName:{type:String, required:true},
    email:{type:String, required:true, unique:true},
    password:{type:String, required:true, select:false},
    role:{type:String, default:"user", enum:["admin", "user"], required:true},
    profilePicture:{
        secure_url:{type:String, default:null},
        public_id:{type:String, default:null}
    }
}, {timestamps:true, strict:"throw"})

const UserModel = mongoose.model("user", UserSchema)


module.exports = UserModel