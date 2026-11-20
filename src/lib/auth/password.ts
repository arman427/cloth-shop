/**
 * Хеширование паролей через встроенный в Node модуль crypto.
 * Никаких сторонних библиотек: scrypt входит в Node и считается безопасным для паролей.
 *
 * Что здесь происходит:
 *  1. Для каждого пароля генерируется случайная "соль" (salt). Из-за неё
 *     одинаковые пароли у разных людей дают разные хеши.
 *  2. scrypt специально считается медленно (десятки миллисекунд), поэтому
 *     перебирать пароли по украденной базе очень дорого.
 *  3. В базе хранится строка "соль:хеш" в hex. Сам пароль не сохраняется нигде.
 *
 * Хеш нельзя "расшифровать". Чтобы проверить пароль, мы хешируем введённый
 * пароль с той же солью и сравниваем результат.
 */
import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

// У promisify типы для scrypt неудобные, поэтому явно описываем нужную сигнатуру
const scrypt = promisify(scryptCallback) as (password: string, salt: Buffer, keyLength: number) => Promise<Buffer>;

const SALT_BYTES = 16;
const KEY_BYTES = 64;

export async function hashPassword(password: string): Promise<string> {
   const salt = randomBytes(SALT_BYTES);
   const hash = await scrypt(password, salt, KEY_BYTES);
   return `${salt.toString("hex")}:${hash.toString("hex")}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
   const [saltHex, hashHex] = stored.split(":");
   if (!saltHex || !hashHex) return false;

   const expected = Buffer.from(hashHex, "hex");
   const actual = await scrypt(password, Buffer.from(saltHex, "hex"), expected.length);

   // timingSafeEqual сравнивает за одинаковое время, чтобы по скорости ответа
   // нельзя было угадывать пароль по символам (обычный === может выдать разницу).
   return timingSafeEqual(actual, expected);
}

/**
 * "Пустой" хеш правильного формата. Если пользователя с таким email нет,
 * мы всё равно проверяем пароль против него. Тогда ответ на несуществующий email
 * занимает столько же времени, и по скорости нельзя понять, есть ли аккаунт.
 */
export const DUMMY_HASH = `${"00".repeat(SALT_BYTES)}:${"00".repeat(KEY_BYTES)}`;
