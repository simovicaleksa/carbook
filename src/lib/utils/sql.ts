import { sql, type SQL } from "drizzle-orm";
import { type AnyPgColumn } from "drizzle-orm/pg-core";

export function lower(column: AnyPgColumn): SQL {
  return sql`lower(${column})`;
}
