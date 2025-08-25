import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/murph/$murphId")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/_app/murph/$workoutId"!</div>;
}
