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




const userSchemaMongo = new Schema({
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

userSchemaMongo.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err as Error);
  }
});

userSchemaMongo.methods.comparePassword = async function(candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User',userSchemaMongo);

module.exports ={
    User
};