"use server";

import { prisma } from "@/lib/prisma";
import { LIMITS, getClientIp, isBot, rateLimit } from "@/lib/security";
import { isValidEmail, readText } from "@/utils";

export interface ContactState {
   ok: boolean;
   retryAfter?: number;
   errors?: { name?: string; email?: string; message?: string; form?: string };
   values?: { name: string; email: string; topic: string; message: string };
}

const TOPICS = ["order", "repair", "sizing", "gift-card", "other"] as const;

export async function sendMessage(_prevState: ContactState, formData: FormData): Promise<ContactState> {
   const topicInput = readText(formData, "topic");
   const values = {
      name: readText(formData, "name"),
      email: readText(formData, "email").toLowerCase(),
      topic: (TOPICS as readonly string[]).includes(topicInput) ? topicInput : "other",
      message: readText(formData, "message").slice(0, 2000),
   };

   // Бот видит "сообщение отправлено", но мы его не сохраняем
   if (isBot(formData)) return { ok: true };
   const limit = await rateLimit(`contact:ip:${await getClientIp()}`, LIMITS.contactByIp);
   if (!limit.ok) return { ok: false, retryAfter: limit.retryAfter, values };

   const errors: NonNullable<ContactState["errors"]> = {};
   if (values.name.length < 2) errors.name = "Enter your name.";
   if (!isValidEmail(values.email)) errors.email = "Enter an email address like name@example.com.";
   if (values.message.length < 10) errors.message = "Tell us a little more, at least 10 characters.";
   if (Object.keys(errors).length > 0) return { ok: false, errors, values };

   try {
      await prisma.contactMessage.create({ data: values });
   } catch (error) {
      console.error("sendMessage failed", error);
      return { ok: false, errors: { form: "We couldn't send your message. Please try again." }, values };
   }

   return { ok: true };
}
