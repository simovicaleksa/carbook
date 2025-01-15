import { defineConfig } from "drizzle-kit";

import { env } from "~/env";

export default defineConfig({
  out: "./drizzle",
  dialect: "postgresql",
  schema: "./src/db/_schema.ts",

  dbCredentials: {
    url: env.POSTGRES_URL,
  },

  extensionsFilters: ["postgis"],
  schemaFilter: "public",
  tablesFilter: "*",

  introspect: {
    casing: "camel",
  },

  migrations: {
    prefix: "timestamp",
    table: "__drizzle_migrations__",
    schema: "public",
  },

  breakpoints: true,
  strict: true,
  verbose: true,
});
