"use client";

import { createContext, use, useContext, useEffect, useState, type ReactNode } from "react";
import type { FavoriteState } from "@/lib/favorites";

/**
 * Кто смотрит страницу: вошёл ли человек и что у него в избранном.
 *
 * Сервер не ждёт эти данные (это запрос сессии и избранного в удалённую базу), а передаёт сюда
 * незавершённый Promise. Товары и страницы рисуются сразу из кэша каталога, а сердечки
 * подтягиваются, когда Promise выполнится. Так личные данные больше не задерживают всю страницу.
 */
const ViewerContext = createContext<Promise<FavoriteState> | null>(null);
const ViewerSnapshotContext = createContext<FavoriteState | null>(null);

export function ViewerProvider({ viewer, children }: { viewer: Promise<FavoriteState>; children: ReactNode }) {
   // Снимок для обработчиков кликов: им нельзя "подвешивать" рендер через use(), им нужен ответ сразу
   const [snapshot, setSnapshot] = useState<{ source: Promise<FavoriteState>; value: FavoriteState } | null>(null);

   useEffect(() => {
      let active = true;
      viewer.then(
         (value) => {
            if (active) setSnapshot({ source: viewer, value });
         },
         () => {},
      );
      return () => {
         active = false;
      };
   }, [viewer]);

   return (
      <ViewerContext.Provider value={viewer}>
         <ViewerSnapshotContext.Provider value={snapshot?.source === viewer ? snapshot.value : null}>
            {children}
         </ViewerSnapshotContext.Provider>
      </ViewerContext.Provider>
   );
}

/** Ждёт данные о посетителе. Вызывать только внутри <Suspense>. */
export function useViewer(): FavoriteState {
   const viewer = useContext(ViewerContext);
   if (!viewer) throw new Error("useViewer must be used inside <ViewerProvider>");
   return use(viewer);
}

/** Данные о посетителе без ожидания: null, пока сервер их ещё не прислал. */
export function useViewerSnapshot(): FavoriteState | null {
   return useContext(ViewerSnapshotContext);
}
