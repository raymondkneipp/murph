import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TimerIcon } from "lucide-react";
import { Icon as CustomIcons } from "@/components/icon";
import { formatTimeDifference } from "@/lib/utils";
import { Badge } from "./ui/badge";
import { Murph, MurphMaybeWithUser } from "@/db/schema";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";

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
	return (
		<Card className="p-2 gap-0">
			{m?.user?.name && (
				<CardHeader className="flex items-center gap-2 p-2">
					<Avatar>
						<AvatarImage src={m.user.image ?? ""} />
						<AvatarFallback>{m.user.name.charAt(0)}</AvatarFallback>
					</Avatar>
					<CardTitle>{m.user.name}</CardTitle>
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
