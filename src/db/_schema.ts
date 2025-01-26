import { relations } from "drizzle-orm";
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
  role: text("role", { enum: ["user", "admin"] })
    .default("user")
    .notNull(),
  prefersImperial: boolean("prefers_imperial").default(false).notNull(),
  createdAt: timestamp("created_at", {
    mode: "date",
    precision: 3,
  }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date", precision: 3 }).$onUpdate(
    () => new Date(),
  ),
});

export const userRelations = relations(userTable, ({ one, many }) => ({
  vehicles: many(vehicleTable),
  profile: one(userProfileTable),
}));

export const userProfileTable = pgTable("user_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => userTable.id, {
      onDelete: "cascade",
    })
    .unique(),
  selectedVehicleId: uuid("selected_vehicle_id").references(
    () => vehicleTable.id,
    { onDelete: "set null" },
  ),
});

export const userProfileRelations = relations(userProfileTable, ({ one }) => ({
  user: one(userTable, {
    fields: [userProfileTable.userId],
    references: [userTable.id],
  }),
  selectedVehicle: one(vehicleTable, {
    fields: [userProfileTable.selectedVehicleId],
    references: [vehicleTable.id],
  }),
}));

export const sessionTable = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
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
  ownerId: uuid("owner_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at", {
    mode: "date",
    precision: 3,
  }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date", precision: 3 }).$onUpdate(
    () => new Date(),
  ),
});

export const vehicleRelations = relations(vehicleTable, ({ one, many }) => ({
  user: one(userTable, {
    fields: [vehicleTable.ownerId],
    references: [userTable.id],
  }),
  userProfile: one(userProfileTable),
  history: many(historyTable),
}));

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
  vehicleId: uuid("vehicle_id")
    .notNull()
    .references(() => vehicleTable.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", {
    mode: "date",
    precision: 3,
  }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date", precision: 3 }).$onUpdate(
    () => new Date(),
  ),
});

export const historyRelations = relations(historyTable, ({ one }) => ({
  vehicle: one(vehicleTable, {
    fields: [historyTable.vehicleId],
    references: [vehicleTable.id],
  }),
  cost: one(moneyTable),
}));

export const moneyTable = pgTable("money", {
  id: serial("id").primaryKey(),
  amount: integer("amount"),
  currency: text("currency").notNull(),
  historyEntryId: integer("history_entry_id").references(
    () => historyTable.id,
    { onDelete: "cascade" },
  ),
  createdAt: timestamp("created_at", {
    mode: "date",
    precision: 3,
  }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date", precision: 3 }).$onUpdate(
    () => new Date(),
  ),
});

export const moneyRelations = relations(moneyTable, ({ one }) => ({
  historyEntry: one(historyTable, {
    fields: [moneyTable.historyEntryId],
    references: [historyTable.id],
  }),
}));
