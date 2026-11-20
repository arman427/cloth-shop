/**
 * Заголовки безопасности. Браузер получает их с каждой страницей и сам включает защиту.
 * Подключаются в next.config.ts (см. инструкцию в конце ответа):
 *
 *   import { securityHeaders } from "./src/lib/securityHeaders";
 *   const nextConfig: NextConfig = {
 *      async headers() {
 *         return [{ source: "/:path*", headers: securityHeaders }];
 *      },
 *   };
 */

const isDev = process.env.NODE_ENV !== "production";

/**
 * Content-Security-Policy: белый список того, откуда странице можно грузить скрипты, картинки и прочее.
 * Всё, чего нет в списке, браузер блокирует. Это главная защита от XSS.
 *
 *  - 'unsafe-inline' в script-src нужен Next.js: он вставляет в страницу небольшие встроенные скрипты.
 *    Строгий вариант (nonce) требует рендерить каждую страницу заново на сервере, а мы этого не хотим.
 *  - 'unsafe-eval' и ws: нужны только в режиме разработки (горячая перезагрузка).
 *  - img-src разрешает https: целиком, потому что картинки вы будете брать с разных сайтов.
 *    Когда определитесь с источниками, замените на конкретные домены.
 */
const csp = [
   "default-src 'self'",
   `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
   "style-src 'self' 'unsafe-inline'",
   "img-src 'self' data: blob: https:",
   "font-src 'self' data:",
   `connect-src 'self'${isDev ? " ws: wss:" : ""}`,
   "object-src 'none'", // никаких Flash и <embed>
   "base-uri 'self'", // нельзя подменить <base>
   "form-action 'self'", // формы отправляются только на наш сайт
   "frame-ancestors 'none'", // наш сайт нельзя встроить в чужую страницу (защита от clickjacking)
   ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

export const securityHeaders = [
   { key: "Content-Security-Policy", value: csp },
   // Браузер не должен "угадывать" тип файла: защита от подмены .txt на скрипт
   { key: "X-Content-Type-Options", value: "nosniff" },
   // Старый аналог frame-ancestors для браузеров, которые CSP не знают
   { key: "X-Frame-Options", value: "DENY" },
   // На чужие сайты уходит только адрес нашего сайта, без пути и параметров
   { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
   // Камера, микрофон и геолокация сайту не нужны: запрещаем
   { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
   // Заставляем браузер ходить на сайт только по https на 2 года. Только для продакшена: на localhost https нет.
   ...(isDev ? [] : [{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" }]),
];
