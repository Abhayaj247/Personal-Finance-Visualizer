import mongoose, { Schema } from 'mongoose';

export interface ITransaction {
  _id: string;
  amount: number;
  date: string;
  description: string;
  category: string | mongoose.Types.ObjectId;
}

const TransactionSchema = new Schema({
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  description: { type: String, required: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category' }
}, { timestamps: true });

export default mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema);