
import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig, createLogger } from 'vite';

const logger = createLogger();
const loggerError = logger.error;

// Filter out annoying PostCSS warnings
logger.error = (msg, options) => {
    if (options?.error?.toString().includes('CssSyntaxError: [postcss]')) {
        return;
    }
    loggerError(msg, options);
}

export default defineConfig({
    customLogger: logger,
    plugins: [
        react(), // This is the ONLY plugin you need for Maslow
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    server: {
        allowedHosts: true,
    },
    build: {
        outDir: 'dist',
        sourcemap: true,
    }
});