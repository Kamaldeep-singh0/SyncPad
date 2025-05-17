import mongoose, { Document, Schema } from 'mongoose';

export interface IWorkspace extends Document {
  name: string;
  description?: string;
  createdBy: mongoose.Types.ObjectId;
  members: Array<{
     userId: mongoose.Types.ObjectId;
    role: 'Owner' | 'Editor' | 'Viewer';
  }>
}


const WorkspaceSchema = new Schema<IWorkspace>({
  name: { type: String, required: true },
  description: String,
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    role: { type: String, enum: ['Owner', 'Editor', 'Viewer'], default: 'Viewer' }
  }]
}, { timestamps: true });

export const Workspace = mongoose.model<IWorkspace>('Workspace',WorkspaceSchema);