// controller code to get, add, update, delete email addresses to the mailing list

import MailingList from "../models/mailingList.js";

export const getEmails = async (req, res) => {
    try {
        const mailingList = await MailingList.find();
        return res.status(200).json(mailingList);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getEmail = async (req, res) => {
    const { email } = req.body;

    try {
        const existingEmail = await MailingList.findOne({
            email,
        });
        if (!existingEmail) {
            return res.status(404).json({ message: "Email not found" });
        }
        return res.status(200).json(existingEmail);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


export const addEmail = async (req, res) => {
  const { email } = req.body;

  try {
    const existingEmail = await MailingList.findOne({
      email,
    });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    } else {
      const newEmail = new MailingList({
        email,
        isActive: true,
        date: new Date(),
      });
      await newEmail.save();
      return res.status(201).json({ message: "Email stored successfully" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateEmail = async (req, res) => {
  const { email, isActive } = req.body;

  try {
    const existingEmail = await MailingList.findOne({
      email,
    });
    if (!existingEmail) {
      return res.status(404).json({ message: "Email not found" });
    }
    existingEmail.isActive = isActive;
    existingEmail.date = new Date();
    await existingEmail.save();
    return res.status(200).json({ message: "Email updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteEmail = async (req, res) => {
  const { email } = req.body;

  try {
    const existingEmail = await MailingList.findOne({
      email,
    });
    if (!existingEmail) {
      return res.status(404).json({ message: "Email not found" });
    } else {
      await existingEmail.delete();
      return res.status(200).json({ message: "Email deleted successfully" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
