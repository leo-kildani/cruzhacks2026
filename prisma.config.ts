import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  experimental: {
    externalTables: true,
  },
  migrations: {
    path: "prisma/migrations",
    initShadowDb: `
      CREATE TABLE IF NOT EXISTS public.documents (
        id SERIAL PRIMARY KEY
      );
    `,
  },
  datasource: {
    url: process.env["DIRECT_URL"],
  },
  tables: {
    external: ["public.documents"],
  },
});
