import mongoose, { Schema, model, models } from "mongoose";

const BudgetSchema = new Schema({
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  month: { type: String, required: true }, // e.g., "2025-04"
  amount: { type: Number, required: true },
});

export default models.Budget || model("Budget", BudgetSchema);
