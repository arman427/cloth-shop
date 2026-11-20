import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client";

/**
 * Один клиент на процесс.
 *
 * В dev Next перезагружает модули при каждом сохранении файла. Без globalThis каждая
 * перезагрузка создавала бы новый PrismaClient со своим пулом, а каждое новое соединение
 * с удалённым Neon — это TCP + TLS + авторизация, то есть несколько сотен миллисекунд.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createPrismaClient() {
   const adapter = new PrismaPg({
      connectionString: `${process.env.DATABASE_URL}`,
      // У pg по умолчанию соединение закрывается после 10 секунд простоя, и следующий клик
      // снова платит за подключение к Neon. Держим тёплые соединения дольше.
      idleTimeoutMillis: 60_000,
      connectionTimeoutMillis: 10_000,
   });
   return new PrismaClient({ adapter });
}

const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export { prisma };
