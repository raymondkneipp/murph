import { relations, sql, type SQL } from "drizzle-orm";
import { int, integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

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

	userId: text()
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),

	murphType: text({
		enum: ["FULL", "THREE_QUARTER", "HALF", "QUARTER", "INCOMPLETE"],
	}).generatedAlwaysAs(
		(): SQL => sql`
    CASE
      WHEN ${murphsTable.firstRunDistance} >= 1
       AND ${murphsTable.secondRunDistance} >= 1
       AND ${murphsTable.pullups} >= 100
       AND ${murphsTable.pushups} >= 200
       AND ${murphsTable.squats} >= 300
      THEN 'FULL'

      WHEN ${murphsTable.firstRunDistance} >= 0.75
       AND ${murphsTable.secondRunDistance} >= 0.75
       AND ${murphsTable.pullups} >= 75
       AND ${murphsTable.pushups} >= 150
       AND ${murphsTable.squats} >= 225
      THEN 'THREE_QUARTER'

      WHEN ${murphsTable.firstRunDistance} >= 0.5
       AND ${murphsTable.secondRunDistance} >= 0.5
       AND ${murphsTable.pullups} >= 50
       AND ${murphsTable.pushups} >= 100
       AND ${murphsTable.squats} >= 150
      THEN 'HALF'

      WHEN ${murphsTable.firstRunDistance} >= 0.25
       AND ${murphsTable.secondRunDistance} >= 0.25
       AND ${murphsTable.pullups} >= 25
       AND ${murphsTable.pushups} >= 50
       AND ${murphsTable.squats} >= 75
      THEN 'QUARTER'

      ELSE 'INCOMPLETE'
    END
  `,
		{ mode: "virtual" },
	),

	duration: integer("duration").generatedAlwaysAs(
		(): SQL => sql`${murphsTable.secondRunEndTime} - ${murphsTable.startTime}`,
		{ mode: "virtual" },
	),
});

export type NewMurph = Omit<typeof murphsTable.$inferSelect, "id">;
export type Murph = typeof murphsTable.$inferSelect;
export type MurphWithUser = Murph & {
	user: Pick<typeof user.$inferSelect, "id" | "name" | "image">;
};
export type MurphMaybeWithUser = Murph & {
	user: Pick<typeof user.$inferSelect, "id" | "name" | "image"> | null;
};

// Auth

export const user = sqliteTable("user", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	emailVerified: integer("email_verified", { mode: "boolean" })
		.$defaultFn(() => false)
		.notNull(),
	image: text("image"),
	createdAt: integer("created_at", { mode: "timestamp" })
		.$defaultFn(() => /* @__PURE__ */ new Date())
		.notNull(),
	updatedAt: integer("updated_at", { mode: "timestamp" })
		.$defaultFn(() => /* @__PURE__ */ new Date())
		.notNull(),
});

export const session = sqliteTable("session", {
	id: text("id").primaryKey(),
	expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
	token: text("token").notNull().unique(),
	createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
	updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
});

export const account = sqliteTable("account", {
	id: text("id").primaryKey(),
	accountId: text("account_id").notNull(),
	providerId: text("provider_id").notNull(),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	idToken: text("id_token"),
	accessTokenExpiresAt: integer("access_token_expires_at", {
		mode: "timestamp",
	}),
	refreshTokenExpiresAt: integer("refresh_token_expires_at", {
		mode: "timestamp",
	}),
	scope: text("scope"),
	password: text("password"),
	createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
	updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const verification = sqliteTable("verification", {
	id: text("id").primaryKey(),
	identifier: text("identifier").notNull(),
	value: text("value").notNull(),
	expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
	createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
		() => /* @__PURE__ */ new Date(),
	),
	updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
		() => /* @__PURE__ */ new Date(),
	),
});

// Relations

export const userRelations = relations(user, ({ many }) => ({
	murphs: many(murphsTable),
}));

export const murphsRelations = relations(murphsTable, ({ one }) => ({
	user: one(user, {
		fields: [murphsTable.userId],
		references: [user.id],
	}),
}));
