import { path } from "./cli-deps.ts";

export function getLibraryDirectory(): string {
    // Получаем URL текущего модуля
    const moduleUrl = new URL(import.meta.url);
    
    // Проверяем, запущен ли скрипт из файловой системы или из сети
    if (moduleUrl.protocol === "file:") {
      // Если это файловая система, преобразуем URL в путь
      const modulePath = path.fromFileUrl(moduleUrl);
      // Возвращаем директорию, в которой находится модуль
      return path.dirname(modulePath);
    } else {
      // Если это сетевой URL (например, при использовании через JSR),
      // возвращаем путь к кэшированной версии пакета
      const parts = moduleUrl.pathname.split("/");
      const packageName = "@lost-c3/lib"; // Замените на имя вашего пакета
      const index = parts.indexOf(packageName);
      if (index !== -1) {
        // Используем путь к кэшу JSR, основанный на DENO_DIR
        const denoDir = Deno.env.get("DENO_DIR") || getDefaultDenoDir();
        return path.join(denoDir, "deps", "jsr", ...parts.slice(0, index + 2));
      }
      throw new Error("Не удалось определить директорию библиотеки");
    }
  }
  
  function getDefaultDenoDir(): string {
    switch (Deno.build.os) {
      case "windows":
        return path.join(Deno.env.get("LOCALAPPDATA") || "", "deno");
      case "darwin":
        return path.join(Deno.env.get("HOME") || "", "Library", "Caches", "deno");
      default: // linux and other unix systems
        return path.join(Deno.env.get("XDG_CACHE_HOME") || path.join(Deno.env.get("HOME") || "", ".cache"), "deno");
    }
  }
  
  export const __dirname = getLibraryDirectory();