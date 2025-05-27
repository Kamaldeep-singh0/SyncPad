import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db.js';
import registerRouter from './auth/register.js'
import loginRouter from './auth/login.js'
import workspaceRouer from './routes/workspace.js'
import documentRouter from './routes/document.js'
import whiteboardRouter from './routes/whiteboards.js'

dotenv.config();

const app = express();
const port = process.env.PORT || 3001 ;

connectDB();

app.use(cors());
app.use(express.json());

app.get('/', (req, res ) => {
  res.send('Hello, TypeScript Express!');
});


app.use('/api', registerRouter);
app.use('/api', loginRouter);
app.use('/api',workspaceRouer);
app.use('/api',documentRouter);
app.use('/api/whiteboard',whiteboardRouter)

app.listen(port,()=>{
    console.log(`The BackEnd is Running on Port:${port}`);
});