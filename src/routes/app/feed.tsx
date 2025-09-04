import { MurphItem } from "@/components/murph-item";
import { Input } from "@/components/ui/input";
import { getAllMurphsServerFn } from "@/lib/api";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/feed")({
	component: RouteComponent,
	loader: async () => await getAllMurphsServerFn(),
});

function RouteComponent() {
	const murphs = Route.useLoaderData();

	return (
		<div className="flex flex-col gap-2">
			<h1 className="font-bold text-3xl mb-4">Recent Murphs</h1>

			<Input inputMode="search" type="text" />

			{murphs?.map((m) => (
				<MurphItem showUser m={m} />
			))}
		</div>
	)
}
