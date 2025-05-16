import express, { Request, Response } from 'express';
import {userSchema} from '@syncpad/validation';
import {User} from '../models/user.js';
import jwt from 'jsonwebtoken';


const router = express.Router();

       router.post("/onboarding", async (req: Request, res: Response) => {
      const result = userSchema.safeParse(req.body);
       if(!result.success){
        return res.status(411).json({
            message : "Wrong inputs"
        });
       }

       const isAlreadyExists = await User.findOne({
        email: req.body.email
       })
       if(isAlreadyExists){
        return res.status(411).json({
           message : "Email Already Exists"
        })
       }

       const user = await User.create({
             firstName : req.body.firstName,
             lastName : req.body.lastName,
             email : req.body.email,
             password : req.body.password,
       })

       const userId = user._id;

        const JWT_SECRET = process.env.JWT_SECRET;
         if (!JWT_SECRET) {
          throw new Error('JWT_SECRET is not defined in environment variables');
         }

       const token = jwt.sign({userId}, JWT_SECRET , { expiresIn: '1h' });
       
         


       res.json({
        message : "User created Successfully" ,
        token : token
       })
})

export default router;