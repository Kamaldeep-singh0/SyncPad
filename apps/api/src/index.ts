import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db.js';

const app = express();
const port = process.env.PORT || 3001 ;

connectDB();

app.use(cors());
app.use(express.json());

app.get('/', (req, res ) => {
  res.send('Hello, TypeScript Express!');
});

app.listen(port,()=>{
    console.log(`The BackEnd is Running on Port:${port}`);
});