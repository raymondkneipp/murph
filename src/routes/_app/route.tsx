import {
	createFileRoute,
	Link,
	Outlet,
	redirect,
	useRouter,
} from "@tanstack/react-router";
import { ChevronDownIcon } from "lucide-react";
import { Brand } from "@/components/brand";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getUserName } from "./me";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/_app")({
	component: RouteComponent,
	beforeLoad: async ({ location }) => {
		console.log("beforeLoad");
		const session = await authClient.getSession();
		console.log({ session });

		if (!session.data) {
			throw redirect({
				to: "/login",
				search: {
					// Use the current location to power a redirect after login
					// (Do not use `router.state.resolvedLocation` as it can
					// potentially lag behind the actual current location)
					redirect: location.href,
				},
			});
		}
	},

	loader: async () => await getUserName(),
});

function RouteComponent() {
	const username = Route.useLoaderData();
	const router = useRouter();

	return (
		<>
			<header className="flex items-center gap-2 justify-between container md:pt-16 pt-4 pb-4 flex-col md:flex-row">
				<Brand />
				<nav className="flex items-center">
					<Button asChild variant="ghost">
						<Link to="/feed">Home</Link>
					</Button>
					<Button asChild variant="ghost">
						<Link to="/murph/new">New Murph</Link>
					</Button>
					<Button asChild variant="ghost">
						<Link to="/leaderboard">Leaderboard</Link>
					</Button>

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost">
								<Avatar>
									{/*
                <AvatarImage src="https://github.com/shadcn.png" />
                  */}
									<AvatarFallback>{username?.charAt(0)}</AvatarFallback>
								</Avatar>
								<span className="hidden sm:inline">{username}</span>
								<ChevronDownIcon />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuLabel>My Account</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem asChild>
								<Link to="/me">Profile</Link>
							</DropdownMenuItem>
							<DropdownMenuItem asChild>
								<Link to="/settings">Settings</Link>
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								className="text-destructive"
								onClick={() => {
									authClient.signOut();
									router.navigate({ to: "/login" });
								}}
							>
								Logout
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</nav>
			</header>

			<main className="flex-grow container py-12">
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
