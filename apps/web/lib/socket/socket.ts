import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import { authenticateSocket } from '../middlewares/socketAuth.js';
import {DocumentModel} from '@/models/Document.js';
import {Whiteboard} from '@/models/Whiteboard.js';

export const initSocket = (server: HttpServer) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST']
    }
  });

  // Authentication middleware
  io.use(authenticateSocket);

  const collabNamespace = io.of('/collab');

  collabNamespace.on('connection', (socket) => {
    console.log(`User ${socket.data.userId} connected`);

    // Join document/whiteboard rooms
    socket.on('join-room', async ({ docId, whiteboardId }) => {
      if (docId) {
        socket.join(`doc-${docId}`);
        socket.to(`doc-${docId}`).emit('user-joined', {
          userId: socket.data.userId,
          timestamp: new Date()
        });
      }
      if (whiteboardId) {
        socket.join(`wb-${whiteboardId}`);
      }
    });

    // DocumentModel collaboration events
    socket.on('doc-edit', async ({ docId, changes }) => {
      const doc = await DocumentModel.findByIdAndUpdate(
        docId,
        { $set: { content: changes } },
        { new: true }
      );
      socket.to(`doc-${docId}`).emit('doc-updated', doc.content);
    });

    // Whiteboard drawing events
    socket.on('wb-draw', ({ whiteboardId, elements }) => {
      socket.to(`wb-${whiteboardId}`).emit('wb-update', elements);
    });

    // Cursor position sharing
    socket.on('cursor-move', ({ docId, whiteboardId, position }) => {
      const room = docId ? `doc-${docId}` : `wb-${whiteboardId}`;
      socket.to(room).emit('cursor-update', {
        userId: socket.data.userId,
        position
      });
    });

    // Presence notifications
    socket.on('disconnect', () => {
      console.log(`User ${socket.data.userId} disconnected`);
    });
  });

  return io;
};