import express from 'express';
import { DocumentModel } from '../models/Document.js';
import { authMiddleware } from '../middlewares/auth.js';
import { Workspace } from '../models/workspace.js';

const router = express.Router();


router.post('/documents', authMiddleware, async (req, res) => {
  try {
    const { title, workspaceId } = req.body;
    const userId = req.user?.userId;


    const workspace = await Workspace.findOne({
      _id: workspaceId,
      'members.userId': userId
    });

    if (!workspace) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to create documents in this workspace'
      });
    }

    const document = new DocumentModel({
      title,
      workspace: workspaceId,
      createdBy: userId,
      versions: [{
        content: '',
        createdBy: userId
      }]
    });

    await document.save();

    res.status(201).json({
      success: true,
      document: {
        id: document._id,
        title: document.title,
        workspace: document.workspace
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create document',
      send : error 
    });
  }
});


router.get('/documents/:id', authMiddleware, async (req, res) => {
  try {
    const document = await DocumentModel.findOne({
      _id: req.params.id,
      $or: [
        { createdBy: req.user?.userId },
        { 'workspace.members.userId': req.user?.userId }
      ]
    }).populate('createdBy', 'name email');

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found or not authorized'
      });
    }

    res.json({
      success: true,
      document: {
        id: document._id,
        title: document.title,
        content: document.content,
        createdBy: document.createdBy,
        updatedAt: document.updatedAt
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch document'
    });
  }
});


router.put('/documents/:id', authMiddleware, async (req, res) => {
  try {
    const { content } = req.body;
    const userId = req.user?.userId;

    const document = await DocumentModel.findOneAndUpdate(
      {
        _id: req.params.id,
        $or: [
          { createdBy: userId },
          { 'workspace.members.userId': userId }
        ]
      },
      {
        $set: { content },
        $push: {
          versions: {
            content,
            createdBy: userId
          }
        }
      },
      { new: true }
    );

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found or not authorized'
      });
    }

    res.json({
      success: true,
      message: 'Document updated',
      updatedAt: document.updatedAt
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update document'
    });
  }
});


router.get('/documents/:id/history', authMiddleware, async (req, res) => {
  try {
    const document = await DocumentModel.findOne(
      {
        _id: req.params.id,
        $or: [
          { createdBy: req.user?.userId },
          { 'workspace.members.userId': req.user?.userId }
        ]
      },
      { versions: 1 }
    ).populate('versions.createdBy', 'name email');

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found or not authorized'
      });
    }

    res.json({
      success: true,
      history: document.versions.map(v => ({
        content: v.content,
        createdAt: v.createdAt,
        createdBy: v.createdBy
      }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch document history'
    });
  }
});

export default router;