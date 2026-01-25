
import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig, createLogger } from 'vite';

const logger = createLogger();
const loggerError = logger.error;

// Ignore annoying CSS warnings from the console
logger.error = (msg, options) => {
    if (options?.error?.toString().includes('CssSyntaxError: [postcss]')) {
        return;
    }
    loggerError(msg, options);
}

export default defineConfig({
    customLogger: logger,
    plugins: [
        react(), // The only plugin you need
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    build: {
        outDir: 'dist',
        sourcemap: true,
    }
});