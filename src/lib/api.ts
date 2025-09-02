import { redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { db } from "@/db";
import { murphsTable, user } from "@/db/schema";
import { desc, eq, getTableColumns } from "drizzle-orm";
import { authMiddleware } from "@/lib/auth-middleware";
import z from "zod";

export const getUserMurphsServerFn = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.handler(async ({ context }) => {
		const { user } = context;

		if (!user.id) {
			throw redirect({ to: "/login" });
		}

		return db
			.select()
			.from(murphsTable)
			.where(eq(murphsTable.userId, user.id))
			.orderBy(desc(murphsTable.startTime));
	});

export const getUserNameServerFn = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.handler(async ({ context }) => {
		const { user } = context;

		if (!user.id) {
			throw redirect({ to: "/login" });
		}

		return user.name;
	});

export const getAllMurphsServerFn = createServerFn({ method: "GET" }).handler(
	async () => {
		return db
			.select({
				id: murphsTable.id,
				startTime: murphsTable.startTime,
				murphType: murphsTable.murphType,
				firstRunDistance: murphsTable.firstRunDistance,
				firstRunEndTime: murphsTable.firstRunEndTime,
				secondRunDistance: murphsTable.secondRunDistance,
				secondRunEndTime: murphsTable.secondRunEndTime,
				pullups: murphsTable.pullups,
				pushups: murphsTable.pushups,
				squats: murphsTable.squats,
				exercisesEndTime: murphsTable.exercisesEndTime,
				// user fields
				userId: user.id,
				userName: user.name,
			})
			.from(murphsTable)
			.innerJoin(user, eq(murphsTable.userId, user.id));
	},
);

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
		const [{ date: earliestMurph }] = await db
			.select({
				date: murphsTable.startTime,
			})
			.from(murphsTable)
			.orderBy(murphsTable.startTime)
			.limit(1);

		const topTen = await db
			.select({
				...getTableColumns(murphsTable),
				userId: user.id,
				userName: user.name,
			})
			.from(murphsTable)
			.orderBy(murphsTable.duration) // shortest first
			.where(eq(murphsTable.murphType, "FULL"))
			.innerJoin(user, eq(murphsTable.userId, user.id))
			.limit(3);

		return {
			earliestMurph,
			topTen,
		};
	});

export const getUserIdServerFn = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.handler(async ({ context }) => {
		return context?.user?.id;
	});
