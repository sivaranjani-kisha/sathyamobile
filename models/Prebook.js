// models/Prebook.js
import mongoose from 'mongoose';

const PrebookSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    phone: String,
    store: String,
    product: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Prebook || mongoose.model('Prebook', PrebookSchema);
