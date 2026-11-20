import type { Translator } from "./translate";

export function translateMaterial(material: string | null, t: Translator) {
   return material?.split(", ").map((part) => t(part)).join(", ");
}
