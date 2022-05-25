const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");

async function sendEmail(to, subject, template, context) {
  const templateFile = fs.readFileSync(
    path.join("email-templates", template),
    "utf-8"
  );
  template = handlebars.compile(templateFile);
  const html = template(context);

  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: false,
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  });
  await transporter.sendMail({
    from: `Sourcebae`,
    to,
    subject,
    html,
  });
  return html;
}

module.exports = sendEmail;
