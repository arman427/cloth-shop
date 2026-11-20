import type { ElementType, ReactNode } from "react";
import { cn } from "@/utils";

interface ContainerProps {
   as?: ElementType;
   className?: string;
   children: ReactNode;
}

/** 1312px content column with 64px gutters at 1440px; narrower gutters on small screens. */
export function Container({ as: Tag = "div", className, children }: ContainerProps) {
   return <Tag className={cn("mx-auto w-full max-w-[1376px] px-5 md:px-8", className)}>{children}</Tag>;
}
