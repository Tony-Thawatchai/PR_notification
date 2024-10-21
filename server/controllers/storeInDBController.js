import mongoose from "mongoose";
import EeContent from "../models/eeContent.js";
import BcContent from "../models/bcContent.js";

export const checkAndStoreEeContent = async (eeContent) => {
  try {
    const { date } = eeContent;

    // Check if the date already exists in the database
    const existingContent = await EeContent.findOne({ date });

    if (existingContent) {
      console.log("EE Content for this date already exists in the database.");
      return { message: "EE Content already exists" };
    } else {
      // Store the new content in the database
      const newContent = new EeContent(eeContent);
      await newContent.save();
      console.log("New EE content stored in the database.");

      // Delete the oldest record if the collection exceeds the limit
      await deleteOldestCollectionIfMoreThanLimit(EeContent, 3);

      return { message: "EE Content stored successfully" };
    }
  } catch (error) {
    console.error("Error querying or storing EE content:", error);
    throw new Error("Database query or storage error");
  }
};

export const checkAndStoreBcContent = async (bcContent) => {
  try {
    const { date } = bcContent;

    // Check if the date already exists in the database
    const existingContent = await BcContent.findOne({ date });

    if (existingContent) {
      console.log("BC Content for this date already exists in the database.");
      return { message: "BC Content already exists" };
    } else {
      // Store the new content in the database
      const newContent = new BcContent(bcContent);
      await newContent.save();
      console.log("New BC content stored in the database.");

      // Delete the oldest record if the collection exceeds the limit
      await deleteOldestCollectionIfMoreThanLimit(BcContent, 3);

      return { message: "BC Content stored successfully" };
    }
  } catch (error) {
    console.error("Error querying or storing BC content:", error);
    throw new Error("Database query or storage error");
  }
};

const deleteOldestCollectionIfMoreThanLimit = async (model, limit) => {
  try {
    const count = await model.countDocuments();
    if (count > limit) {
      const oldest = await model.findOne().sort({ date: 1 });
      if (oldest) {
        await model.deleteOne({ _id: oldest._id });
        console.log("Deleted oldest record from the database:", oldest);
      } else {
        console.log("No records found to delete.");
      }
    }
  } catch (error) {
    console.error("Error deleting oldest record:", error);
    throw new Error("Database deletion error");
  }
};
