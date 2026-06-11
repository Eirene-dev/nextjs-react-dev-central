import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// base: './' — /showcases/pilot/ 에서 서빙되므로 에셋을 상대경로로(깨짐 방지)
export default defineConfig({ plugins: [react()], base: './' })
