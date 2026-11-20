"use client";

import { useActionState } from "react";
import { findOrder, type TrackState } from "@/actions/orders";
import { Button, Field, FormError, Honeypot } from "@/components/ui";
import { useT } from "@/providers/LocaleProvider";

const initialState: TrackState = { ok: false };

/** Форма для гостя: номер заказа и email. Показывается на /orders/track и вместо чужого заказа. */
export function TrackOrderForm({ defaultOrderNumber = "" }: { defaultOrderNumber?: string }) {
   const t = useT();
   const [state, formAction, pending] = useActionState(findOrder, initialState);
   const values = state.values ?? { orderNumber: defaultOrderNumber, email: "" };

   return (
      <form action={formAction} className="grid max-w-[460px] gap-4" noValidate>
         <Honeypot />
         <FormError>{state.errors?.form}</FormError>
         <Field
            label={t("Order number")}
            name="orderNumber"
            autoComplete="off"
            spellCheck={false}
            hint={t("It is in your confirmation email and on your order page.")}
            defaultValue={values.orderNumber}
            error={state.errors?.orderNumber}
            required
         />
         <Field
            label={t("Email")}
            name="email"
            type="email"
            autoComplete="email"
            placeholder="name@example.com"
            defaultValue={values.email}
            error={state.errors?.email}
            required
         />
         <Button type="submit" disabled={pending} className="mt-2 w-full sm:w-auto">
            {pending ? t("Looking…") : t("Find my order")}
         </Button>
      </form>
   );
}
