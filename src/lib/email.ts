/**
 * Отправка писем через Resend (https://resend.com). Библиотека не нужна: это один HTTP-запрос.
 *
 * Настройка (.env):
 *   RESEND_API_KEY=re_...                       ключ из панели Resend
 *   EMAIL_FROM="VELLUM <noreply@your-domain>"   адрес отправителя
 *
 * Пока ключа нет (локальная разработка), письмо не отправляется, а печатается в терминале,
 * где запущен `npm run dev`. Код подтверждения берите оттуда.
 *
 * Важно про Resend: без собственного домена он отправляет письма только на ваш собственный адрес
 * и только с onboarding@resend.dev. Для пет-проекта этого хватает, чтобы проверить весь путь.
 */

const DEFAULT_FROM = "VELLUM <onboarding@resend.dev>";

interface Email {
   to: string;
   subject: string;
   text: string;
}

/** true, если письмо отправлено (или напечатано в режиме разработки) */
export async function sendEmail({ to, subject, text }: Email): Promise<boolean> {
   const apiKey = process.env.RESEND_API_KEY;

   if (!apiKey) {
      if (process.env.NODE_ENV === "production") {
         console.error("RESEND_API_KEY is not set: email was not sent");
         return false;
      }
      console.log(`\n┌─ EMAIL (dev, not sent) ─────────────\n│ To: ${to}\n│ Subject: ${subject}\n│\n${text.replace(/^/gm, "│ ")}\n└─────────────────────────────────────\n`);
      return true;
   }

   try {
      const response = await fetch("https://api.resend.com/emails", {
         method: "POST",
         headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
         body: JSON.stringify({ from: process.env.EMAIL_FROM ?? DEFAULT_FROM, to: [to], subject, text }),
      });
      if (!response.ok) {
         console.error("Resend rejected the email", response.status, await response.text());
         return false;
      }
      return true;
   } catch (error) {
      console.error("sendEmail failed", error);
      return false;
   }
}
