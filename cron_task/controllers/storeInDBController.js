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
      return { message: "EE Content already exists", isSuccess: false };
    } else {
      // Store the new content in the database
      const newContent = new EeContent(eeContent);
      const savePromise = newContent.save();
      const deletePromise = deleteOldestCollectionIfMoreThanLimit(EeContent, 3);

      // Run both operations concurrently
      await Promise.all([savePromise, deletePromise]);

      console.log("New EE content stored in the database and oldest record deleted if limit exceeded.");

      return { message: "EE Content stored successfully", isSuccess: true };
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
      return { message: "BC Content already exists", isSuccess: false };
    } else {
      // Store the new content in the database
      const newContent = new BcContent(bcContent);
      const savePromise = newContent.save();
      const deletePromise = deleteOldestCollectionIfMoreThanLimit(BcContent, 3);

      // Run both operations concurrently
      await Promise.all([savePromise, deletePromise]);

      console.log("New BC content stored in the database and oldest record deleted if limit exceeded.");

      return { message: "BC Content stored successfully", isSuccess: true };
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


