export function getRelativePath(path: string, basePath: string, fileName: string, replaceTsToJs?: true) {
    const relativePathIndex = path.indexOf(basePath);
    const relativePath = path.substring(relativePathIndex + basePath.length + 1);

    const newFileName = (replaceTsToJs === true) ? fileName.replace('.ts', '.js') : fileName;
    
    if (relativePath.length > 0) {
        return `${relativePath}/${newFileName}`;
    } else {
        return newFileName;
    }
}


export function dedent(strings: TemplateStringsArray, ...values: any[]) {
    const fullString = strings.reduce((result, str, i) => result + str + (values[i] || ""), "");
    const lines = fullString.split("\n");
  
    // Убираем пустые строки и минимальные отступы
    const minIndent = lines.filter(line => line.trim()).reduce((min, line) => {
      const indent = line.match(/^(\s*)/)?.[0]?.length ?? 0;
      return Math.min(min, indent);
    }, Infinity);
  
    return lines.map(line => line.slice(minIndent)).join("\n").trim();
  }