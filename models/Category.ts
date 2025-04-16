import mongoose, { Schema } from 'mongoose';

export interface ICategory {
  _id: string;
  name: string;
  color: string;
  icon?: string;
}

const CategorySchema = new Schema({
  name: { type: String, required: true, unique: true },
  color: { type: String, required: true },
  icon: { type: String }
}, { timestamps: true });

export default mongoose.models.Category || mongoose.model('Category', CategorySchema);