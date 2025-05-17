import express from "express";
import { Workspace } from "../models/workspace.js";
import { authMiddleware } from "../middlewares/auth.js";


const router = express.Router();

router.post('/workspace',authMiddleware, async (req , res)=>{
    try{
        const {name , description } = req.body;

        const workspace = new Workspace({
            name,
            description,
            createdBy: req.userId,
            members : [{
                userId : req.userId,
                role: 'Owner'
            }]
        });
        await workspace.save();

        res.status(201).json({
            success : true,
            workspace
        });
    } catch(error){
        res.status(500).json({
            success: false,
            message : 'Failed to create workspace'
        });
    }
});