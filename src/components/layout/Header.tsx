import { Suspense } from "react";
import { Container, Logo } from "@/components/ui";
import { MAIN_NAV, UTILITY_NAV } from "@/constants/navigation";
import { HeaderActions, HeaderActionsFallback } from "./HeaderActions";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { MainNav } from "./MainNav";
import { MobileMenu } from "./MobileMenu";
import { SearchField } from "./SearchField";

export function Header() {
   return (
      <header className="border-b border-line">
         {/* Телефон: меню и логотип слева, иконки справа. С lg: логотип по центру. */}
         <Container className="flex h-16 items-center gap-2 sm:h-[84px] lg:grid lg:grid-cols-[1fr_auto_1fr]">
            <div className="flex items-center">
               {/* Русские пункты меню длиннее: до xl они уходят в боковое меню, иначе налезают на логотип */}
               <MobileMenu links={MAIN_NAV} secondaryLinks={UTILITY_NAV} />
               <MainNav links={MAIN_NAV} className="hidden lg:block ru:lg:hidden ru:xl:block" />
            </div>

            <Logo className="mr-auto lg:mr-0" />

            <div className="flex items-center justify-end gap-2 sm:gap-[13px]">
               <LocaleSwitcher className="hidden sm:flex" />
               <SearchField className="hidden xl:flex" />
               {/* Счётчики и кнопка входа зависят от cookie, поэтому грузятся отдельно от статичной шапки */}
               <Suspense fallback={<HeaderActionsFallback />}>
                  <HeaderActions />
               </Suspense>
            </div>
         </Container>
      </header>
   );
}
