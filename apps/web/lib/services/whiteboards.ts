import express from "express";
import { Whiteboard } from "@/models/Whiteboard.js";
import { authMiddleware } from "@/middlewares/auth.js";

const router = express.Router();

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, workspaceId } = req.body;
    const whiteboard = new Whiteboard({
      title,
      workspace: workspaceId,
      createdBy: req.user?.userId,
      state: {
        elements: [],
        appState: {},
        files: []
      }
    });
    await whiteboard.save();
    res.status(201).json(whiteboard);
  } catch (error) {
    res.status(500).json({ message: 'Error creating whiteboard' });
  }
});

// Get whiteboard state
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const whiteboard = await Whiteboard.findOne({
      _id: req.params.id,
      $or: [
        { createdBy: req.user?.userId },
        { collaborators: req.user?.userId },
        { 'workspace.members.userId': req.user?.userId }
      ]
    });
    if (!whiteboard) return res.status(404).json({ message: 'Whiteboard not found' });
    res.json(whiteboard.state);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching whiteboard' });
  }
});

// Update whiteboard state
router.put('/:id/state', authMiddleware, async (req, res) => {
  try {
    const { state } = req.body;
    const whiteboard = await Whiteboard.findOneAndUpdate(
      {
        _id: req.params.id,
        $or: [
          { createdBy: req.user?.userId },
          { collaborators: req.user?.userId }
        ]
      },
      {
        $set: { state },
        $push: {
          versions: {
            state,
            createdBy: req.user?.userId
          }
        }
      },
      { new: true }
    );
    if (!whiteboard) return res.status(404).json({ message: 'Whiteboard not found' });
    res.json(whiteboard.state);
  } catch (error) {
    res.status(500).json({ message: 'Error updating whiteboard' });
  }
});

// Get version history
router.get('/:id/history', authMiddleware, async (req, res) => {
  try {
    const whiteboard = await Whiteboard.findOne(
      {
        _id: req.params.id,
        $or: [
          { createdBy: req.user?.userId },
          { collaborators: req.user?.userId }
        ]
      },
      { versions: 1 }
    ).populate('versions.createdBy', 'name email');
    if (!whiteboard) return res.status(404).json({ message: 'Whiteboard not found' });
    res.json(whiteboard.versions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching history' });
  }
});

export default router;