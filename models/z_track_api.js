import mongoose from 'mongoose';

const trackSchema = new mongoose.Schema({
  type: String,
},{ timestamps: true });

export default mongoose.models.ZTrackApi || mongoose.model('ZTrackApi', trackSchema);
