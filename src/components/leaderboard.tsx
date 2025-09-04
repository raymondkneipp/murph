import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { endOfMonth, format } from "date-fns";
import { CalendarIcon, FrownIcon } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { MurphItem } from "./murph-item";
import { Button } from "./ui/button";
import { MonthPicker } from "./ui/monthpicker";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { getLeaderBoardServerFn } from "@/lib/api";

export function Leaderboard() {
	const [date, setDate] = useState<Date>(new Date());

	const getLeaderBoard = useServerFn(getLeaderBoardServerFn);

	const boardQuery = useQuery({
		queryKey: ["Leaderboard", format(date, "yyyy-MM")],
		queryFn: () => getLeaderBoard({ data: { date: date } }),
	});

	return (
		<section className="flex flex-col gap-4">
			<h1 className="font-bold text-3xl">Leaderboard</h1>
			<Popover>
				<PopoverTrigger asChild>
					<Button
						variant={"outline"}
						className={cn(
							"w-[280px] justify-start text-left font-normal",
							!date && "text-muted-foreground",
						)}
					>
						<CalendarIcon className="mr-2 h-4 w-4" />
						{date ? format(date, "MMMM yyyy") : <span>Pick a month</span>}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-auto p-0">
					<MonthPicker
						onMonthSelect={setDate}
						selectedMonth={date}
						maxDate={endOfMonth(new Date())}
						minDate={boardQuery.data?.earliestMurph?.startTime ?? new Date()}
					/>
				</PopoverContent>
			</Popover>

			{!boardQuery.data?.topTen.length && (
				<div className="border border-dashed p-16 rounded-xl flex flex-col items-center text-center gap-4">
					<FrownIcon className="size-10" />
					<p>No murphs found for this month.</p>
				</div>
			)}

			{boardQuery.data?.topTen.map((m) => (
				<MurphItem m={m} key={m.id} />
			))}
		</section>
	);
}
