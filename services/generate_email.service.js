const nodemailer = require("nodemailer");

const smtpConfiq = {
  service: "Gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
};

module.exports = {
  generateEmail: async (email, subject, html) => {
    try {
      const transporter = nodemailer.createTransport(smtpConfiq);
      const mailOptions = {
        from: process.env.SMTP_FROM,
        to: email,
        subject,
        text: "",
        html,
      };
      const res = await transporter.sendMail(mailOptions);

      return true;
    } catch (err) {
      console.log("err in generate email: ", err);
      return true;
    }
  },
};
