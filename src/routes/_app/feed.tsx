import { MurphItem } from "@/components/murph-item";
import { getAllMurphsServerFn } from "@/lib/api";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/feed")({
	component: RouteComponent,
	loader: async () => await getAllMurphsServerFn(),
});

function RouteComponent() {
	const murphs = Route.useLoaderData();

	return (
		<div className="flex flex-col gap-2">
			<h1 className="font-bold text-3xl mb-4">Murphs Feed</h1>

			{murphs?.map((m) => (
				<MurphItem showUser m={m} />
			))}
		</div>
	);
}
