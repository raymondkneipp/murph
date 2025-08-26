import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TimerIcon } from "lucide-react";
import { Icon as CustomIcons } from "@/components/icon";
import { formatTimeDifference } from "@/lib/utils";
import { Badge } from "./ui/badge";
import { Murph } from "@/db/schema";
import { Avatar, AvatarFallback } from "./ui/avatar";

function MurphTypeBadge({ type }: { type: string | null }) {
	switch (type) {
		case "Incomplete":
			return <Badge variant="destructive">{type}</Badge>;
		case "1/4 Murph":
			return <Badge variant="default">{type}</Badge>;
		case "1/2 Murph":
			return <Badge variant="accent">{type}</Badge>;
		case "3/4 Murph":
			return <Badge variant="outline">{type}</Badge>;
		case "Full Murph":
			return <Badge variant="success">{type}</Badge>;
		default:
			return <Badge>{type}</Badge>;
	}
}

export function MurphItem({
	m,
}: {
	m: Murph & {
		userId?: string | null;
		userName?: string | null;
	};
}) {
	return (
		<Card>
			{m.userName && (
				<CardHeader className="flex items-center gap-2">
					<Avatar>
						{/*
                <AvatarImage src="https://github.com/shadcn.png" />
                  */}
						<AvatarFallback>{m.userName?.charAt(0) ?? "Anon"}</AvatarFallback>
					</Avatar>
					<CardTitle>{m.userName ?? "Me"}</CardTitle>
				</CardHeader>
			)}
			<CardContent className="flex flex-col md:flex-row md:items-center justify-between gap-2">
				<div className="flex flex-col gap-1">
					<div className="flex items-center gap-1.5">
						<CustomIcons.Running className="size-4" />
						{m.firstRunDistance}
					</div>
					<p>{formatTimeDifference(m.startTime, m.firstRunEndTime)}</p>
				</div>
				<div className="flex flex-col gap-1">
					<div className="flex gap-2">
						<div className="flex items-center gap-1.5">
							<CustomIcons.Pullup className="size-4" />
							{m.pullups}
						</div>

						<div className="flex items-center gap-1.5">
							<CustomIcons.Pushup className="size-4" />
							{m.pushups}
						</div>

						<div className="flex items-center gap-1.5">
							<CustomIcons.Squat className="size-4" />
							{m.squats}
						</div>
					</div>

					<p>{formatTimeDifference(m.firstRunEndTime, m.exercisesEndTime)}</p>
				</div>
				<div className="flex flex-col gap-1">
					<div className="flex items-center gap-1.5">
						<CustomIcons.Running className="size-4" />
						{m.secondRunDistance}
					</div>
					<p>{formatTimeDifference(m.exercisesEndTime, m.secondRunEndTime)}</p>
				</div>

				<p className="text-sm">{m.murphType}</p>
				<MurphTypeBadge type={m.murphType} />

				<div className="flex flex-col gap-1">
					<div className="flex items-center gap-1.5">
						<TimerIcon className="size-4" />
						Total Time
					</div>
					<p>{formatTimeDifference(m.startTime, m.secondRunEndTime)}</p>
				</div>
			</CardContent>
		</Card>
	);
}
