import { Brand } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { getUserServerFn } from "@/lib/api";
import {
	createFileRoute,
	Link,
	Outlet,
	redirect,
} from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/_auth")({
	component: RouteComponent,
	beforeLoad: async () => {
		const user = await getUserServerFn();

		return {
			user,
		};
	},

	loader: async ({ context }) => {
		if (context.user.id) {
			throw redirect({ to: "/app/feed" });
		}
	},
});

function RouteComponent() {
	return (
		<>
			<header className="container max-w-md md:pt-16 pt-4 pb-4 flex flex-col gap-4 items-center">
				<Brand />
				<nav>
					<Button variant="ghost" asChild>
						<Link to="/">
							<ArrowLeft />
							Home
						</Link>
					</Button>
				</nav>
			</header>

			<main className="container max-w-md flex-grow">
				<Outlet />
			</main>

			<footer className="container py-4">
				<p className="text-center text-sm text-pretty text-muted-foreground">
					© 2025 Murph Workout App. All rights reserved. Built to honor our
					heroes.
				</p>
			</footer>
		</>
	);
}
