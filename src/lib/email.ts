"use server";

import nodemailer from "nodemailer";
export async function sendEmail(
  from: string,
  to: string,
  subject: string,
  react: React.ReactNode
) {
  const ReactDOMServer = (await import("react-dom/server")).default;
  const transporter = nodemailer.createTransport({
    host: "smtp.forwardemail.net",
    port: 465,
    secure: true,
    auth: {
      user: from,
      pass: process.env.FORWARDEMAIL_SECRET,
    },
  });
  const info = await transporter.sendMail({
    from,
    to,
    subject,
    html: ReactDOMServer.renderToStaticMarkup(react),
  });
  if (!info.accepted) {
    console.error("Error sending email:", info.response);
    throw new Error(info.response);
  }
}
