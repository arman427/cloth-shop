/**
 * Серверные сессии: как это работает
 *
 * ВХОД (login / register):
 *  1. Генерируем случайный токен: 32 байта из crypto.randomBytes. Угадать невозможно.
 *  2. В таблицу Session пишем строку: id = SHA-256(токен), userId, expiresAt.
 *     Сам токен в базу не попадает, только его хеш.
 *  3. Сам токен отдаём браузеру в cookie. Cookie с флагом httpOnly недоступна для
 *     JavaScript на странице, поэтому XSS не сможет её украсть.
 *
 * ПРОВЕРКА (getCurrentUser):
 *  1. Читаем cookie, считаем SHA-256 токена.
 *  2. Ищем в Session строку с таким id и смотрим, не истёк ли expiresAt.
 *  3. Нашли и не истекла: достаём пользователя и считаем его вошедшим.
 *
 * ВЫХОД (deleteSession): удаляем строку из таблицы и чистим cookie.
 * Строки нет, значит украденная cookie больше не работает. Так сессию можно
 * "убить" на сервере, чего не умеют JWT.
 */
import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { connection } from "next/server";
import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { purgeExpiredRateLimits } from "@/lib/security/rateLimit";

export const SESSION_COOKIE = "session";
const SESSION_DAYS = 30;

const hashToken = (token: string) =>
   createHash("sha256").update(token).digest("hex");

/** Создаёт сессию в базе и ставит cookie. Вызывать только из Server Action. */
export async function createSession(userId: number) {
   const token = randomBytes(32).toString("base64url");
   const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);

   // Заодно чистим просроченные сессии и счётчики лимитов, чтобы таблицы не росли вечно.
   // Три независимых запроса идут параллельно: к удалённой базе каждый последовательный запрос — это лишняя задержка.
   await Promise.all([
      prisma.session.create({
         data: { id: hashToken(token), userId, expiresAt },
      }),
      prisma.session.deleteMany({
         where: { expiresAt: { lt: new Date() } },
      }),
      purgeExpiredRateLimits(),
   ]);

   const jar = await cookies();
   jar.set(SESSION_COOKIE, token, {
      httpOnly: true, // JavaScript на странице cookie не видит
      secure: process.env.NODE_ENV === "production", // только по https
      sameSite: "lax", // cookie не уходит с чужих сайтов при POST (защита от CSRF)
      path: "/",
      expires: expiresAt,
   });
}

/**
 * Возвращает текущего пользователя или null.
 * cache() из React: в рамках одного запроса база опрашивается один раз,
 * сколько бы компонентов ни вызвали эту функцию.
 */
export const getCurrentUser = cache(async () => {
   // Ниже есть new Date() (проверка срока сессии). Next не разрешает читать "текущее время" при заготовке
   // страницы заранее, поэтому сначала говорим: эта функция работает только во время запроса.
   await connection();

   const token = (await cookies()).get(SESSION_COOKIE)?.value;
   if (!token) return null;

   const session = await prisma.session.findUnique({
      where: { id: hashToken(token) },
      select: {
         expiresAt: true,
         // select вместо include: поле password (хеш) наружу не отдаём никогда
         user: {
            select: {
               id: true,
               email: true,
               name: true,
               phone: true,
               address: true,
            },
         },
      },
   });

   if (!session) return null;
   if (session.expiresAt < new Date()) return null; // истекла; из базы её уберёт ближайший вход

   return session.user;
});

export type CurrentUser = NonNullable<
   Awaited<ReturnType<typeof getCurrentUser>>
>;

/** Выход: удаляем сессию из базы и стираем cookie. Вызывать только из Server Action. */
export async function deleteSession() {
   const jar = await cookies();
   const token = jar.get(SESSION_COOKIE)?.value;

   if (token) {
      await prisma.session.deleteMany({ where: { id: hashToken(token) } });
   }
   jar.delete(SESSION_COOKIE);
}
