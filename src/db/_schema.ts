import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const userTable = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  username: varchar("username", { length: 16 }).notNull().unique(),
  password: text("password").notNull(),
  role: text("role", { enum: ["user", "mechanic"] })
    .default("user")
    .notNull(),
  createdAt: timestamp("created_at", {
    mode: "date",
    precision: 3,
  }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date", precision: 3 }).$onUpdate(
    () => new Date(),
  ),
  prefersImperial: boolean("prefers_imperial").default(false).notNull(),
});

export const sessionTable = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => userTable.id),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

export const vehicleTable = pgTable("vehicles", {
  id: uuid("id").primaryKey().defaultRandom(),
  type: text("type", { enum: ["car", "motorcycle", "truck"] }).notNull(),
  make: varchar("make", { length: 255 }).notNull(),
  model: varchar("model", { length: 255 }).notNull(),
  year: integer("year").notNull(),
  distanceTraveled: integer("distance_traveled").default(0).notNull(),
});

export const historyTable = pgTable("history", {
  id: serial("id").primaryKey(),
  atDistanceTraveled: integer("at_distance_traveled"),
  type: text("type", {
    enum: [
      "refuel",
      "service",
      "maintenance",
      "repair",
      "replacement",
      "purchase",
      "tune-up",
      "wash",
      "milestone",
      "inspection",
      "upgrade",
      "accident",
      "other",
    ],
  }),
  description: text("description").default(""),
});
