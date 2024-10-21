// backend controller code to
// 1. making a fetch to specific url of either IRCC's website for Express Entry draw announcement or BC immigration PNP draw announcement to get the HTML content of the page, scrape the page for the date updated, content of the table
// 2. send the scraped data to the database, to check if the date is already in the database, if not, store it in the database
// 3. if date is not in the database, send an email to the userlist in the database

import { getContentController } from "./getContentController.js";
import { checkAndStoreEeContent, checkAndStoreBcContent } from '../controllers/storeInDBController.js';

export const runPrNotify = async (req, res) => {
  let mockReq = {
    ee: true,
    bc: true,
  };

  req.body = mockReq;

  try {
    // get the content of the page
    let content = await getContentController(req.body);
    // console.log("content", content);
    // content = {
    //   eeContent: {
    //     drawNumber: '318',
    //     date: new Date('2024-10-03T07:00:00.000Z'),
    //     drawName: 'French language proficiency (Version 1)',
    //     drawSize: '1,000',
    //     drawCRS: '444'
    //   },
    //   bcContent: {
    //     date: new Date('2024-10-03T07:00:00.000Z'),
    //     tableContent: 'data'
    //   }
    // };
    // query in database to check if the date is already in the database
    // if not, store it in the database

    const eeResponse = await checkAndStoreEeContent(content.eeContent);
    const bcResponse = await checkAndStoreBcContent(content.bcContent);

    console.log("eeResponse", eeResponse);
    console.log("bcResponse", bcResponse);

    // send an email to the userlist in the database


    res.status(200).json({ message: 'Process completed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
