
import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig, createLogger } from 'vite';

const logger = createLogger();
const loggerError = logger.error;

// Clean up console noise from PostCSS
logger.error = (msg, options) => {
    if (options?.error?.toString().includes('CssSyntaxError: [postcss]')) {
        return;
    }
    loggerError(msg, options);
}

export default defineConfig({
    customLogger: logger,
    // THE CRITICAL FIX: Only load React, no "Horizons" editor plugins
    plugins: [
        react(), 
    ],
    // Keep your path aliases so @/components works
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    // Standard Vercel build settings
    build: {
        outDir: 'dist',
        sourcemap: true,
    }
});