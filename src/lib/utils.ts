import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function clamp(num: number, lower: number, upper: number) {
	return Math.min(Math.max(num, lower), upper);
}

export function toMilliseconds(minutes: number, seconds: number = 0): number {
	return minutes * 60_000 + seconds * 1_000;
}

// Helper function to format time difference in HH:MM:SS
export const formatTimeDifference = (
	startTime: Date,
	endTime: Date,
): string => {
	const diffMs = endTime.getTime() - startTime.getTime();
	const diffSeconds = Math.floor(diffMs / 1000);
	const hours = Math.floor(diffSeconds / 3600);
	const minutes = Math.floor((diffSeconds % 3600) / 60);
	const seconds = diffSeconds % 60;

	return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};

export function formatNumber(num: number) {
	return new Intl.NumberFormat("en-US").format(num);
}
