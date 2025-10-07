import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      federation({
        name: 'users',
        filename: 'remoteEntry.js',
        exposes: {
          './UsersApp': './src/App.tsx',
        },
        shared: {
          react: {
            singleton: true,
            requiredVersion: '^18.2.0',
            eager: true,
          },
          'react-dom': {
            singleton: true,
            requiredVersion: '^18.2.0',
            eager: true,
          },
          '@mui/material': {
            singleton: true,
          },
          '@emotion/react': {
            singleton: true,
          },
          '@emotion/styled': {
            singleton: true,
          },
        },
      }),
    ],
    server: {
      port: parseInt(env.PORT) || 3001,
      host: true,
      strictPort: true,
    },
    preview: {
      port: parseInt(env.PORT) || 3001,
      host: true,
      strictPort: true,
    },
    build: {
      modulePreload: false,
      target: 'esnext',
      minify: false,
      cssCodeSplit: false,
    },
  };
});
