# Canadian PR Notification! 🇨🇦 #

This project started as a way for me to learn more about AWS services I hadn’t used before, beyond EC2 and S3, which I used in my college projects (Learnium, DEALicious). But I also wanted it to be practical—something I’d personally find useful.

The idea came when I realized I was following several Twitter and Instagram accounts for Canadian immigration updates, specifically for news on PR draws. Then it hit me: Why not create a tool that delivers these updates directly to my email?

Here’s how I tackled it:

Initially, I planned to build an Express.js server deployed on AWS Lambda, triggered by API Gateway. The API would be called periodically using AWS EventBridge to check IRCC's website, compare the data with the latest entry in my MongoDB database, and, if new, send emails to subscribers using SendGrid.
However, I quickly discovered that EventBridge doesn’t support HTTP requests like CRON jobs do (a method I’m more familiar with from my current job).
This led me to refactor the project into two repositories:
A function that fetches the latest announcements from IRCC’s website.
An Express.js server that creates an API to allow users to subscribe.
It’s been a great learning experience to explore new AWS services and refine the architecture along the way. The project is far from perfect, but I’m proud of its progress.

I’d love to hear your feedback or suggestions for improving it further!

# Tech Stack #
- AWS Lambda
- AWS EventBridge
- AWS API Gateway
- MongoDB
- Express.js
- SendGrid
- Node.js
- Next.js
- Tailwind CSS

# Installation #
This project is split into three repositories:
1. Frontend (Next.js)
2. Backend (Express.js - serverless)
3. Scraper (AWS Lambda function)

To run the project locally, 
1. Clone all three repositories.
2. Run `npm install` in each repository.
3. Create a `.env` file in each repository and add the necessary environment variables.
4. Uncomment the parts of the code that are commented out in /cron_task/index.js and /server/index.js that are meant for local development.
5. Run `npm run dev` in the frontend and backend repositories. Frontend will run on `localhost:3000` and backend on `localhost:5050`.
6. To run the scraper, run 'node index.js' in the /cron_task directory.

