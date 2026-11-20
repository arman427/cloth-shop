"use client";

import { useState, type FormEvent } from "react";
import { isValidEmail } from "@/utils";
import { useT } from "@/providers/LocaleProvider";

type Status = "idle" | "success" | "error";

/**
 * Форма рассылки — демо: адрес только проверяется в браузере и никуда не отправляется.
 * Ни Server Action, ни запросов к базе нет.
 */
export function useNewsletterForm() {
   const t = useT();
   const [email, setEmail] = useState("");
   const [status, setStatus] = useState<Status>("idle");
   const [feedback, setFeedback] = useState("");

   const onSubmit = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!isValidEmail(email.trim())) {
         setStatus("error");
         setFeedback("Enter an email address like name@example.com.");
         return;
      }

      setStatus("success");
      setFeedback("Done. This is a demo form: your address isn't saved or sent anywhere.");
      setEmail("");
   };

   return { email, setEmail, status, message: feedback ? t(feedback) : "", onSubmit };
}
