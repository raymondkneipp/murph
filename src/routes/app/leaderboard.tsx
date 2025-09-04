import { Leaderboard } from "@/components/leaderboard";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/leaderboard")({
	component: RouteComponent,
});

function RouteComponent() {
	return <Leaderboard />;
}
