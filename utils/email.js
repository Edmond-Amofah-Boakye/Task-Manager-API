import nodemailer from "nodemailer";

const sendEmail = async (details) =>{

    const transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        }
      });

      const sendOptions = {
        from: 'Edmond Amofah Boakye <welcome@eddy.io>',
        to: details.to,
        subject: details.subject,
        text: details.text
      }

      transport.sendMail(sendOptions)
};

export default sendEmail;