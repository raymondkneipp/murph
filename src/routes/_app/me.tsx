import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { db } from "@/db";
import { Murph, murphsTable } from "@/db/schema";
import { Card, CardContent } from "@/components/ui/card";
import { useMemo } from "react";
import {
	AwardIcon,
	BabyIcon,
	BicepsFlexedIcon,
	CatIcon,
	CrownIcon,
	FlameIcon,
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

const getUserMurphs = createServerFn({ method: "GET" }).handler(async () => {
	return db.select().from(murphsTable);
});

export const Route = createFileRoute("/_app/me")({
	component: RouteComponent,
	loader: async () => await getUserMurphs(),
});

function murphMetrics(murphs: Murph[]) {
	return {
		totalPullups: murphs.reduce((prev, cur) => prev + cur.pullups, 0),
		totalPushups: murphs.reduce((prev, cur) => prev + cur.pushups, 0),
		totalSquats: murphs.reduce((prev, cur) => prev + cur.squats, 0),
		totalMurphs: murphs.length,
	};
}

function RouteComponent() {
	let murphs = Route.useLoaderData();

	const { totalPullups, totalPushups, totalSquats, totalMurphs } = useMemo(
		() => murphMetrics(murphs),
		[murphs],
	);

	return (
		<div className="flex flex-col gap-4">
			<h1 className="font-bold text-3xl">My Profile</h1>

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

			<Card>
				<CardContent className="grid grid-cols-4">
					<div className="flex flex-col items-center">
						<p className="text-3xl font-bold">{totalPullups}</p>
						<h2>Total Pullups</h2>
					</div>
					<div className="flex flex-col items-center">
						<p className="text-3xl font-bold">{totalPushups}</p>
						<h2>Total Pushups</h2>
					</div>
					<div className="flex flex-col items-center">
						<p className="text-3xl font-bold">{totalSquats}</p>
						<h2>Total Squats</h2>
					</div>
					<div className="flex flex-col items-center">
						<p className="text-3xl font-bold">{totalMurphs}</p>
						<h2>Total Murphs</h2>
					</div>
				</CardContent>
			</Card>

			{murphs.map((m) => (
				<Card>
					<CardContent>
						<pre>{JSON.stringify(m, null, 2)}</pre>
					</CardContent>
				</Card>
			))}
		</div>
	);
}
