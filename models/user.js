import { Schema,model } from "mongoose";
const userSchema=new Schema({
firstname:{
    type:String,
    required:true,
    minlength:3,
    maxlength:50
},
lastname:{
    type:String,
    required:true,
    minlength:3,
    maxlength:100
},
email:{
    type:String,
    required:true,
    unique:true
},
password:{
    type:String,
    required:true,
    minlength:8,
    maxlength:1024
}
});
const User=model('User',userSchema);
export default User;