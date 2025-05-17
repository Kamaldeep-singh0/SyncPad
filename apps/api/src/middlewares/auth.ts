import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.js';



      export const authMiddleware = async (req: Request,res: Response,next: NextFunction) => {
           try {
    
               const token = req.header('Authorization')?.replace('Bearer ', '');

              if (!token) {
               return res.status(401).json({
                success: false,
                message: 'No token, authorization denied'
                 });
                 }

    
             if (!process.env.JWT_SECRET) {
             throw new Error('JWT_SECRET not configured');
             }

             const decoded = jwt.verify(token, process.env.JWT_SECRET) as { userId: string };

   
              const user = await User.findById(decoded.userId);

             if (!user) {
              return res.status(401).json({
              success: false,
              message: 'User not found'
              });
             }

    
             req.user = { userId: user._id.toString() };

             next();
            } catch (err) {
             console.error('Authentication error:', err);
 
            res.status(401).json({
            success: false,
            });
  }
};