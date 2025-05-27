import jwt from 'jsonwebtoken';
import { Socket } from 'socket.io';
import { User } from '../models/user.js';

export const authenticateSocket = async (socket: Socket, next: any) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) throw new Error('Authentication error');

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    const user = await User.findById(decoded.userId);
    if (!user) throw new Error('User not found');

    socket.data.userId = user._id.toString();
    next();
  } catch (err) {
    next(new Error('Authentication failed'));
  }
};