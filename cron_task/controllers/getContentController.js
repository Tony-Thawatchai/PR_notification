import { fetchContentService } from "./helper/fetchContentService.js";

export const getContentController = async (req, res) => {
  // 1. check if the request is for Express Entry draw announcement or BC PNP draw announcement or both
  // 2. make a fetch to the specific url of either IRCC's website for Express Entry draw announcement or BC
  // 3. scrape the page for the date updated, content of the table
  // 4. return the scraped data {date updated, content of the table}

  let eeUrl =
    "https://www.canada.ca/content/dam/ircc/documents/json/ee_rounds_123_en.json";
  let bcUrl = "https://www.welcomebc.ca/immigrate-to-b-c/invitations-to-apply";
  let responseObject = {};

  // Create an array to hold the promises
  const promises = [];

  // if request is for Express Entry draw announcement
  if (req.ee) {
    let isJson = true;

    // make a fetch to the specific url of IRCC's website for Express Entry draw announcement
    const eePromise = fetchContentService(eeUrl, isJson).then((jsonResponse) => {
      // Ensure responseObject.eeContent is initialized
      if (!responseObject.eeContent) {
        responseObject.eeContent = {};
      }

      if (jsonResponse !== null) {
        responseObject.eeContent.drawNumber = jsonResponse.eeContent.drawNumber;
        responseObject.eeContent.date = new Date(jsonResponse.eeContent.drawDate);
        responseObject.eeContent.drawName = jsonResponse.eeContent.drawName;
        responseObject.eeContent.drawSize = jsonResponse.eeContent.drawSize;
        responseObject.eeContent.drawCRS = jsonResponse.eeContent.drawCRS;
      } else {
        responseObject.eeContent = null;
      }
    });

    // Add the promise to the array
    promises.push(eePromise);
  }

  // if request is for BC PNP draw announcement
  if (req.bc) {
    let isJson = false;

    // make a fetch to the specific url
    const bcPromise = fetchContentService(bcUrl, isJson).then((bcJsonResponse) => {
      // Ensure responseObject.bcContent is initialized
      if (!responseObject.bcContent) {
        responseObject.bcContent = {};
      }

      if (bcJsonResponse !== null) {
        responseObject.bcContent.date = bcJsonResponse.bcContent.date;
        responseObject.bcContent.tableContent = bcJsonResponse.bcContent.tableContent;
      } else {
        responseObject.bcContent = null;
      }
    });

    // Add the promise to the array
    promises.push(bcPromise);
  }

  // Wait for all promises to complete
  await Promise.all(promises);

  return responseObject;
};