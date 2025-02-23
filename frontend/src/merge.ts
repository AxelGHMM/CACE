import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

// Obtener __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Si merge.ts está en src, entonces los archivos están en subdirectorios de src
const folderPath = path.resolve(__dirname); // Ya estamos en src
const outputFile = path.resolve(__dirname, "todos.tsx"); // Archivo de salida

// Función para recorrer directorios y leer archivos .ts y .tsx
const getFilesRecursively = (dir: string): string[] => {
    let results: string[] = [];
    if (!fs.existsSync(dir)) return results; // Verifica que el directorio existe

    const list = fs.readdirSync(dir);

    list.forEach((file) => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            results = results.concat(getFilesRecursively(filePath)); // Si es directorio, busca recursivamente
        } else if (file.endsWith(".ts") || file.endsWith(".tsx")) {
            results.push(filePath); // Agregar solo archivos .ts y .tsx
        }
    });

    return results;
};

// Obtener todos los archivos .ts y .tsx dentro de `src/`
const files = getFilesRecursively(folderPath);

// Organizar archivos por directorio
const filesByDirectory: Record<string, string[]> = {};

// Clasificar archivos por carpeta
files.forEach((filePath) => {
    const relativeDir = path.dirname(filePath).replace(folderPath, "").replace(/^\/|\\/g, "");
    if (!filesByDirectory[relativeDir]) {
        filesByDirectory[relativeDir] = [];
    }
    filesByDirectory[relativeDir].push(filePath);
});

let content = "";

// Recorrer los directorios y escribir los archivos dentro de cada uno
for (const [dir, filePaths] of Object.entries(filesByDirectory)) {
    content += `\n// ==== Directorio: ${dir || "src"} ====\n\n`;
    filePaths.forEach((filePath) => {
        const fileName = path.basename(filePath);
        const fileContent = fs.readFileSync(filePath, "utf8");
        content += `// Archivo: ${fileName}\n${fileContent}\n\n`;
    });
}

// Escribir todo en el archivo final
fs.writeFileSync(outputFile, content);

console.log(`✅ Archivos .ts y .tsx combinados en ${outputFile}`);
