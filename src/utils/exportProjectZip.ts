import JSZip from 'jszip';
import { getPythonScriptContent } from './pythonScriptGenerator';

// Use Vite's import.meta.glob with ?raw to dynamically package all source files at build/runtime
const rawSourceFiles = import.meta.glob(
  [
    '../**/*.{ts,tsx,css}',
    '../../package.json',
    '../../tsconfig.json',
    '../../vite.config.ts',
    '../../index.html',
    '../../metadata.json',
  ],
  {
    query: '?raw',
    import: 'default',
    eager: true,
  }
) as Record<string, string>;

export async function generateProjectZip(onProgress?: (percent: number, currentFile: string) => void): Promise<Blob> {
  const zip = new JSZip();

  // 1. Add all matched project files
  const fileEntries = Object.entries(rawSourceFiles);
  const totalEntries = fileEntries.length + 3; // plus README, Python script, and .env.example
  let processed = 0;

  for (const [path, content] of fileEntries) {
    // Normalize path: remove leading ../../ or ../
    let cleanPath = path.replace(/^\.\.\/\.\.\//, '').replace(/^\.\.\//, 'src/');
    
    // Ensure clean relative path without double src
    if (cleanPath.startsWith('src/src/')) {
      cleanPath = cleanPath.replace(/^src\//, '');
    }

    zip.file(cleanPath, content);
    processed++;
    if (onProgress) {
      onProgress(Math.round((processed / totalEntries) * 80), cleanPath);
    }
  }

  // 2. Add Python client turbocrab.py
  const pythonScript = getPythonScriptContent();
  zip.file('turbocrab.py', pythonScript);
  processed++;
  if (onProgress) onProgress(85, 'turbocrab.py');

  // 3. Add .env.example
  const envExample = `# Configuración de TurboCrab Downloader - Omega Labs Inc
PORT=3000
NODE_ENV=development
# GEMINI_API_KEY= (opcional si integras análisis IA de medios)
`;
  zip.file('.env.example', envExample);
  processed++;
  if (onProgress) onProgress(90, '.env.example');

  // 4. Add comprehensive README.md with instructions to run and modify
  const readmeContent = `# 🦀 TurboCrab Downloader - Omega Labs Inc

Suite completa de descarga multimedia de alta velocidad con el motor matemático **CrabCompression™** y cliente de terminal en **Python 3**. Proyecto libre y sin ánimo de lucro.

---

## 🚀 Guía de Inicio Rápido para Modificar el Proyecto

### 1. Requisitos Previos
- **Node.js**: v18.0.0 o superior (se recomienda Node 20+)
- **NPM** o **pnpm** o **bun**
- **Python**: v3.9+ (opcional para el cliente de consola)
- **FFmpeg** instalado en tu sistema operativo

---

### 2. Instalación del Frontend Web (React 19 + Tailwind v4 + Vite)

\`\`\`bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo
npm run dev
\`\`\`

Abre en tu navegador: [http://localhost:3000](http://localhost:3000)

Para compilar para producción:
\`\`\`bash
npm run build
\`\`\`

---

### 3. Ejecución del Script de Python (turbocrab.py)

El proyecto incluye el cliente CLI oficial con soporte para yt-dlp y compresión Crab:

\`\`\`bash
# 1. Instalar dependencias de Python
pip install yt-dlp pyzipper rich

# 2. Ejecutar modo interactivo
python turbocrab.py

# 3. O descargar por comando directo
python turbocrab.py --url "https://www.youtube.com/watch?v=4xDzrJKXOOY" --resolution 720p --crab-level 10
\`\`\`

---

## 📁 Estructura del Código

- \`src/App.tsx\`: Componente principal y gestor de estado global.
- \`src/components/Navbar.tsx\`: Barra de navegación con perfil de usuario y acceso rápido.
- \`src/components/SingleDownloader.tsx\`: Descargador individual (video/audio, multi-pista, subtítulos).
- \`src/components/PlaylistDownloader.tsx\`: Descargador de playlists con empaquetado ZIP/7Z y contraseñas.
- \`src/components/CrabCompressionInfo.tsx\`: Simulador del algoritmo CrabCompression (reducción de 50MB a 4-9MB).
- \`src/components/PythonProgramTab.tsx\`: Interfaz del generador de comandos CLI y visor de código Python.
- \`src/utils/crabCompression.ts\`: Lógica matemática del algoritmo de compresión.
- \`src/utils/pythonScriptGenerator.ts\`: Generador del script turbocrab.py.
- \`turbocrab.py\`: Script en Python listo para ejecutar en terminal.

---

## 🛠️ Licencia
Software libre bajo licencia MIT / Open Source sin ánimo de lucro por **Omega Labs Inc**.
`;
  zip.file('README.md', readmeContent);
  if (onProgress) onProgress(95, 'README.md');

  // Generate the blob
  const zipBlob = await zip.generateAsync(
    {
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 },
    },
    (metadata) => {
      if (onProgress) {
        onProgress(95 + Math.round(metadata.percent * 0.05), 'Comprimiendo archivo ZIP...');
      }
    }
  );

  if (onProgress) onProgress(100, '¡Listo para descargar!');
  return zipBlob;
}
