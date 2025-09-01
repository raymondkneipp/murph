import { Leaderboard } from "@/components/leaderboard";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_marketing/leaderboard")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div>
			<Leaderboard />
		</div>
	);
}
