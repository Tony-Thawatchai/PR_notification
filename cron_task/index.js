import mongoose from 'mongoose';
import { checkAndStoreEeContent, checkAndStoreBcContent } from './controllers/storeInDBController.js';
import { getMailingList, postMailingList } from "./controllers/mailingListController.js";
import { sendEmail } from './controllers/sendEmailController.js';
import {getContentController} from './controllers/getContentController.js';
import { programToFetch } from './config.js';
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

    // Get the content of the page
    let content = await getContentController(programToFetch);

    // Query in database to check if the date is already in the database
    // If not, store it in the database
    const [eeResponse, bcResponse] = await Promise.all([
      checkAndStoreEeContent(content.eeContent),
      checkAndStoreBcContent(content.bcContent)
    ]);

    console.log("eeResponse", eeResponse);
    console.log("bcResponse", bcResponse);

    // Send an email to the userlist in the database if new content is stored
    if (eeResponse.isSuccess || bcResponse.isSuccess) {
      const emailList = await getMailingList();

      // test email
      // const emailList = ['au.thawatchai@gmail.com', 'tony.ts2022@gmail.com' ]

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

// Run the handler function in the local environment to test, comment out when deploying
// handler();