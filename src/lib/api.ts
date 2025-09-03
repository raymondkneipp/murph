import { notFound, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { db } from "@/db";
import { murphsTable, user as userTable } from "@/db/schema";
import { and, desc, eq, gte } from "drizzle-orm";
import { authMiddleware } from "@/lib/auth-middleware";
import z from "zod";
import sharp from "sharp";

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

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { env } from "@/env/server";

export const uploadProfilePictureServerFn = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.validator(z.instanceof(FormData))
	.handler(async ({ context, data }) => {
		const { user } = context;

		if (!user.id) throw new Error("No user id");

		const file = data.get("file") as File;
		if (!(file instanceof File)) throw new Error("[file] not found");

		const validation = z
			.file()
			.max(2_000_000, { message: "Must be smaller than 2MB" })
			.mime(["image/png", "image/jpeg", "image/webp"])
			.safeParse(file);
		if (!validation.success) {
			throw new Error(validation.error.message);
		}

		const buffer = Buffer.from(await file.arrayBuffer());

		const compressedBuffer = await sharp(buffer)
			.resize(140, 140)
			.webp({ quality: 60 })
			.toBuffer();

		const r2 = new S3Client({
			region: env.S3_REGION,
			endpoint: env.S3_ENDPOINT,
			credentials: {
				accessKeyId: env.S3_ACCESS_KEY,
				secretAccessKey: env.S3_SECRET_KEY,
			},
		});

		const key = user.id;

		await r2.send(
			new PutObjectCommand({
				Bucket: env.S3_BUCKET_NAME,
				Key: key,
				Body: compressedBuffer,
				ContentType: "image/webp",
				ACL: "public-read",
			}),
		);

		const url = `${env.R2_PUBLIC_URL}/${key}?v=${Date.now()}`;

		await db
			.update(userTable)
			.set({ image: url })
			.where(eq(userTable.id, user.id));

		return { url };
	});
