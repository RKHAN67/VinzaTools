import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    build: {
      modulePreload: false,
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes('node_modules')) return undefined;

            if (
              id.includes('jspdf') ||
              id.includes('pdf-lib') ||
              id.includes('pdfjs-dist') ||
              id.includes('pypdf') ||
              id.includes('mammoth') ||
              id.includes('pptxgenjs') ||
              id.includes('xlsx') ||
              id.includes('docx')
            ) {
              return 'document-vendor';
            }

            if (
              id.includes('@imgly/background-removal') ||
              id.includes('onnxruntime-web') ||
              id.includes('sharp')
            ) {
              return 'ai-image-vendor';
            }

            if (
              id.includes('html2canvas') ||
              id.includes('html-to-image') ||
              id.includes('konva') ||
              id.includes('react-konva') ||
              id.includes('canvas-confetti')
            ) {
              return 'canvas-vendor';
            }

            return undefined;
          },
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: Number(env.PORT) || 3015,
      strictPort: false,
      host: '0.0.0.0',
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
