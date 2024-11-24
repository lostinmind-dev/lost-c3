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
