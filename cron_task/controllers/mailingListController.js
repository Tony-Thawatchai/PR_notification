import MailingList from "../models/mailingList.js";

export const getMailingList = async () => {
    try {
      const mailingList = await MailingList.find();
  
      // Extract the email addresses from the mailing list that is isActive == true
      const emailList = mailingList
        .filter((item) => item.isActive)
        .map((item) => item.email);
  
      return emailList;
    } catch (error) {
      console.error("Error fetching mailing list:", error);
      throw new Error("Database query error");
    }
  };
  
  export const postMailingList = async (email) => {
    try {
      
  
      // Check if the email already exists in the database
      const existingEmail = await MailingList.findOne({ email });
  
      if (existingEmail) {
        console.log("Email already exists in the database.");
        return { message: "Email already exists", isSuccess: false };
        
      } else {
        // Store the new email in the database
        const newEmail = new MailingList({
          email,
          isActive: true,
          date: new Date(),
        });
        await newEmail.save();
        console.log("New email stored in the database.");
          return { message: "Email stored successfully", isSuccess: true };
        
      }
    } catch (error) {
      console.error("Error querying or storing email:", error);
      throw new Error("Database query or storage error");
      
    }
  };