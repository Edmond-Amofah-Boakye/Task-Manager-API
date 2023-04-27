import nodemailer from "nodemailer";


const testing = () =>{
    const transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "8228bf560423d3",
          pass: "146554f8a12cd2"
        }
      });

      const options = {
        from: 'Edmond Amofah Boakye <welcome@eddy.io>',
        to: "eddy@gmail.com",
        subject:"Email testing",
        text: "This is for email testing"
      }

      transport.sendMail(options)


}

export default testing;