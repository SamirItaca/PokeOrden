import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  schema: './schema.prisma', // <- solo schema.prisma, está en la misma carpeta
  migrations: {
    path: './migrations',      // <- también relativo a la carpeta config
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
})