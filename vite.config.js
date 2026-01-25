import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig, createLogger } from 'vite';

// Safe logger configuration that ignores specific CSS warnings
const logger = createLogger();
const loggerError = logger.error;

logger.error = (msg, options) => {
    // Ignore PostCSS errors that often clutter the console
    if (options?.error?.toString().includes('CssSyntaxError: [postcss]')) {
        return;
    }
    loggerError(msg, options);
}

// https://vitejs.dev/config/
export default defineConfig({
    customLogger: logger,
    plugins: [
        react(), // The only plugin you strictly need for a React site
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'), // CRITICAL: Keeps your imports working
        },
    },
    server: {
        allowedHosts: true,
    },
    build: {
        // Ensures standard build settings for Vercel
        outDir: 'dist',
        sourcemap: false, 
    }
});