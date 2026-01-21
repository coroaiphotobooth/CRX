import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // SECURITY UPDATE: Removed define process.env.API_KEY.
  // Secrets are now exclusive to the server-side /api directory.
});