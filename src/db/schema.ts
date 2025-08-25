import { int, integer, real, sqliteTable } from "drizzle-orm/sqlite-core";

export const murphsTable = sqliteTable("murphs_table", {
	id: int().primaryKey({ autoIncrement: true }),

	startTime: integer({ mode: "timestamp_ms" }).notNull(),

	firstRunDistance: real().notNull().default(0),
	firstRunEndTime: integer({ mode: "timestamp_ms" }).notNull(),

	pullups: integer().notNull().default(0),
	pushups: integer().notNull().default(0),
	squats: integer().notNull().default(0),
	exercisesEndTime: integer({ mode: "timestamp_ms" }).notNull(),

	secondRunDistance: real().notNull().default(0),
	secondRunEndTime: integer({ mode: "timestamp_ms" }).notNull(),
});

export type NewMurph = Omit<typeof murphsTable.$inferSelect, "id">;
export type Murph = typeof murphsTable.$inferSelect;
