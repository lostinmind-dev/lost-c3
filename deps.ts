import * as path from 'jsr:@std/path@1.0.6';
export * as Colors from 'jsr:@std/fmt@1.0.2/colors';

export function getLibraryDirectory(): string {
    // Получаем URL текущего модуля
    const moduleUrl = new URL(import.meta.url);
    
    console.log("Debug: Module URL:", moduleUrl.toString());
  
    if (moduleUrl.protocol === "file:") {
      // Если это файловая система, преобразуем URL в путь
      const modulePath = path.fromFileUrl(moduleUrl);
      console.log("Debug: File path:", modulePath);
      return path.dirname(modulePath);
    } else if (moduleUrl.protocol === "https:") {
      // Если это HTTPS URL (например, при использовании через JSR)
      const denoDir = Deno.env.get("DENO_DIR") || getDefaultDenoDir();
      console.log("Debug: Deno Dir:", denoDir);
  
      // Извлекаем относительный путь из URL
      const relativePath = moduleUrl.pathname.split("/").slice(1).join("/");
      console.log("Debug: Relative path:", relativePath);
  
      // Формируем путь к кэшированной версии пакета
      const cachedPath = path.join(denoDir, "deps", "https", "jsr.io", relativePath);
      console.log("Debug: Cached path:", cachedPath);
  
      return path.dirname(cachedPath);
    }
    
    console.error("Error: Unable to determine library directory");
    console.error("Module URL:", moduleUrl.toString());
    console.error("DENO_DIR:", Deno.env.get("DENO_DIR"));
    console.error("Default Deno Dir:", getDefaultDenoDir());
    
    throw new Error("Не удалось определить директорию библиотеки");
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

export { path };