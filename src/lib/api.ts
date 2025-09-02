import { notFound, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { db } from "@/db";
import { murphsTable } from "@/db/schema";
import { and, desc, eq, gte } from "drizzle-orm";
import { authMiddleware } from "@/lib/auth-middleware";
import z from "zod";

export const getUserMurphsServerFn = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.handler(async ({ context }) => {
		const { user } = context;

		if (!user.id) {
			throw redirect({ to: "/login" });
		}

		return await db.query.murphsTable.findMany({
			where: eq(murphsTable.userId, user.id),
			with: {
				user: {
					columns: {
						id: true,
						name: true,
						image: true,
					},
				},
			},
			orderBy: desc(murphsTable.startTime),
		});
	});

export const getAllMurphsServerFn = createServerFn({ method: "GET" }).handler(
	async () => {
		return await db.query.murphsTable.findMany({
			with: {
				user: {
					columns: {
						id: true,
						name: true,
						image: true,
					},
				},
			},
			orderBy: desc(murphsTable.startTime),
		});
	},
);

export const deleteMurphServerFn = createServerFn({ method: "POST" })
	.validator(
		z.object({
			murphId: z.number(),
		}),
	)
	.middleware([authMiddleware])
	.handler(async ({ data, context }) => {
		const { user } = context;

		if (!user.id) {
			throw redirect({ to: "/login" });
		}

		const murphToDelete = await db.query.murphsTable.findFirst({
			where: eq(murphsTable.id, data.murphId),
			with: {
				user: {
					columns: {
						id: true,
					},
				},
			},
		});

		if (!murphToDelete) {
			throw notFound();
		}

		if (murphToDelete.user.id !== user.id) {
			throw new Error("Unauthorized");
		}

		return db
			.delete(murphsTable)
			.where(eq(murphsTable.id, data.murphId))
			.returning();
	});

export const addMurphServerFn = createServerFn({ method: "POST" })
	.validator(
		z.object({
			startTime: z.date(),

			firstRunDistance: z.number(),
			firstRunEndTime: z.date(),

			pullups: z.number(),
			pushups: z.number(),
			squats: z.number(),
			exercisesEndTime: z.date(),

			secondRunDistance: z.number(),
			secondRunEndTime: z.date(),
		}),
	)
	.middleware([authMiddleware])
	.handler(async ({ data, context }) => {
		const { user } = context;

		if (!user.id) {
			throw redirect({ to: "/login" });
		}

		return db
			.insert(murphsTable)
			.values({ ...data, userId: user.id })
			.returning();
	});

export const getLeaderBoardServerFn = createServerFn({ method: "GET" })
	.validator(
		z.object({
			date: z.date(),
		}),
	)
	.handler(async ({ data }) => {
		const startOfMonth = new Date(
			data.date.getFullYear(),
			data.date.getMonth(),
			1,
		);

		const earliestMurph = await db.query.murphsTable.findFirst({
			columns: {
				startTime: true,
			},
			orderBy: murphsTable.startTime,
		});

		const topTen = await db.query.murphsTable.findMany({
			with: {
				user: {
					columns: {
						id: true,
						name: true,
						image: true,
					},
				},
			},
			orderBy: murphsTable.duration,
			where: and(
				eq(murphsTable.murphType, "FULL"),
				gte(murphsTable.startTime, startOfMonth),
			),
			limit: 10,
		});

		return {
			earliestMurph,
			topTen,
		};
	});

export const getUserServerFn = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.handler(async ({ context }) => {
		const { user } = context;

		return user;
	});
