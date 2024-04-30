import nodemailer from "nodemailer";

const sendVerify = async (email, subject, link) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      service: process.env.SERVICE,
      port: Number(process.env.PORT),
      secure: Boolean(process.env.SECURE),
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.USER,
      to: email,
      subject: subject,
      text: link,
    });

    console.log("Email sent successfully");
  } catch (error) {
    console.log("Error in sendVerify", error.message);
  }
};

export default sendVerify;
