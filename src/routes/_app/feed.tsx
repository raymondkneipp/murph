import { MurphItem } from "@/components/murph-item";
import { db } from "@/db";
import { murphsTable, user } from "@/db/schema";
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";

const getAllMurphs = createServerFn({ method: "GET" }).handler(async () => {
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

	// return db.select().from(murphsTable);
});

export const Route = createFileRoute("/_app/feed")({
	component: RouteComponent,
	loader: async () => await getAllMurphs(),
});

function RouteComponent() {
	const murphs = Route.useLoaderData();

	return (
		<div className="flex flex-col gap-2">
			<h1 className="font-bold text-3xl">Global Murphs</h1>

			{murphs?.map((m) => (
				<MurphItem m={m} />
			))}
		</div>
	);
}
