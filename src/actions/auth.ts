"use server";

/**
 * Server Actions для регистрации, входа, подтверждения email и выхода.
 * Server Action — это функция, которая выполняется на сервере, а вызвать её можно
 * прямо из формы в браузере. Next сам делает запрос и подставляет результат.
 *
 * Путь нового пользователя:
 *   register → на почту уходит код → verifyEmail → создаётся сессия (человек вошёл).
 * Войти без подтверждённого email нельзя: login для неподтверждённого аккаунта тоже ведёт на ввод кода.
 *
 * В каждой функции сначала защита (ловушка для ботов и лимит попыток), потом проверка данных,
 * потом работа с базой. Сама работа с сессией лежит в lib/auth/session.ts.
 */
import { redirect } from "next/navigation";
import { issueEmailCode, checkEmailCode, CODE_LENGTH } from "@/lib/auth/emailCode";
import { DUMMY_HASH, hashPassword, verifyPassword } from "@/lib/auth/password";
import { createSession, deleteSession } from "@/lib/auth/session";
import { setPromoCookie, writeCartLines } from "@/lib/cart";
import { retryMessage } from "@/lib/i18n/retryMessage";
import { getT } from "@/lib/i18n/server";
import { prisma } from "@/lib/prisma";
import { LIMITS, getClientIp, isBot, rateLimitAll, resetRateLimit } from "@/lib/security";
import { isValidEmail, readText, validatePassword } from "@/utils";

export interface AuthState {
   /** true: человек вошёл, окно можно закрывать */
   ok: boolean;
   /** "verify": нужен код из письма, окно переключается на ввод кода */
   step?: "verify";
   errors?: { name?: string; email?: string; password?: string; code?: string; form?: string };
   /** Сообщение без ошибки, например "We sent a new code" */
   notice?: string;
   /** Возвращаем введённое, чтобы форма не очищалась после ошибки (пароль не возвращаем). */
   values?: { name?: string; email?: string };
}

const CODE_PATTERN = new RegExp(`^\\d{${CODE_LENGTH}}$`);

/* ───────────── Регистрация ───────────── */

export async function register(_prevState: AuthState, formData: FormData): Promise<AuthState> {
   const t = await getT();
   const name = readText(formData, "name");
   const email = readText(formData, "email").toLowerCase();
   const password = String(formData.get("password") ?? ""); // пароль не trim-им: пробелы могут быть частью пароля
   const values = { name, email };

   // 0. Защита. Бота не ругаем: показываем ему экран ввода кода, письмо не уходит и ничего не создаётся.
   if (isBot(formData)) return { ok: false, step: "verify", values };

   const ip = await getClientIp();
   const limit = await rateLimitAll([[`register:ip:${ip}`, LIMITS.registerByIp]]);
   if (!limit.ok) return { ok: false, errors: { form: retryMessage(t, limit.retryAfter) }, values };

   // 1. Проверяем данные на сервере. Проверка в браузере нужна только для удобства,
   //    сервер должен перепроверять всё сам.
   const errors: NonNullable<AuthState["errors"]> = {};
   if (name.length < 2) errors.name = t("Enter your name.");
   if (!isValidEmail(email)) errors.email = t("Enter an email address like name@example.com.");
   const passwordError = validatePassword(password, t);
   if (passwordError) errors.password = passwordError;
   if (Object.keys(errors).length > 0) return { ok: false, errors, values };

   // 2. Email не должен принадлежать подтверждённому аккаунту
   const existing = await prisma.user.findUnique({ where: { email }, select: { id: true, emailVerifiedAt: true } });
   if (existing?.emailVerifiedAt) {
      return { ok: false, errors: { email: t("An account with this email already exists. Try signing in.") }, values };
   }

   // 3. Создаём пользователя (или обновляем неподтверждённого: владелец почты ещё не доказан,
   //    поэтому его "заявку" можно перезаписать) и отправляем код на почту.
   let sent = false;
   try {
      const data = { name, password: await hashPassword(password) };
      const user = existing
         ? await prisma.user.update({ where: { id: existing.id }, data, select: { id: true } })
         : await prisma.user.create({ data: { email, ...data }, select: { id: true } });
      sent = await issueEmailCode(user.id, email);
   } catch (error) {
      // Например, два одновременных запроса с одним email (сработает @unique в базе)
      console.error("register failed", error);
      return { ok: false, errors: { form: t("We couldn't create your account. Please try again.") }, values };
   }

   if (!sent) return { ok: false, errors: { form: t("We couldn't send the confirmation email. Please try again.") }, values };
   return { ok: false, step: "verify", values };
}

/* ───────────── Вход ───────────── */

