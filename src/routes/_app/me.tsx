import { createFileRoute } from "@tanstack/react-router";
import { Murph } from "@/db/schema";
import { useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BadgeIcon, FlameIcon, HashIcon, TimerIcon } from "lucide-react";
import { Icon as CustomIcons } from "@/components/icon";
import { formatNumber, formatTimeDifference } from "@/lib/utils";
import { MurphItem } from "@/components/murph-item";
import { DemoBadges } from "@/components/demo-badges";
import { getUserMurphsServerFn, getUserNameServerFn } from "@/lib/api";

export const Route = createFileRoute("/_app/me")({
	component: RouteComponent,
	loader: async () => {
		return {
			murphs: await getUserMurphsServerFn(),
			username: await getUserNameServerFn(),
		};
	},
});

function murphMetrics(murphs: Murph[]) {
	const fullMurphs = murphs.filter((m) => m.murphType === "Full Murph");

	// --- fastest murph ---
	const fastestMurph = fullMurphs.length
		? fullMurphs.reduce((fastest, current) => {
				const fastestDuration =
					new Date(fastest.secondRunEndTime).getTime() -
					new Date(fastest.startTime).getTime();

				const currentDuration =
					new Date(current.secondRunEndTime).getTime() -
					new Date(current.startTime).getTime();

				return currentDuration < fastestDuration ? current : fastest;
			})
		: null;

	// --- longest streak (only full murphs) ---
	const sortedFullMurphs = [...fullMurphs].sort(
		(a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
	);

	let longestStreak = 0;
	let currentStreak = 0;
	let prevDate: string | null = null;

	for (const murph of sortedFullMurphs) {
		const dateStr = new Date(murph.startTime).toISOString().split("T")[0]; // "YYYY-MM-DD"

		if (!prevDate) {
			currentStreak = 1;
		} else {
			const prev = new Date(prevDate);
			const curr = new Date(dateStr);
			const diffDays =
				(curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);

			if (diffDays === 1) {
				currentStreak += 1; // consecutive
			} else if (diffDays === 0) {
				// same day → ignore
			} else {
				currentStreak = 1; // streak reset
			}
		}

		prevDate = dateStr;
		longestStreak = Math.max(longestStreak, currentStreak);
	}

	return {
		totalDistance: murphs.reduce(
			(prev, cur) => prev + cur.firstRunDistance + cur.secondRunDistance,
			0,
		),
		totalPullups: murphs.reduce((prev, cur) => prev + cur.pullups, 0),
		totalPushups: murphs.reduce((prev, cur) => prev + cur.pushups, 0),
		totalSquats: murphs.reduce((prev, cur) => prev + cur.squats, 0),
		totalMurphs: murphs.reduce((prev, cur) => {
			let x = 0;
			switch (cur.murphType) {
				case "1/4 Murph":
					x = 0.25;
					break;
				case "1/2 Murph":
					x = 0.5;
					break;
				case "3/4 Murph":
					x = 0.75;
					break;
				case "Full Murph":
					x = 1;
					break;
			}
			return prev + x;
		}, 0),
		fastestMurph: fastestMurph
			? formatTimeDifference(
					new Date(fastestMurph.startTime),
					new Date(fastestMurph.secondRunEndTime),
				)
			: null,
		longestStreak,
	};
}

function RouteComponent() {
	let { murphs, username } = Route.useLoaderData();

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
					{/*
                <AvatarImage src="https://github.com/shadcn.png" />
                  */}
					<AvatarFallback>{username?.charAt(0) ?? "Anon"}</AvatarFallback>
				</Avatar>
				<h2 className="font-bold text-2xl">{username}</h2>
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
					<MurphItem m={m} />
				))}
			</div>

			<DemoBadges />
		</div>
	);
}
