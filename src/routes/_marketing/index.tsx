import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_marketing/")({
	component: App,
});

function App() {
	return (
		<>
			<Link to="/demo">Demo</Link>
			<h1>Marketing Index page</h1>
		</>
	);
}
