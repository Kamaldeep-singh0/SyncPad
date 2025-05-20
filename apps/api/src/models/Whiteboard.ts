import mongoose, { Schema, Document } from 'mongoose';

interface IWhiteboardState {
  elements: mongoose.Types.Array<any>;
  appState: Record<string, any>;
  files: mongoose.Types.Array<any>;
}

interface IWhiteboard extends Document {
  title: string;
  workspace: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  state: IWhiteboardState;
  versions: {
    state: IWhiteboardState;
    createdBy: mongoose.Types.ObjectId;
    createdAt: Date;
  }[];
  collaborators: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const WhiteboardSchema = new Schema<IWhiteboard>({
  title: { type: String, required: true },
  workspace: { type: Schema.Types.ObjectId, ref: 'Workspace', required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  state: {
    elements: { type: [], default: [] },
    appState: { type: Object, default: {} },
    files: { type: [], default: [] }
  },
  versions: [{
    state: {
      elements: { type: [], required: true },
      appState: { type: Object, required: true },
      files: { type: [], required: true }
    },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now }
  }],
  collaborators: [{ 
    type: Schema.Types.ObjectId, ref: 'User' 
  }]
}, { timestamps: true });

export const Whiteboard = mongoose.model<IWhiteboard>('Whiteboard', WhiteboardSchema);