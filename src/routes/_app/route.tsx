import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
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

export const Route = createFileRoute("/_app")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<>
			<header className="flex items-center gap-2 justify-between container md:pt-16 pt-4 pb-4 flex-col md:flex-row">
				<Brand />
				<nav className="flex items-center gap-2">
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
									<AvatarImage src="https://github.com/shadcn.png" />
									<AvatarFallback>UN</AvatarFallback>
								</Avatar>
								<span className="hidden sm:inline">us3rn@m3</span>
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
							<DropdownMenuItem className="text-destructive">
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
