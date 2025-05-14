import mongoose from "mongoose";

const {Schema} = mongoose ;

const userSchema = new Schema({
    firstName : {
        type : String,
        minLength : 3 ,
        trim: true,
        required: true,
        maxLength : 30
    },
    lastName :{
        type : String,
        minLength : 3,
        trim : true,
        required : false ,
        maxLength : 30
    },
    email : {
        type : String,
        required : [true,'Email is required'],
        unique : true,
        lowercase : true,
        trim : true,
    },
    password : {
        type : String ,
        required : true
    }
})

const User = mongoose.model('User',userSchema);

module.exports ={
    User
};