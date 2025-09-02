import {
	Card,
	CardAction,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	BicepsFlexedIcon,
	CalendarIcon,
	TimerIcon,
	TrashIcon,
} from "lucide-react";
import { Icon as CustomIcons } from "@/components/icon";
import { cn, formatTimeDifference } from "@/lib/utils";
import { Murph, MurphMaybeWithUser } from "@/db/schema";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { format } from "date-fns";
import { Badge } from "./ui/badge";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { useSession } from "@/lib/auth-client";

function MurphTypeBadge({ type }: { type: Murph["murphType"] }) {
	switch (type) {
		case "INCOMPLETE":
			return <Badge variant="destructive">Incomplete</Badge>;
		case "QUARTER":
			return <Badge variant="default">Quarter</Badge>;
		case "HALF":
			return <Badge variant="accent">Half</Badge>;
		case "THREE_QUARTER":
			return <Badge variant="outline">3/4</Badge>;
		case "FULL":
			return <Badge variant="success">Full</Badge>;
		default:
			return <Badge>{type}</Badge>;
	}
}

export function MurphItem({ m }: { m: MurphMaybeWithUser }) {
	const { data: userData } = useSession();

	return (
		<Dialog>
			<DialogTrigger>
				<Card className="gap-2 p-4 cursor-pointer">
					{userData?.user.id !== m.user?.id && (
						<CardHeader className="px-0">
							<div className="flex items-center gap-2">
								<Avatar>
									<AvatarImage src={m.user?.image ?? ""} />
									<AvatarFallback>{m.user?.name.charAt(0)}</AvatarFallback>
								</Avatar>
								<CardTitle>{m.user?.name}</CardTitle>
							</div>
							<CardAction>
								<MurphTypeBadge type={m.murphType} />
							</CardAction>
						</CardHeader>
					)}

					<CardContent className="grid grid-cols-4 md:grid-cols-6 py-0 px-0">
						<Stat
							name="Run"
							value={m.firstRunDistance + m.secondRunDistance}
							icon={CustomIcons.Running}
							className="border-r"
						/>
						<Stat
							name="Pullups"
							value={m.pullups}
							icon={CustomIcons.Pullup}
							className="border-r"
						/>
						<Stat
							name="Pushups"
							value={m.pushups}
							icon={CustomIcons.Pushup}
							className="border-r"
						/>
						<Stat
							name="Squats"
							value={m.squats}
							icon={CustomIcons.Squat}
							className="md:border-r"
						/>
						<Stat
							className="hidden md:flex border-r"
							name="Time"
							value={formatTimeDifference(m.startTime, m.secondRunEndTime)}
							icon={TimerIcon}
						/>
						<Stat
							className="hidden md:flex"
							name="Date"
							value={format(m.startTime, "MMM dd")}
							icon={CalendarIcon}
						/>
					</CardContent>

					<CardFooter className="flex md:hidden items-center justify-between gap-2 px-0 flex-wrap">
						<div className="flex gap-2 items-center">
							<CalendarIcon className="size-4" />
							<p className="font-bold text-sm">
								{format(m.startTime, "MMM dd, yyyy")}
							</p>
						</div>

						<div className="flex gap-2 items-center">
							<TimerIcon className="size-4" />

							<p className="font-bold text-sm">
								{formatTimeDifference(m.startTime, m.secondRunEndTime)}
							</p>
						</div>
					</CardFooter>
				</Card>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Murph Workout Details</DialogTitle>
				</DialogHeader>

				<div className="grid grid-cols-2 gap-2">
					<div className="flex flex-col gap-1 items-center border-r">
						<TimerIcon className="size-8" />
						<p className="font-bold">
							{formatTimeDifference(m.startTime, m.secondRunEndTime)}
						</p>
						<p className="text-xs">Total Time</p>
					</div>

					<div className="flex flex-col gap-1 items-center">
						<CalendarIcon className="size-8" />
						<p className="font-bold">{format(m.startTime, "MMM dd, yyyy")}</p>
						<p className="text-xs">Total Time</p>
					</div>
				</div>

				<h3 className="font-bold">Split Times</h3>

				<div className="divide-y">
					<TimeSplit
						name="First run"
						value={formatTimeDifference(m.startTime, m.firstRunEndTime)}
						icon={CustomIcons.Running}
					/>

					<TimeSplit
						name="Exercises"
						value={formatTimeDifference(m.firstRunEndTime, m.exercisesEndTime)}
						icon={BicepsFlexedIcon}
					/>

					<TimeSplit
						name="Second run"
						value={formatTimeDifference(m.exercisesEndTime, m.secondRunEndTime)}
						icon={CustomIcons.Running}
					/>
				</div>

				<h3 className="font-bold">Workout</h3>

				<div className="grid grid-cols-2 *:p-2 *:odd:border-r *:border-b *:[&:nth-last-child(-n+2)]:border-b-0">
					<Stat
						name="First Run"
						icon={CustomIcons.Running}
						value={m.firstRunDistance}
					/>
					<Stat name="Pullups" icon={CustomIcons.Pullup} value={m.pullups} />
					<Stat name="Pushups" icon={CustomIcons.Pushup} value={m.pushups} />
					<Stat name="Squats" icon={CustomIcons.Squat} value={m.squats} />
					<Stat
						name="Second Run"
						icon={CustomIcons.Running}
						value={m.secondRunDistance}
					/>

					<div className="flex items-center justify-center">
						<MurphTypeBadge type={m.murphType} />
					</div>
				</div>

				{userData?.user.id === m.user?.id && (
					<Button variant="destructive" onClick={() => alert("todo")}>
						<TrashIcon /> Delete
					</Button>
				)}
			</DialogContent>
		</Dialog>
	);
}

function TimeSplit(props: {
	name: string;
	value: number | string;
	icon: React.ElementType;
}) {
	return (
		<div className="flex items-center justify-between py-1">
			<div className="flex items-center gap-2">
				<props.icon className="size-4" />
				<p>{props.name}</p>
			</div>
			<p className="font-bold">{props.value}</p>
		</div>
	);
}

function Stat(props: {
	name: string;
	value: number | string;
	icon: React.ElementType;
	className?: string;
}) {
	return (
		<div
			className={cn("flex flex-col gap-0 items-center pb-2", props.className)}
		>
			<props.icon className="size-4" />

			<p className="font-bold text-lg">{props.value}</p>

			<p className="text-xs">{props.name}</p>
		</div>
	);
}
