import { ORDER_STATUS_LABEL } from "@/constants/shop";
import { getT } from "@/lib/i18n/server";
import type { OrderStatus } from "@/types";
import { cn } from "@/utils";

const TONE: Record<OrderStatus, string> = {
   NEW: "bg-cobalt text-white",
   PAID: "bg-ink text-white",
   SHIPPED: "bg-olive text-white",
   CANCELLED: "bg-paper-2 text-ink-2",
};

export async function OrderStatusBadge({ status }: { status: OrderStatus }) {
   const t = await getT();

   return (
      <span className={cn("rounded-full px-3 py-1.5 text-xs leading-[1.55] font-semibold", TONE[status])}>
         {t(ORDER_STATUS_LABEL[status])}
      </span>
   );
}
