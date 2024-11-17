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
    console.log("both programs");
    subject = "Express Entry and BC PNP draw announcements";
    text = ` <h1>Express Entry and BC PNP Draw Announcements</h1>
      <p>New Express Entry and BC PNP draw announcements have been posted.</p>
      <h2>Express Entry</h2>
      <p>Draw cut-off at: ${content.eeContent.drawCRS} with ${content.eeContent.drawSize} candidates for ${content.eeContent.drawName}.</p>
      <p> Link : <a href="https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/submit-profile/rounds-invitations.html">Click here</a></p>
      <h2>BC PNP</h2>
      <p>Draw Date: ${content.bcContent.date}</p>
      <p>Details:</p>
      ${content.bcContent.tableContent}
      <p> Link : <a href="https://www.welcomebc.ca/immigrate-to-b-c/invitations-to-apply">Click here</a>
      `;
      
  }

  //   update for only Express Entry program
  if (
    eeResponse.isSuccess !== null &&
    eeResponse.isSuccess === true &&
    bcResponse.isSuccess !== null &&
    bcResponse.isSuccess === false
  ) {
    console.log("only EE program");
    subject = "Express Entry draw announcement";
    text = ` <h1>Express Entry Draw Announcement</h1>
      <p>New Express Entry draw announcement has been posted.</p>
      <p>Draw cut-off at: ${content.eeContent.drawCRS} with ${content.eeContent.drawSize} candidates for ${content.eeContent.drawName}.</p>
      <p> Link : <a href="https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/submit-profile/rounds-invitations.html">Click here</a></p>`;
  }

  //   update for only BC PNP program
  if (
    eeResponse.isSuccess !== null &&
    eeResponse.isSuccess === false &&
    bcResponse.isSuccess !== null &&
    bcResponse.isSuccess === true
  ) {
    console.log("only BC PNP program");
    subject = "BC PNP draw announcement";
    text = `<h1>BC PNP Draw Announcement</h1>
      <p>New BC PNP draw announcement has been posted.</p>
      <p>Draw Date: ${content.bcContent.date}</p>
      <p>Details:</p>
      ${content.bcContent.tableContent}
      <p> Link : <a href="https://www.welcomebc.ca/immigrate-to-b-c/invitations-to-apply">Click here</a>`;
  }

  try {
    console.log("process.env.SENDGRID_API_KEY",process.env.SENDGRID_API_KEY);
    console.log("process.env.EMAIL_USER",process.env.EMAIL_USER);
    console.log("emailList",emailList);
    const msg = {
      to: emailList,
      from: process.env.EMAIL_USER,
      subject: subject,
      text: text,
      html: `<strong>${text}</strong>`,
    };

    console.log("Sending email...", msg);
    const info = await sendgrid.send(msg);
    console.log("Email sent successfully:", info);

    return { isSuccess: true, message: "Email sent successfully", info };
  } catch (error) {
    console.error("Error sending email: ", error);

    throw new Error("Error sending email");
  }
};
