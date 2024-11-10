import mongoose from 'mongoose';
import { checkAndStoreEeContent, checkAndStoreBcContent } from './controllers/storeInDBController.js';
import { getMailingList, postMailingList } from "./controllers/mailingListController.js";
import { sendEmail } from './controllers/sendEmailController.js';
import {getContentController} from './controllers/getContentController.js';
import dotenv from 'dotenv';

dotenv.config();

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("DB Connection is ready");
  })
  .catch((error) => {
    console.log(error);
  });

export const handler = async (event) => {
  try {
    // Mock request body
    const mockReq = {
      ee: true,
      bc: true,
    };

    // Get the content of the page
    let content = await getContentController(mockReq);

    // Query in database to check if the date is already in the database
    // If not, store it in the database
    const [eeResponse, bcResponse] = await Promise.all([
      checkAndStoreEeContent(content.eeContent),
      checkAndStoreBcContent(content.bcContent)
    ]);

    console.log("eeResponse", eeResponse);
    console.log("bcResponse", bcResponse);

    // Send an email to the userlist in the database if new content is stored
    if (eeResponse.message === 'EE Content stored successfully' || bcResponse.message === 'BC Content stored successfully') {
      const emailList = await getMailingList();
      const emailResponse = await sendEmail(emailList, eeResponse, bcResponse, content);
      console.log("emailResponse", emailResponse);

      if (emailResponse.success) {
        return {
          statusCode: 200,
          body: JSON.stringify({ message: 'Process completed successfully', emailResponse }),
        };
      } else {
        return {
          statusCode: 500,
          body: JSON.stringify({ message: 'Process completed with errors', emailResponse }),
        };
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'No new content to send' }),
    };
  } catch (error) {
    console.error("Error processing event:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    };
  }
};
