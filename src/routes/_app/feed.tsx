import { db } from "@/db";
import { murphsTable } from "@/db/schema";
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

const getAllMurphs = createServerFn({ method: "GET" }).handler(async () => {
	return db.select().from(murphsTable);
});

export const Route = createFileRoute("/_app/feed")({
	component: RouteComponent,
	loader: async () => await getAllMurphs(),
});

function RouteComponent() {
	const murphs = Route.useLoaderData();

	return (
		<div className="container">
			<h1>Murphs</h1>
			{murphs.map((m) => (
				<div>{m.id}</div>
			))}
		</div>
	);
}
