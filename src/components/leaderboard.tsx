import { useQuery } from "@tanstack/react-query";
import { createServerFn, useServerFn } from "@tanstack/react-start";
import { endOfMonth, format } from "date-fns";
import { eq, getTableColumns } from "drizzle-orm";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import z from "zod";
import { db } from "@/db";
import { murphsTable, user } from "@/db/schema";
import { cn } from "@/lib/utils";
import { MurphItem } from "./murph-item";
import { Button } from "./ui/button";
import { MonthPicker } from "./ui/monthpicker";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

const getLeaderBoardServerFn = createServerFn({ method: "GET" })
	.validator(
		z.object({
			date: z.date(),
		}),
	)
	.handler(async ({ data }) => {
		const [{ date: earliestMurph }] = await db
			.select({
				date: murphsTable.startTime,
			})
			.from(murphsTable)
			.orderBy(murphsTable.startTime)
			.limit(1);

		const topTen = await db
			.select({
				...getTableColumns(murphsTable),
				userId: user.id,
				userName: user.name,
			})
			.from(murphsTable)
			.orderBy(murphsTable.duration) // shortest first
			.where(eq(murphsTable.murphType, "Full Murph"))
			.innerJoin(user, eq(murphsTable.userId, user.id))
			.limit(3);

		return {
			earliestMurph,
			topTen,
		};
	});

export function Leaderboard() {
	const [date, setDate] = useState<Date>(new Date());

	const getLeaderBoard = useServerFn(getLeaderBoardServerFn);

	const boardQuery = useQuery({
		queryKey: ["time"],
		queryFn: () => getLeaderBoard({ data: { date: date } }),
	});

	return (
		<section className="container py-8 flex flex-col gap-4">
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
						minDate={boardQuery.data?.earliestMurph}
					/>
				</PopoverContent>
			</Popover>

			{boardQuery.data?.topTen.map((m) => (
				<MurphItem m={m} key={m.id} />
			))}
		</section>
	);
}
