import { Brand } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { createFileRoute, Outlet, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_marketing")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<>
			<header className="bg-muted sticky md:-top-12 top-0 z-100">
				<div className="flex items-center justify-between container md:pt-16 pt-4 pb-4">
					<Brand />
					<nav className="flex items-center gap-4">
						<Button asChild>
							<Link to="/signup">Sign Up</Link>
						</Button>

						<Button asChild variant="secondary">
							<Link to="/login">Login</Link>
						</Button>
					</nav>
				</div>
			</header>
			<main>
				<Outlet />
			</main>
			<footer className="container flex flex-col gap-8 py-8">
				<div className="flex flex-col gap-4">
					<Brand />
					<p className="text-muted-foreground max-w-xs text-pretty text-sm">
						Honoring Lt. Michael Murphy and all fallen heroes through fitness
						and community.
					</p>
				</div>

				<hr />

				<p className="text-center text-sm text-pretty text-muted-foreground">
					© 2025 Murph Workout App. All rights reserved. Built to honor our
					heroes.
				</p>
			</footer>
		</>
	);
}
