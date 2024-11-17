// to send an email to the userlist in the database

import sendgrid from "@sendgrid/mail";
import dotenv from "dotenv";
dotenv.config();
sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

export const sendEmail = async (emailList, eeResponse, bcResponse, content) => {

  let subject = "";
  let text = "";

  if (eeResponse.isSuccess === true) {
    subject = "Express Entry draw announcement";
    text += `<h1>Express Entry Draw Announcement</h1>
      <p>New Express Entry draw announcement has been posted.</p>
      <p>Draw cut-off at: ${content.eeContent.drawCRS} with ${content.eeContent.drawSize} candidates for ${content.eeContent.drawName}.</p>
      <p> Link : <a href="https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/submit-profile/rounds-invitations.html">Click here</a></p>`;
  }

  if (bcResponse.isSuccess === true) {
    if (subject) {
      subject = "BC PNP" + " & " + subject;
    } else {
      subject = "BC PNP draw announcement";
    }
    text += `<h1>BC PNP Draw Announcement</h1>
      <p>New BC PNP draw announcement has been posted.</p>
      <p>Draw Date: ${content.bcContent.date}</p>
      <p>Details:</p>
      ${content.bcContent.tableContent}
      <p> Link : <a href="https://www.welcomebc.ca/immigrate-to-b-c/invitations-to-apply">Click here</a>`;
  }

  try {
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
