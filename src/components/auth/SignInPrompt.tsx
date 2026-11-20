import type { ReactNode } from "react";
import { SignInButton } from "@/components/auth/SignInButton";
import { Container, Icon, type IconName } from "@/components/ui";
import { getT } from "@/lib/i18n/server";

interface SignInPromptProps {
   icon: IconName;
   title: string;
   text: string;
   /** Дополнительный контент под кнопками (например, ссылка "создать аккаунт") */
   children?: ReactNode;
}

/** Заглушка страниц только для гостя: показывает преимущества, текст и кнопки входа. */
export async function SignInPrompt({ icon, title, text, children }: SignInPromptProps) {
   const t = await getT();

   return (
      <Container className="py-20 md:py-28">
         <div className="mx-auto flex max-w-[460px] flex-col items-center text-center">
            <span className="grid size-16 place-items-center rounded-full bg-card text-ink-2">
               <Icon name={icon} className="size-7" />
            </span>
            <h1 className="mt-6 font-display text-[44px] leading-none uppercase md:text-[56px] ru:text-[36px] ru:md:text-[48px]">{t(title)}</h1>
            <p className="mt-4 text-[17px] text-ink-2">{t(text)}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
               <SignInButton size="lg" />
               <SignInButton mode="register" label="Create account" variant="outline" size="lg" />
            </div>
            {children}
         </div>
      </Container>
   );
}
