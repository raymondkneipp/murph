import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BadgeIcon, FlameIcon, HashIcon, TimerIcon } from "lucide-react";
import { Icon as CustomIcons } from "@/components/icon";
import { formatNumber, murphMetrics } from "@/lib/utils";
import { MurphItem } from "@/components/murph-item";
import { DemoBadges } from "@/components/demo-badges";
import { getUserMurphsServerFn, getUserServerFn } from "@/lib/api";

export const Route = createFileRoute("/_app/me")({
	component: RouteComponent,
	beforeLoad: async () => {
		const user = await getUserServerFn();

		return {
			user: {
				...user,
				name: user.name ?? "Anonymous",
			},
		};
	},

	loader: async ({ context }) => {
		return {
			murphs: await getUserMurphsServerFn(),
			user: context.user,
		};
	},
});

function RouteComponent() {
	const { murphs, user } = Route.useLoaderData();

	const {
		totalDistance,
		totalPullups,
		totalPushups,
		totalSquats,
		totalMurphs,
		fastestMurph,
		longestStreak,
	} = useMemo(() => murphMetrics(murphs ?? []), [murphs]);

	return (
		<div className="flex flex-col gap-8">
			<h1 className="font-bold text-3xl">My Profile</h1>

			<div className="flex items-center gap-8">
				<Avatar className="size-36 text-6xl">
					<AvatarImage src={user.image ?? ""} />
					<AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
				</Avatar>
				<h2 className="font-bold text-2xl">{user.name}</h2>
			</div>

			<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
				<div className="flex items-center gap-3">
					<CustomIcons.Pullup className="size-8" />
					<div className="flex flex-col">
						<p className="font-bold">{formatNumber(totalPullups)}</p>
						<h3 className="text-xs">Total Pullups</h3>
					</div>
				</div>

				<div className="flex items-center gap-3">
					<CustomIcons.Pushup className="size-8" />
					<div className="flex flex-col">
						<p className="font-bold">{formatNumber(totalPushups)}</p>
						<h3 className="text-xs">Total Pushups</h3>
					</div>
				</div>

				<div className="flex items-center gap-3">
					<CustomIcons.Squat className="size-8" />
					<div className="flex flex-col">
						<p className="font-bold">{formatNumber(totalSquats)}</p>
						<h3 className="text-xs">Total Squats</h3>
					</div>
				</div>

				<div className="flex items-center gap-3">
					<CustomIcons.Running className="size-8" />
					<div className="flex flex-col">
						<p className="font-bold">{formatNumber(totalDistance)} mi</p>
						<h3 className="text-xs">Total Distance</h3>
					</div>
				</div>

				<div className="flex items-center gap-3">
					<HashIcon className="size-8" />
					<div className="flex flex-col">
						<p className="font-bold">{formatNumber(totalMurphs)}</p>
						<h3 className="text-xs">Total Murphs</h3>
					</div>
				</div>

				<div className="flex items-center gap-3">
					<BadgeIcon className="size-8" />
					<div className="flex flex-col">
						<p className="font-bold">?? / ??</p>
						<h3 className="text-xs">Badges Unlocked</h3>
					</div>
				</div>

				<div className="flex items-center gap-3">
					<TimerIcon className="size-8" />
					<div className="flex flex-col">
						<p className="font-bold">{fastestMurph ?? "N/A"}</p>
						<h3 className="text-xs">Fastest Time</h3>
					</div>
				</div>

				<div className="flex items-center gap-3">
					<FlameIcon className="size-8" />
					<div className="flex flex-col">
						<p className="font-bold">{longestStreak}</p>
						<h3 className="text-xs">Longest Streak</h3>
					</div>
				</div>
			</div>

			<div className="flex flex-col gap-2">
				{murphs?.map((m) => (
					<MurphItem m={m} key={m.id} />
				))}
			</div>

			<DemoBadges />
		</div>
	);
}
