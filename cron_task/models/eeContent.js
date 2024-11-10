import mongoose from 'mongoose';

const eeContentSchema = new mongoose.Schema({
  drawNumber: { type: String, required: true },
  date: { type: Date, required: true, unique: true }, 
  drawName: { type: String, required: true },
  drawSize: { type: String, required: true },
  drawCRS: { type: String, required: true },
});

const EeContent = mongoose.model('EeContent', eeContentSchema);

export default EeContent;