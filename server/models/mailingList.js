import mongoose from "mongoose";

const mailingListSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    date: { type: Date, required: true },
    isActive: { type: Boolean, required: true },
    });

const MailingList = mongoose.model("MailingList", mailingListSchema);

export default MailingList;