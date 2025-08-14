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
            createdBy: req.user?.userId,
            members : [{
                userId : req.user?.userId,
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



router.get('/workspaces', authMiddleware, async (req, res) => {
    try {
        if (!req.user?.userId) {
            return res.status(401).json({
                success: false,
                message: "User ID missing"
            });
        }

        const workspaces = await Workspace.find({
            $or: [
                { createdBy: req.user.userId },
                { 'members.userId': req.user.userId }
            ]
        });
      

        res.status(200).json({
            success: true,
            count: workspaces.length,
            workspaces
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch workspaces',
        });
    }
});
router.post('/workspace/:id/invite', authMiddleware,async (req, res)=>{
    try{
        const{email,role} = req.body;
        const workspaceId = req.params.id;

        const workspace = await Workspace.findOne({
            _id : workspaceId,
            'members.userId' : req.user?.userId,
            'members.role' : 'Owner'
        });

        if(!workspace){
            return res.status(403).json({
                success: false,
                message : "only owner can invites users"
            });
        }



   res.json({
      success: true,
      message: 'Invitation sent successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to send invitation'
    });
  }
});


router.patch('/workspaces/:id/role', authMiddleware, async(req,res)=>{
    try{
        const{userId , newRole} = req.body;
        const workspaceId = req.params.id;

        const isOwner = await Workspace.exists({
            _id:workspaceId,
            'members.userId' : req.user?.userId,
            'members.role' : 'Owner'
        });

        if(!isOwner){
            return res.status(403).json({
                success : false,
                message: "Only Owner can Change roles"
            });
        }

        await Workspace.updateOne(
            {
                _id : workspaceId,
                'members.userId' : userId
            },
            {
                $set:{'members.$.role':newRole}
            }
        );

        res.json({
            success: true,
            message: "Role updated Successfully"
        });
    } catch(error){
        res.status(500).json({
            success : false,
            message : "Failed to update role "
        });
    }
});

export default router;

