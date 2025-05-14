import mongoose from "mongoose";
import bcrypt from 'bcrypt';
const SALT_WORK_FACTOR = 10;

const {Schema} = mongoose ;

interface IUser extends Document {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

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

userSchema.pre('save',(next)=>{
    const user  = this;

    if(!user.isModified('password')) return next();

    bcrypt.genSalt(SALT_WORK_FACTOR,(err,salt)=>{
        if(err) return next(err);

        bcrypt.hash(user.password,salt,(err,hash)=>{
            if(err) return next(err);

            user.password =hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function(candidatePassword : String, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

const User = mongoose.model('User',userSchema);

module.exports ={
    User
};