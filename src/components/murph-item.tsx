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
		<Card className="p-2 gap-0">
			{m.userName && (
				<CardHeader className="flex items-center gap-2 p-2">
					<Avatar>
						{/*
                <AvatarImage src="https://github.com/shadcn.png" />
                  */}
						<AvatarFallback>{m.userName?.charAt(0) ?? "Anon"}</AvatarFallback>
					</Avatar>
					<CardTitle>{m.userName ?? "Me"}</CardTitle>
				</CardHeader>
			)}
			<CardContent className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 p-2">
				<div className="flex flex-col gap-1">
					<div className="flex items-center gap-1.5">
						<CustomIcons.Running className="size-4" />
						<p>{m.firstRunDistance} mi</p>
					</div>
					<p>First Run</p>
				</div>

				<div className="flex flex-col gap-1">
					<div className="flex items-center gap-1.5">
						<CustomIcons.Pullup className="size-4" />
						<p>{m.pullups}</p>
					</div>
					<p>Pullups</p>
				</div>

				<div className="flex flex-col gap-1">
					<div className="flex items-center gap-1.5">
						<CustomIcons.Pushup className="size-4" />
						<p>{m.pushups}</p>
					</div>
					<p>Pushups</p>
				</div>

				<div className="flex flex-col gap-1">
					<div className="flex items-center gap-1.5">
						<CustomIcons.Squat className="size-4" />
						<p>{m.squats}</p>
					</div>
					<p>Squats</p>
				</div>

				<div className="flex flex-col gap-1">
					<div className="flex items-center gap-1.5">
						<CustomIcons.Running className="size-4" />
						{m.secondRunDistance} mi
					</div>
					<p>Second Run</p>
				</div>

				<div className="flex flex-col md:items-end gap-1">
					<div className="flex items-center gap-1.5">
						<TimerIcon className="size-4" />
						<p>{formatTimeDifference(m.startTime, m.secondRunEndTime)}</p>
					</div>
					<MurphTypeBadge type={m.murphType} />
					<p>
						{new Intl.DateTimeFormat("en-US").format(new Date(m.startTime))}
					</p>
				</div>
			</CardContent>
		</Card>
	);
}
