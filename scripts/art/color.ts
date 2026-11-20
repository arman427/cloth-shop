/** Цветовые помощники для картинок: смешивание, осветление, яркость. */

const parse = (hex: string) => {
   const h = hex.replace("#", "");
   return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
};
const toHex = (rgb: number[]) => "#" + rgb.map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, "0")).join("");

/** Смешать два цвета: t = 0 — первый, t = 1 — второй */
export function mix(a: string, b: string, t: number): string {
   const [x, y] = [parse(a), parse(b)];
   return toHex(x.map((v, i) => v + (y[i] - v) * t));
}

export const lighten = (hex: string, t: number) => mix(hex, "#ffffff", t);
export const darken = (hex: string, t: number) => mix(hex, "#000000", t);

/** Относительная яркость 0..1 */
export function luminance(hex: string): number {
   const [r, g, b] = parse(hex).map((v) => {
      const c = v / 255;
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
   });
   return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export const isDark = (hex: string) => luminance(hex) < 0.12;

/** Фон карточки товара: бумага с лёгким оттенком цвета вещи (как tintFromHex на сайте) */
export const tintOf = (hex: string, strength = 0.16) => mix("#f1f2ed", hex, strength);

export const PAPER = "#f1f2ed";
export const INK = "#14181f";
export const COBALT = "#2c44d8";
export const COBALT_SOFT = "#7c8cff";
