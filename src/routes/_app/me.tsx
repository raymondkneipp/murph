import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { db } from "@/db";
import { Murph, murphsTable } from "@/db/schema";
import { Card, CardContent } from "@/components/ui/card";
import { useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	AwardIcon,
	BabyIcon,
	BadgeIcon,
	BicepsFlexedIcon,
	CatIcon,
	CrownIcon,
	FlameIcon,
	HashIcon,
	Icon,
	MailIcon,
	RabbitIcon,
	TimerIcon,
	ToiletIcon,
	TrophyIcon,
	UserStarIcon,
	WormIcon,
} from "lucide-react";
import {
	bottleBaby,
	bullHead,
	butterfly,
	frogFace,
	owl,
	pig,
} from "@lucide/lab";
import { MurphBadge } from "@/components/murph-badge";
import { Icon as CustomIcons } from "@/components/icon";
import { formatNumber, formatTimeDifference } from "@/lib/utils";
import { getWebRequest } from "@tanstack/react-start/server";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { Badge } from "@/components/ui/badge";
import { MurphItem } from "@/components/murph-item";

const getUserMurphs = createServerFn({ method: "GET" }).handler(async () => {
	const request = getWebRequest();
	if (!request?.headers) {
		return null;
	}
	const session = await auth.api.getSession({
		headers: request.headers,
	});

	if (!session?.user) {
		throw new Error("Unauthorized");
	}

	return db
		.select()
		.from(murphsTable)
		.where(eq(murphsTable.userId, session.user.id));
});

export const getUserName = createServerFn({ method: "GET" }).handler(
	async () => {
		const request = getWebRequest();
		if (!request?.headers) {
			return null;
		}
		const session = await auth.api.getSession({
			headers: request.headers,
		});

		if (!session?.user) {
			throw new Error("Unauthorized");
		}

		return session.user.name;
	},
);

export const Route = createFileRoute("/_app/me")({
	component: RouteComponent,
	loader: async () => {
		return {
			murphs: await getUserMurphs(),
			username: await getUserName(),
		};
	},
});