export async function login(_prevState: AuthState, formData: FormData): Promise<AuthState> {
   const t = await getT();
   const email = readText(formData, "email").toLowerCase();
   const password = String(formData.get("password") ?? "");
   const values = { email };

   // Бот получает обычный отказ, как будто пароль неверный
   if (isBot(formData)) return { ok: false, errors: { form: t("Incorrect email or password.") }, values };

   if (!isValidEmail(email) || password.length === 0) {
      return { ok: false, errors: { form: t("Enter your email and password.") }, values };
   }

   // Лимит и по IP (против перебора многих аккаунтов), и по email (против перебора одного аккаунта с разных IP)
   const ip = await getClientIp();
   const limit = await rateLimitAll([
      [`login:ip:${ip}`, LIMITS.loginByIp],
      [`login:email:${email}`, LIMITS.loginByEmail],
   ]);
   if (!limit.ok) return { ok: false, errors: { form: retryMessage(t, limit.retryAfter) }, values };

   const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, password: true, emailVerifiedAt: true },
   });

   // Проверяем пароль даже если пользователя нет (против DUMMY_HASH), чтобы время ответа
   // не выдавало, зарегистрирован такой email или нет.
   const passwordOk = await verifyPassword(password, user?.password ?? DUMMY_HASH);

   // Одно и то же сообщение для "нет такого email" и "неверный пароль" намеренно
   if (!user || !passwordOk) {
      return { ok: false, errors: { form: t("Incorrect email or password.") }, values };
   }

   // Email не подтверждён: пароль верный, но сначала нужен код из письма
   if (!user.emailVerifiedAt) {
      const sent = await issueEmailCode(user.id, email);
      if (!sent) return { ok: false, errors: { form: t("We couldn't send the confirmation email. Please try again.") }, values };
      return { ok: false, step: "verify", values };
   }

   // Удачный вход: счётчик ошибок обнуляем и создаём сессию (параллельно, это независимые запросы)
   await Promise.all([resetRateLimit(`login:email:${email}`), createSession(user.id)]);
   return { ok: true };
}

/* ───────────── Демо-вход ───────────── */

const DEMO_EMAIL = "demo@vellum.store";

/**
 * Вход в демо-аккаунт без пароля. Нужен, чтобы посмотреть личный кабинет,
 * избранное и оформление заказа, не регистрируясь.
 * Аккаунт создаётся при первом нажатии и переиспользуется дальше.
 */
export async function loginAsDemo() {
   const user = await prisma.user.upsert({
      where: { email: DEMO_EMAIL },
      update: { emailVerifiedAt: new Date() },
      create: {
         email: DEMO_EMAIL,
         name: "Demo User",
         // Пароля у демо-аккаунта нет: сюда кладём "пустой" хеш правильного формата.
         password: DUMMY_HASH,
         emailVerifiedAt: new Date(),
      },
      select: { id: true },
   });

   await createSession(user.id);
   redirect("/");
}

/* ───────────── Подтверждение email ───────────── */

export async function verifyEmail(_prevState: AuthState, formData: FormData): Promise<AuthState> {
   const t = await getT();
   const email = readText(formData, "email").toLowerCase();
   const code = readText(formData, "code");
   const values = { email };

   const limit = await rateLimitAll([[`verify:email:${email}`, LIMITS.verifyByEmail]]);
   if (!limit.ok) return { ok: false, step: "verify", errors: { form: retryMessage(t, limit.retryAfter) }, values };

   if (!CODE_PATTERN.test(code)) {
      return { ok: false, step: "verify", errors: { code: t("Enter all {count} digits.", { count: CODE_LENGTH }) }, values };
   }

   const user = await prisma.user.findUnique({ where: { email }, select: { id: true, emailVerifiedAt: true } });
   // Нет такого пользователя или он уже подтверждён: отвечаем так же, как на неверный код (не выдаём, что есть в базе)
   if (!user || user.emailVerifiedAt) {
      return { ok: false, step: "verify", errors: { code: t("That code isn't right or has expired.") }, values };
   }

   const check = await checkEmailCode(user.id, code);
   if (!check.ok) {
      const message =
         check.reason === "wrong"
            ? check.attemptsLeft === 1
               ? t("That code isn't right. One try left.")
               : t("That code isn't right. {count} tries left.", { count: check.attemptsLeft })
            : t("That code has expired. Request a new one.");
      return { ok: false, step: "verify", errors: { code: message }, values };
   }

   // Код верный: отмечаем email подтверждённым, забираем гостевые заказы с этой почты и входим
   // Сессию создаём только после того, как email точно отмечен подтверждённым
   await Promise.all([
      prisma.user.update({ where: { id: user.id }, data: { emailVerifiedAt: new Date() } }),
      prisma.order.updateMany({ where: { userId: null, email }, data: { userId: user.id } }),
   ]);
   await createSession(user.id);
   return { ok: true };
}

/** Отправить код ещё раз */
export async function resendCode(_prevState: AuthState, formData: FormData): Promise<AuthState> {
   const t = await getT();
   const email = readText(formData, "email").toLowerCase();
   const values = { email };

   const ip = await getClientIp();
   const limit = await rateLimitAll([
      [`resend:email:${email}`, LIMITS.resendByEmail],
      [`resend:ip:${ip}`, LIMITS.resendByIp],
   ]);
   if (!limit.ok) return { ok: false, step: "verify", errors: { form: retryMessage(t, limit.retryAfter) }, values };

   const user = isValidEmail(email)
      ? await prisma.user.findUnique({ where: { email }, select: { id: true, emailVerifiedAt: true } })
      : null;

   // Письмо уходит только неподтверждённому аккаунту. Ответ одинаковый в любом случае:
   // по нему нельзя узнать, есть ли такой email в базе.
   if (user && !user.emailVerifiedAt) {
      const sent = await issueEmailCode(user.id, email);
      if (!sent) return { ok: false, step: "verify", errors: { form: t("We couldn't send the email. Please try again.") }, values };
   }
   return { ok: false, step: "verify", notice: t("We sent you a new code."), values };
}

/* ───────────── Выход ───────────── */

export async function logout() {
   await deleteSession();
   // Корзина принадлежит аккаунту: после выхода следующий человек за этим браузером её не увидит
   await Promise.all([writeCartLines([]), setPromoCookie(null)]);
   redirect("/");
}
