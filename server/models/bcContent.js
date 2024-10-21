import mongoose from "mongoose";

const bcContentSchema = new mongoose.Schema({
  date: { type: Date, required: true, unique: true }, // Change to Date type
  tableContent: { type: String, required: true },
});

const BcContent = mongoose.model("BcContent", bcContentSchema);

export default BcContent;