function murphMetrics(murphs: Murph[]) {
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
				case "Incomplete":
					x = 0;
					break;
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
						<p className="font-bold">??:??:??</p>
						<h3 className="text-xs">Fastest Time</h3>
					</div>
				</div>

				<div className="flex items-center gap-3">
					<FlameIcon className="size-8" />
					<div className="flex flex-col">
						<p className="font-bold">??</p>
						<h3 className="text-xs">Longest Streak</h3>
					</div>
				</div>
			</div>

			<div className="flex flex-col gap-2">
				{murphs?.map((m) => (
					<MurphItem m={m} />
				))}
			</div>

			<h2 className="font-bold text-2xl">Badges</h2>
			<p>Complete X murphs</p>
			<div className="flex">
				<MurphBadge level={1}>5</MurphBadge>
				<MurphBadge level={2}>10</MurphBadge>
				<MurphBadge level={3}>25</MurphBadge>
				<MurphBadge level={4}>50</MurphBadge>
			</div>

			<p>Complete murph under X time</p>
			<div className="flex">
				<MurphBadge level={1}>
					<TimerIcon className="size-7" />
				</MurphBadge>
				<MurphBadge level={2}>
					<TimerIcon className="size-7" />
				</MurphBadge>
				<MurphBadge level={3}>
					<TimerIcon className="size-7" />
				</MurphBadge>
				<MurphBadge level={4}>
					<TimerIcon className="size-7" />
				</MurphBadge>
			</div>

			<p>Complete X streak</p>
			<div className="flex">
				<MurphBadge level={1}>
					<FlameIcon className="size-7" />
				</MurphBadge>
				<MurphBadge level={2}>
					<FlameIcon className="size-7" />
				</MurphBadge>
				<MurphBadge level={3}>
					<FlameIcon className="size-7" />
				</MurphBadge>
				<MurphBadge level={4}>
					<FlameIcon className="size-7" />
				</MurphBadge>
			</div>

			<p>Finish in X place on monthly leaderboard</p>
			<div className="flex">
				<MurphBadge level={1}>
					<TrophyIcon className="size-7" />
				</MurphBadge>
				<MurphBadge level={2}>
					<TrophyIcon className="size-7" />
				</MurphBadge>
				<MurphBadge level={3}>
					<TrophyIcon className="size-7" />
				</MurphBadge>
				<MurphBadge level={4}>
					<TrophyIcon className="size-7" />
				</MurphBadge>
			</div>

			<p>Complete murph on memorial day</p>
			<div className="flex">
				<MurphBadge level={4}>
					<AwardIcon className="size-7" />
				</MurphBadge>
			</div>

			<p>Complete 2 murphs in one day</p>
			<div className="flex">
				<MurphBadge level={4}>
					<Icon iconNode={bullHead} className="size-7" />
				</MurphBadge>
			</div>

			<p>top x fastest murph</p>
			<div className="flex">
				<MurphBadge level={1}>
					<CrownIcon className="size-7" />
				</MurphBadge>
				<MurphBadge level={2}>
					<CrownIcon className="size-7" />
				</MurphBadge>
				<MurphBadge level={3}>
					<CrownIcon className="size-7" />
				</MurphBadge>
				<MurphBadge level={4}>
					<CrownIcon className="size-7" />
				</MurphBadge>
			</div>

			<p>Run x distance</p>
			<div className="flex">
				<MurphBadge level={1}>
					<RabbitIcon className="size-7" />
				</MurphBadge>
				<MurphBadge level={2}>
					<RabbitIcon className="size-7" />
				</MurphBadge>
				<MurphBadge level={3}>
					<RabbitIcon className="size-7" />
				</MurphBadge>
				<MurphBadge level={4}>
					<RabbitIcon className="size-7" />
				</MurphBadge>
			</div>

			<p>Complete murph with 0 run distance and 0 reps</p>
			<div className="flex">
				<MurphBadge level={1}>
					<ToiletIcon className="size-7" />
				</MurphBadge>
			</div>

			<p>Follow x people</p>
			<div className="flex">
				<MurphBadge level={1}>
					<Icon iconNode={butterfly} className="size-7" />
				</MurphBadge>
				<MurphBadge level={2}>
					<Icon iconNode={butterfly} className="size-7" />
				</MurphBadge>
				<MurphBadge level={3}>
					<Icon iconNode={butterfly} className="size-7" />
				</MurphBadge>
				<MurphBadge level={4}>
					<Icon iconNode={butterfly} className="size-7" />
				</MurphBadge>
			</div>

			<p>Get x followers</p>
			<div className="flex">
				<MurphBadge level={1}>
					<UserStarIcon className="size-7" />
				</MurphBadge>
				<MurphBadge level={2}>
					<UserStarIcon className="size-7" />
				</MurphBadge>
				<MurphBadge level={3}>
					<UserStarIcon className="size-7" />
				</MurphBadge>
				<MurphBadge level={4}>
					<UserStarIcon className="size-7" />
				</MurphBadge>
			</div>

			<p>Perform x pullups</p>
			<div className="flex">
				<MurphBadge level={1}>
					<BicepsFlexedIcon className="size-7" />
				</MurphBadge>
				<MurphBadge level={2}>
					<BicepsFlexedIcon className="size-7" />
				</MurphBadge>
				<MurphBadge level={3}>
					<BicepsFlexedIcon className="size-7" />
				</MurphBadge>
				<MurphBadge level={4}>
					<BicepsFlexedIcon className="size-7" />
				</MurphBadge>
			</div>

			<p>Complete x 1/4 murphs</p>
			<div className="flex">
				<MurphBadge level={1}>
					<BabyIcon className="size-7" />
				</MurphBadge>
				<MurphBadge level={2}>
					<BabyIcon className="size-7" />
				</MurphBadge>
				<MurphBadge level={3}>
					<BabyIcon className="size-7" />
				</MurphBadge>
				<MurphBadge level={4}>
					<BabyIcon className="size-7" />
				</MurphBadge>
			</div>

			<p>Complete x 3/4 murphs</p>
			<div className="flex">
				<MurphBadge level={1}>
					<CatIcon className="size-7" />
				</MurphBadge>
				<MurphBadge level={2}>
					<CatIcon className="size-7" />
				</MurphBadge>
				<MurphBadge level={3}>
					<CatIcon className="size-7" />
				</MurphBadge>
				<MurphBadge level={4}>
					<CatIcon className="size-7" />
				</MurphBadge>
			</div>

			<p>Complete x 1/2 murphs</p>
			<div className="flex">
				<MurphBadge level={1}>
					<Icon iconNode={bottleBaby} className="size-7" />
				</MurphBadge>
				<MurphBadge level={2}>
					<Icon iconNode={bottleBaby} className="size-7" />
				</MurphBadge>
				<MurphBadge level={3}>
					<Icon iconNode={bottleBaby} className="size-7" />
				</MurphBadge>
				<MurphBadge level={4}>
					<Icon iconNode={bottleBaby} className="size-7" />
				</MurphBadge>
			</div>

			<p>Perform x squats</p>
			<div className="flex">
				<MurphBadge level={1}>
					<Icon iconNode={frogFace} className="size-7" />
				</MurphBadge>
				<MurphBadge level={2}>
					<Icon iconNode={frogFace} className="size-7" />
				</MurphBadge>
				<MurphBadge level={3}>
					<Icon iconNode={frogFace} className="size-7" />
				</MurphBadge>
				<MurphBadge level={4}>
					<Icon iconNode={frogFace} className="size-7" />
				</MurphBadge>
			</div>

			<p>Follow x people with 0 followers</p>
			<div className="flex">
				<MurphBadge level={1}>
					<Icon iconNode={owl} className="size-7" />
				</MurphBadge>
				<MurphBadge level={2}>
					<Icon iconNode={owl} className="size-7" />
				</MurphBadge>
				<MurphBadge level={3}>
					<Icon iconNode={owl} className="size-7" />
				</MurphBadge>
				<MurphBadge level={4}>
					<Icon iconNode={owl} className="size-7" />
				</MurphBadge>
			</div>

			<p>Run murph slower than X</p>
			<div className="flex">
				<MurphBadge level={1}>
					<Icon iconNode={pig} className="size-7" />
				</MurphBadge>
				<MurphBadge level={2}>
					<Icon iconNode={pig} className="size-7" />
				</MurphBadge>
				<MurphBadge level={3}>
					<Icon iconNode={pig} className="size-7" />
				</MurphBadge>
				<MurphBadge level={4}>
					<Icon iconNode={pig} className="size-7" />
				</MurphBadge>
			</div>

			<p>Complete x pushups</p>
			<div className="flex">
				<MurphBadge level={1}>
					<WormIcon className="size-7" />
				</MurphBadge>
				<MurphBadge level={2}>
					<WormIcon className="size-7" />
				</MurphBadge>
				<MurphBadge level={3}>
					<WormIcon className="size-7" />
				</MurphBadge>
				<MurphBadge level={4}>
					<WormIcon className="size-7" />
				</MurphBadge>
			</div>

			<p>Invite x people</p>
			<div className="flex">
				<MurphBadge level={1}>
					<MailIcon className="size-7" />
				</MurphBadge>
				<MurphBadge level={2}>
					<MailIcon className="size-7" />
				</MurphBadge>
				<MurphBadge level={3}>
					<MailIcon className="size-7" />
				</MurphBadge>
				<MurphBadge level={4}>
					<MailIcon className="size-7" />
				</MurphBadge>
			</div>
		</div>
	);
}
