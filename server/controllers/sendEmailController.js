// to send an email to the userlist in the database

import sendgrid from "@sendgrid/mail";
import dotenv from "dotenv";
dotenv.config();
sendgrid.setApiKey(process.env.SENDGRID_API_KEY);


export const sendEmail = async (emailList, eeResponse, bcResponse, content) => {
  let subject;
  let text;

  //   update for both programs
  if (
    eeResponse.isSuccess !== null &&
    eeResponse.isSuccess === true &&
    bcResponse.isSuccess !== null &&
    bcResponse.isSuccess === true
  ) {
    subject = "Express Entry and BC PNP draw announcements";
    text = `New Express Entry and BC PNP draw announcements have been posted. EE Draw cut-off at : ${content.eeContent.drawCRS} with ${content.eeContent.drawSize} candidates for ${content.eeContent.drawName}, BC PNP Draw Date: ${content.bcContent.date} with detail ${content.bcContent.tableContent}`;
  }

  //   update for only Express Entry program
  if (
    eeResponse.isSuccess !== null &&
    eeResponse.isSuccess === true &&
    bcResponse.isSuccess !== null &&
    bcResponse.isSuccess === false
  ) {
    subject = "Express Entry draw announcement";
    text = `New Express Entry draw announcement has been posted. EE Draw cut-off at : ${content.eeContent.drawCRS} with ${content.eeContent.drawSize} candidates for ${content.eeContent.drawName}`;
  }

  //   update for only BC PNP program
  if (
    eeResponse.isSuccess !== null &&
    eeResponse.isSuccess === false &&
    bcResponse.isSuccess !== null &&
    bcResponse.isSuccess === true
  ) {
    subject = "BC PNP draw announcement";
    text = `New BC PNP draw announcement has been posted. BC PNP Draw Date: ${content.bcContent.date} with detail ${content.bcContent.tableContent}`;
  }

  try {
 
    const msg = {
        to: emailList,
        from: process.env.EMAIL_USER,
        subject: subject,
        text: text,
        html: `<strong>${text}</strong>`,
      }

      const info = await sendgrid.send(msg);
      console.log("Email sent successfully:", info);
      
    return { isSuccess: true, message: "Email sent successfully", info };
  } catch (error) {
    console.error("Error sending email: ", error);
    
    throw new Error("Error sending email");
    
  }
};
