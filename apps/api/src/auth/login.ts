import express, { Request, Response } from 'express';
import {User} from '../models/user.js';
import jwt from 'jsonwebtoken';


const router = express.Router();

 router.post("/login", async (req: Request, res: Response) => {
     const { email, password } = req.body;
    
       if (!email || !password) {
        return res.status(411).json({
            message: "Email and password are required"
        });
    }
     try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
            const isPasswordValid = await user.comparePassword(password);
          if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        } 

        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined in environment variables');
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

        const userResponse = {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
        };
        
        res.json({
            message: "Login successful",
            token: token,
            user: userResponse
        });
         } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
          
 })

 export default router;
