"use client";

import { useActionState } from "react";
import { placeOrder, type CheckoutState } from "@/actions/checkout";
import { SignInButton } from "@/components/auth/SignInButton";
import { Button, Field, Honeypot, FormError, TextAreaField } from "@/components/ui";
import { useT } from "@/providers/LocaleProvider";
import { retryMessage } from "@/lib/i18n/retryMessage";

interface CheckoutFormProps {
   defaults: { name: string; email: string; phone: string; address: string };
   signedIn: boolean;
}

const initialState: CheckoutState = { ok: false };

export function CheckoutForm({ defaults, signedIn }: CheckoutFormProps) {
   const t = useT();
   const [state, formAction, pending] = useActionState(placeOrder, initialState);
   // После ошибки показываем то, что человек уже ввёл, иначе то, что мы знаем из профиля
   const values = state.values ?? { ...defaults, comment: "" };

   return (
      <form action={formAction} className="flex flex-col gap-10" noValidate>
         <Honeypot />
         <section aria-labelledby="contact-title">
            <div className="mb-5 flex items-baseline justify-between gap-4">
               <h2 id="contact-title" className="font-display text-[28px] uppercase">
                  {t("Contact")}
               </h2>
               {!signedIn && (
                  <p className="text-sm text-ink-2">
                     {t("Have an account?")}{" "}
                     <SignInButton label="Sign in" variant="link" />
                  </p>
               )}
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
               <Field label={t("Full name")} name="name" autoComplete="name" defaultValue={values.name} error={state.errors?.name ? t(state.errors.name) : undefined} required />
               <Field
                  label={t("Phone")}
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  defaultValue={values.phone}
                  error={state.errors?.phone ? t(state.errors.phone) : undefined}
                  required
               />
               <Field
                  label={t("Email")}
                  name="email"
                  type="email"
                  autoComplete="email"
                  wrapperClassName="sm:col-span-2"
                  hint={t("We send your order confirmation here.")}
                  defaultValue={values.email}
                  error={state.errors?.email ? t(state.errors.email) : undefined}
                  required
               />
            </div>
         </section>

         <section aria-labelledby="delivery-title">
            <h2 id="delivery-title" className="mb-5 font-display text-[28px] uppercase">
               {t("Delivery")}
            </h2>
            <div className="grid gap-4">
               <TextAreaField
                  label={t("Address")}
                  name="address"
                  autoComplete="street-address"
                  rows={3}
                  placeholder={t("Street, apartment, city, postcode, country")}
                  defaultValue={values.address}
                  error={state.errors?.address ? t(state.errors.address) : undefined}
                  required
               />
               <TextAreaField label={t("Note for the courier (optional)")} name="comment" rows={2} defaultValue={values.comment} />
            </div>
         </section>

         <section aria-labelledby="payment-title">
            <h2 id="payment-title" className="mb-5 font-display text-[28px] uppercase">
               {t("Payment")}
            </h2>
            <p className="rounded-xl border border-line bg-card px-5 py-4 text-[15px] text-ink-2">
               <b className="text-ink">{t("Pay on delivery.")}</b> {t("You pay the courier when your order arrives. Nothing is charged now.")}
            </p>
         </section>

         <div className="flex flex-col gap-4">
            <FormError>
               {state.retryAfter !== undefined ? retryMessage(t, state.retryAfter)
                  : state.soldOutProduct ? t("{name} just sold out in your size. Update your bag and try again.", { name: t(state.soldOutProduct) })
                  : state.errors?.form && t(state.errors.form)}
            </FormError>
            <Button type="submit" disabled={pending} className="w-full sm:w-auto sm:self-start">
               {pending ? t("Placing order…") : t("Place order")}
            </Button>
         </div>
      </form>
   );
}
