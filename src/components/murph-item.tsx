import { AvatarImage } from "@radix-ui/react-avatar";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { format } from "date-fns";
import { CalendarIcon, TimerIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { Icon as CustomIcons } from "@/components/icon";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
	Card,
	CardAction,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import type { Murph, MurphMaybeWithUser } from "@/db/schema";
import { deleteMurphServerFn } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { cn, formatTimeDifference } from "@/lib/utils";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

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

export function MurphItem({
	m,
	showUser = false,
}: {
	m: MurphMaybeWithUser;
	showUser?: boolean;
}) {
	const { data: userData } = useSession();
	const router = useRouter();
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const deleteMurph = useServerFn(deleteMurphServerFn);
	const { mutate: handleDelete, isPending: isDeleting } = useMutation({
		mutationFn: () => deleteMurph({ data: { murphId: m.id } }),
		onSuccess: () => {
			// Close the dialog and refresh the current route to update the data
			setIsDialogOpen(false);
			router.invalidate();
		},
	});

	return (
		<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
			<DialogTrigger>
				<Card className={cn("gap-4 p-4 cursor-pointer")}>
					{showUser && (
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
							unit=" mi"
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

					<CardFooter className="flex md:hidden items-center justify-around gap-2 px-0 flex-wrap">
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
						icon={CustomIcons.Pullup}
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
						unit=" mi"
					/>
					<Stat name="Pullups" icon={CustomIcons.Pullup} value={m.pullups} />
					<Stat name="Pushups" icon={CustomIcons.Pushup} value={m.pushups} />
					<Stat name="Squats" icon={CustomIcons.Squat} value={m.squats} />
					<Stat
						name="Second Run"
						icon={CustomIcons.Running}
						value={m.secondRunDistance}
						unit=" mi"
					/>

					<div className="flex items-center justify-center">
						<MurphTypeBadge type={m.murphType} />
					</div>
				</div>

				{userData?.user.id === m.user?.id && (
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<Button variant="destructive" disabled={isDeleting}>
								<TrashIcon /> {isDeleting ? "Deleting..." : "Delete"}
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
								<AlertDialogDescription>
									This action cannot be undone. This will permanently delete
									your murph workout from the system.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<AlertDialogAction onClick={() => handleDelete()}>
									Delete Murph
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
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
	unit?: string;
}) {
	return (
		<div className={cn("flex flex-col gap-0 items-center", props.className)}>
			<props.icon className="size-4" />

			<p className="font-bold text-lg">
				{props.value}
				{props.unit}
			</p>

			<p className="text-xs">{props.name}</p>
		</div>
	);
}
