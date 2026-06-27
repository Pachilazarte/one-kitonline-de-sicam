import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      // Los PDF de public/ son estáticos: no necesitan hot-reload. Si están
      // abiertos en un visor, Windows los bloquea (EBUSY) y eso tiraba el dev
      // server. Los excluimos del watcher para que abrirlos no lo rompa.
      ignored: ['**/public/**/*.pdf'],
    },
  },
})
