import Image from "next/image";
import { MediaPlaceholder } from "@/components/ui/MediaPlaceholder";
import { cn } from "@/utils";

/** Мягкий фон-заглушка в цвет вещи: белая основа плюс немного цвета товара. */
export function tintFromHex(hex: string, strength = 16) {
   return `color-mix(in srgb, ${hex} ${strength}%, #f1f2ed)`;
}

interface MediaImageProps {
   /** Путь или URL картинки. Пока он пустой (null), показывается заглушка. */
   src?: string | null;
   alt: string;
   /** Цвет фона заглушки. По умолчанию нейтральный. */
   tint?: string;
   /** Подпись под значком в заглушке, например "Photo" */
   label?: string;
   sizes?: string;
   priority?: boolean;
   /** "dark" рисует заглушку светлыми линиями: для тёмных плиток */
   tone?: "light" | "dark";
   /** Размеры и скругления задаёт вызывающий код: h-[410px], rounded-card и так далее */
   className?: string;
   imageClassName?: string;
}

/**
 * Одно место, где рисуется любая картинка сайта.
 * Когда у товара или категории появится src, здесь автоматически покажется фото
 * (next/image), а пока рисуется заглушка. Никаких правок в страницах не нужно.
 *
 * Для внешних адресов (https://...) добавь домен в images.remotePatterns в next.config.
 * Картинки из папки public/ работают сразу, например src="/images/coat.jpg".
 */
export function MediaImage({ src, alt, tint, label = "Photo", sizes, priority, tone = "light", className, imageClassName }: MediaImageProps) {
   return (
      <div className={cn("overflow-hidden bg-card not-[.absolute]:relative", className)} style={tint ? { backgroundColor: tint } : undefined}>
         {src ? (
            <Image
               src={src}
               alt={alt}
               fill
               sizes={sizes ?? "(min-width: 1024px) 33vw, 50vw"}
               priority={priority}
               // SVG не пережимаем: векторная картинка и так лёгкая и чёткая на любом экране
               unoptimized={src.endsWith(".svg")}
               className={cn("object-cover", imageClassName)}
            />
         ) : (
            <MediaPlaceholder alt={alt} label={label} tone={tone} />
         )}
      </div>
   );
}
