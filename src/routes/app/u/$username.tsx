import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUserFromUsernameServerFn } from "@/lib/api";
import { murphMetrics, formatNumber } from "@/lib/utils";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { FlameIcon, HashIcon, HourglassIcon, TimerIcon } from "lucide-react";
import { Icon as CustomIcons } from "@/components/icon";
import { MurphItem } from "@/components/murph-item";

export const Route = createFileRoute("/app/u/$username")({
	component: RouteComponent,
	loader: async ({ params }) => {
		return {
			userProfile: await getUserFromUsernameServerFn({
				data: params.username,
			}),
		};
	},
});

function RouteComponent() {
	const { userProfile } = Route.useLoaderData();

	const {
		totalDistance,
		totalPullups,
		totalPushups,
		totalSquats,
		totalMurphs,
		fastestMurph,
		longestStreak,
		averageMurph,
	} = useMemo(
		() => murphMetrics(userProfile.murphs ?? []),
		[userProfile.murphs],
	);

	return (
		<div className="flex flex-col gap-8">
			<h1 className="font-bold text-3xl">{userProfile.name}'s Profile</h1>

			<div className="flex items-center gap-4">
				<Avatar className="size-36 text-6xl group">
					<AvatarImage src={userProfile.image ?? ""} />
					<AvatarFallback>{userProfile.name.charAt(0)}</AvatarFallback>
				</Avatar>
				<div className="flex flex-col">
					<h2 className="font-bold text-2xl">{userProfile.name}</h2>
					<h3 className="text-lg">@{userProfile.username}</h3>
				</div>
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
					<TimerIcon className="size-8" />
					<div className="flex flex-col">
						<p className="font-bold">{fastestMurph ?? "N/A"}</p>
						<h3 className="text-xs">Fastest Time</h3>
					</div>
				</div>

				<div className="flex items-center gap-3">
					<HourglassIcon className="size-8" />
					<div className="flex flex-col">
						<p className="font-bold">{averageMurph ?? "N/A"}</p>
						<h3 className="text-xs">Average Time</h3>
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
				{userProfile.murphs?.map((m) => (
					<MurphItem m={m} key={m.id} />
				))}
			</div>
		</div>
	);
}
