const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const nodemailer = require("nodemailer");
const port = process.env.PORT || 3000;
dotenv.config();

app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});
app.get("/", (req, res) => {
  res.send("Server is running");
});
app.post("/send-email", (req, res) => {
  const { name, email, subject, message } = req.body;

  (async () => {
    try {
      const info = await transporter.sendMail({
        from: email,
        to: process.env.EMAIL,
        subject: subject,
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      });
      console.log("Message sent:", info.messageId);
      res.json({ messageID: info.messageId });
    } catch (error) {
      console.error("Error while sending mail", error);
    }
  })();
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
