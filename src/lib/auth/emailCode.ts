/**
 * Подтверждение email 6-значным кодом.
 *
 *  1. issueEmailCode: генерируем код, кладём в базу его хеш (срок 10 минут) и отправляем код письмом.
 *  2. checkEmailCode: человек ввёл код, сравниваем хеш. Неверный ввод увеличивает счётчик попыток.
 *     После 5 ошибок код сгорает: перебрать 1 000 000 вариантов за 5 попыток нельзя.
 *
 * Код хранится в виде хеша по той же причине, что и пароль: утечка таблицы не раскрывает коды.
 */
import { createHash, randomInt, timingSafeEqual } from "node:crypto";
import { sendEmail } from "@/lib/email";
import { getT } from "@/lib/i18n/server";
import { prisma } from "@/lib/prisma";

export const CODE_LENGTH = 6;
export const CODE_TTL_MINUTES = 10;
const MAX_ATTEMPTS = 5;

const hashCode = (userId: number, code: string) => createHash("sha256").update(`${userId}:${code}`).digest("hex");

/** Случайные 6 цифр. randomInt криптографически надёжный, Math.random для такого не годится. */
const generateCode = () => String(randomInt(0, 10 ** CODE_LENGTH)).padStart(CODE_LENGTH, "0");

/** Создаёт новый код (старый заменяется) и отправляет письмо. true, если письмо ушло. */
export async function issueEmailCode(userId: number, email: string): Promise<boolean> {
   const code = generateCode();
   const data = {
      codeHash: hashCode(userId, code),
      expiresAt: new Date(Date.now() + CODE_TTL_MINUTES * 60 * 1000),
      attempts: 0,
   };

   // upsert: у пользователя один код сразу, новый затирает старый
   await prisma.emailCode.upsert({ where: { userId }, create: { userId, ...data }, update: data });

   const t = await getT();
   return sendEmail({
      to: email,
      subject: t("Your VELLUM code: {code}", { code }),
      text: [
         t("Your confirmation code is {code}.", { code }),
         "",
         t("It works for {minutes} minutes. If you didn't ask for it, you can ignore this email.", { minutes: CODE_TTL_MINUTES }),
         "",
         t("VELLUM is a portfolio project. Nothing in it is real."),
      ].join("\n"),
   });
}

export type CodeCheck = { ok: true } | { ok: false; reason: "missing" | "expired" | "locked" } | { ok: false; reason: "wrong"; attemptsLeft: number };

/** Проверяет введённый код. При успехе код удаляется: использовать его второй раз нельзя. */
export async function checkEmailCode(userId: number, input: string): Promise<CodeCheck> {
   const record = await prisma.emailCode.findUnique({ where: { userId } });
   if (!record) return { ok: false, reason: "missing" };

   if (record.expiresAt < new Date()) {
      await prisma.emailCode.delete({ where: { userId } });
      return { ok: false, reason: "expired" };
   }

   if (record.attempts >= MAX_ATTEMPTS) {
      await prisma.emailCode.delete({ where: { userId } });
      return { ok: false, reason: "locked" };
   }

   const expected = Buffer.from(record.codeHash, "hex");
   const actual = Buffer.from(hashCode(userId, input), "hex");
   if (!timingSafeEqual(expected, actual)) {
      const updated = await prisma.emailCode.update({ where: { userId }, data: { attempts: { increment: 1 } } });
      const attemptsLeft = MAX_ATTEMPTS - updated.attempts;
      if (attemptsLeft <= 0) {
         await prisma.emailCode.delete({ where: { userId } });
         return { ok: false, reason: "locked" };
      }
      return { ok: false, reason: "wrong", attemptsLeft };
   }

   await prisma.emailCode.delete({ where: { userId } });
   return { ok: true };
}
