/**
 * Ограничение попыток: "не больше N раз за такое-то время".
 *
 * Как это работает (фиксированное окно):
 *  - Для каждого "ключа" (например, "login:ip:1.2.3.4") в таблице RateLimit лежит счётчик и время,
 *    когда окно закончится.
 *  - Каждая попытка увеличивает счётчик. Если он стал больше лимита, попытку отклоняем.
 *  - Когда окно закончилось, строку удаляем, и счёт идёт заново.
 *
 * Почему база, а не переменная в памяти: на хостинге вроде Vercel сервер запускается заново
 * и на нескольких копиях сразу, и память у них не общая. База у всех одна.
 */
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

export interface RateLimitResult {
   /** true: попытку можно выполнять */
   ok: boolean;
   /** Через сколько секунд можно пробовать снова (когда ok = false) */
   retryAfter: number;
}

interface Rule {
   /** Сколько попыток разрешено */
   limit: number;
   /** За сколько секунд */
   windowSeconds: number;
}

/** Все правила в одном месте: меняйте числа здесь. */
export const LIMITS = {
   loginByIp: { limit: 20, windowSeconds: 15 * 60 },
   loginByEmail: { limit: 5, windowSeconds: 15 * 60 },
   registerByIp: { limit: 5, windowSeconds: 60 * 60 },
   verifyByEmail: { limit: 10, windowSeconds: 15 * 60 },
   resendByEmail: { limit: 3, windowSeconds: 15 * 60 },
   resendByIp: { limit: 10, windowSeconds: 60 * 60 },
   contactByIp: { limit: 5, windowSeconds: 60 * 60 },
   checkoutByIp: { limit: 10, windowSeconds: 60 * 60 },
   orderLookupByIp: { limit: 10, windowSeconds: 15 * 60 },
   orderLookupByOrder: { limit: 5, windowSeconds: 15 * 60 },
} as const satisfies Record<string, Rule>;

/**
 * Засчитывает одну попытку по ключу и говорит, можно ли продолжать.
 * Вызывать нужно ДО самого действия (проверки пароля, отправки письма и так далее).
 */
export async function rateLimit(key: string, rule: Rule): Promise<RateLimitResult> {
   const now = new Date();

   // 1. Окно закончилось: убираем старый счётчик, чтобы счёт начался с нуля
   await prisma.rateLimit.deleteMany({ where: { key, resetAt: { lt: now } } });

   // 2. Создаём счётчик (count = 1) или увеличиваем существующий на 1
   const row = await prisma.rateLimit.upsert({
      where: { key },
      create: { key, count: 1, resetAt: new Date(now.getTime() + rule.windowSeconds * 1000) },
      update: { count: { increment: 1 } },
   });

   if (row.count <= rule.limit) return { ok: true, retryAfter: 0 };
   return { ok: false, retryAfter: Math.max(1, Math.ceil((row.resetAt.getTime() - now.getTime()) / 1000)) };
}

/** Проверить несколько ключей сразу. Отказ любого из них означает отказ. */
export async function rateLimitAll(checks: [key: string, rule: Rule][]): Promise<RateLimitResult> {
   // Ключи независимы, поэтому проверяем их параллельно, а не по очереди
   const results = await Promise.all(checks.map(([key, rule]) => rateLimit(key, rule)));
   let worst: RateLimitResult = { ok: true, retryAfter: 0 };
   for (const result of results) {
      if (!result.ok && result.retryAfter > worst.retryAfter) worst = result;
   }
   return worst;
}

/** Забыть счётчик (например, после удачного входа, чтобы честный человек не копил попытки). */
export async function resetRateLimit(key: string) {
   await prisma.rateLimit.deleteMany({ where: { key } });
}

/** Убрать все просроченные счётчики, чтобы таблица не росла. Вызывается при создании сессии. */
export async function purgeExpiredRateLimits() {
   await prisma.rateLimit.deleteMany({ where: { resetAt: { lt: new Date() } } });
}

/**
 * IP посетителя. За прокси (Vercel, Cloudflare, nginx) настоящий адрес лежит в заголовке x-forwarded-for.
 * Если заголовка нет (например, локально), считаем всех одним посетителем "local".
 * Важно: сам заголовок можно подделать, если сервер стоит без прокси. На Vercel его выставляет платформа.
 */
export async function getClientIp(): Promise<string> {
   const list = await headers();
   const forwarded = list.get("x-forwarded-for")?.split(",")[0]?.trim();
   return forwarded || list.get("x-real-ip") || "local";
}

/** Человеческое сообщение для отказа: "Too many attempts. Try again in 12 minutes." */
export function tooManyMessage(retryAfter: number): string {
   if (retryAfter < 90) return `Too many attempts. Try again in ${retryAfter} seconds.`;
   return `Too many attempts. Try again in ${Math.ceil(retryAfter / 60)} minutes.`;
}
