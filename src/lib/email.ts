import nodemailer from "nodemailer";

interface Email {
   to: string;
   subject: string;
   text: string;
}

const transporter = nodemailer.createTransport({
   host: process.env.SMTP_HOST,
   port: Number(process.env.SMTP_PORT ?? 465),
   secure: Number(process.env.SMTP_PORT ?? 465) === 465,
   auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
   },
});

export async function sendEmail({
   to,
   subject,
   text,
}: Email): Promise<boolean> {
   try {
      await transporter.sendMail({
         from: process.env.EMAIL_FROM ?? process.env.SMTP_USER,
         to,
         subject,
         text,
      });
      return true;
   } catch (error) {
      console.error("sendEmail failed", error);
      return false;
   }
}
