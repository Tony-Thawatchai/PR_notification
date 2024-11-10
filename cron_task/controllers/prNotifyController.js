// backend controller code to
// 1. making a fetch to specific url of either IRCC's website for Express Entry draw announcement or BC immigration PNP draw announcement to get the HTML content of the page, scrape the page for the date updated, content of the table
// 2. send the scraped data to the database, to check if the date is already in the database, if not, store it in the database
// 3. if date is not in the database, send an email to the userlist in the database

import { getContentController } from "./getContentController.js";
import {
  checkAndStoreEeContent,
  checkAndStoreBcContent,
} from "../controllers/storeInDBController.js";
import { getMailingList, postMailingList } from "../controllers/mailingListController.js";

import { sendEmail } from "../controllers/sendEmailController.js";

export const runPrNotify = async (req, res) => {
  let mockReq = {
    ee: true,
    bc: true,
  };

  req.body = mockReq;

  try {
    // get the content of the page
    let content = await getContentController(req.body);

    // query in database to check if the date is already in the database
    // if not, store it in the database
    const [eeResponse, bcResponse] = await Promise.all([
      checkAndStoreEeContent(content.eeContent),
      checkAndStoreBcContent(content.bcContent)
    ]);

    console.log("eeResponse", eeResponse);
    console.log("bcResponse", bcResponse);


    // send an email to the userlist in the database
    if (
      (eeResponse.isSuccess !== null && eeResponse.isSuccess === true) ||
      (bcResponse.isSuccess !== null && bcResponse.isSuccess === true)
    ) {
      // get email list
      const emailList = await getMailingList();
      console.log("emailList", emailList);
      console.log("Sending email to EE userlist.");

      // send email
      let isSendMailSuccess = await sendEmail(
        emailList,
        eeResponse,
        bcResponse,
        content
      );
      res.status(200).json({ message: isSendMailSuccess });
    } else {
      console.log("No email sent.");
      res.status(200).json({ message: "No email sent." });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

