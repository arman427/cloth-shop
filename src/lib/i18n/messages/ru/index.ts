import { authAccount } from "./authAccount";
import { catalog } from "./catalog";
import { checkout } from "./checkout";
import { common } from "./common";
import { commerce } from "./commerce";
import { content } from "./content";
import { home } from "./home";
import { layout } from "./layout";
import { storefront } from "./storefront";
import { ui } from "./ui";

export const ru: Record<string, string> = {
   ...common,
   ...layout,
   ...ui,
   ...home,
   ...catalog,
   ...checkout,
   ...content,
   ...authAccount,
   ...commerce,
   ...storefront,
};
