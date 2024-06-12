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

    const forgetPasswordHTML = `
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #fff;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        h1 {
          color: #333;
        }
        p {
          color: #555;
        }
        /* Add more styles as needed */
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Hello,</h1>
        <p>Your new password is: <strong>${link}</strong></p>
        <p>Please use this new password to log in to your account.</p>
        <p>If you did not request this change, please contact us immediately.</p>
        <p>Thank you!</p>
      </div>
    </body>
    </html>
  `;

    const verifyEmailHTML = `
  <html >
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background-color: #ffffff;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }
      h1 {
        color: #333333;
      }
      p {
        color: #555555;
        margin-bottom: 20px;
      }
      .button {
        display: inline-block;
        padding: 10px 20px;
        background-color: #4cb5f9;
        color:#FFFFFF;
        text-decoration: none;
        border-radius: 5px;
        transition: background-color 0.3s ease;
        font-weight: bold;
      }
      .button a {
        color:#FFFFFF;
        text-decoration: none;
      }
      .button:hover {
        background-color: #C2E7FF;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Email Verification</h1>
      <p>Thank you for signing up! Click the button below to verify your email address and start using our services:</p>
      <a href=${link} class="button">Verify Email</a>
      <p>If you did not sign up for this service, you can safely ignore this email.</p>
      <p>Thank you,</p>
      <p>From ChatChat</p>
    </div>
  </body>
  </html>
  `;

    await transporter.sendMail({
      from: process.env.USER,
      to: email,
      subject: subject,
      text: link,
      html: subject === "New Password" ? forgetPasswordHTML : verifyEmailHTML,
    });

    console.log("Email sent successfully");
  } catch (error) {
    console.log("Error in sendVerify", error.message);
  }
};

export default sendVerify;
