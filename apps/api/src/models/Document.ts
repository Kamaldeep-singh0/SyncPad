import mongoose, { Schema } from 'mongoose';
import { Document } from 'mongoose';

interface IDocumentVersion {
  content: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
}

interface IDocument extends Document {
  title: string;
  content: string;
  workspace: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
    createdAt: Date;
  updatedAt: Date;
  versions: IDocumentVersion[];
}

const DocumentSchema = new Schema<IDocument>({
  title: { type: String, required: true },
  content: { type: String, default: '' },
  workspace: { type: Schema.Types.ObjectId, ref: 'Workspace', required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  versions: [{
    content: { type: String, required: true , default:'' },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

export const DocumentModel = mongoose.model<IDocument>('Document', DocumentSchema);