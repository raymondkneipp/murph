import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Murph } from "@/db/schema";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function clamp(num: number, lower: number, upper: number) {
	return Math.min(Math.max(num, lower), upper);
}

export function toMilliseconds(minutes: number, seconds: number = 0): number {
	return minutes * 60_000 + seconds * 1_000;
}

export const formatTimeDifference = (
	startTime: Date,
	endTime: Date,
): string => {
	const diffMs = endTime.getTime() - startTime.getTime();
	const diffSeconds = Math.floor(diffMs / 1000);
	const hours = Math.floor(diffSeconds / 3600);
	const minutes = Math.floor((diffSeconds % 3600) / 60);
	const seconds = diffSeconds % 60;

	const minutesStr =
		hours > 0 ? minutes.toString().padStart(2, "0") : minutes.toString();

	return `${hours > 0 ? hours.toString().padStart(2, "0") + ":" : ""}${minutesStr}:${seconds.toString().padStart(2, "0")}`;
};

export function formatNumber(num: number) {
	return new Intl.NumberFormat("en-US").format(num);
}

export function murphMetrics(murphs: Murph[]) {
	const fullMurphs = murphs.filter((m) => m.murphType === "FULL");

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
				case "QUARTER":
					x = 0.25;
					break;
				case "HALF":
					x = 0.5;
					break;
				case "THREE_QUARTER":
					x = 0.75;
					break;
				case "FULL":
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
