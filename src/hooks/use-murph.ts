import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useCallback, useEffect, useMemo } from "react";
import type { NewMurph } from "@/db/schema";
import { addMurphServerFn } from "@/lib/api";
import { clamp, toMilliseconds } from "@/lib/utils";
import { useLocalStorage } from "./use-local-storage";
import { useStopwatch } from "./use-stopwatch";

type NullableFields<T, K extends keyof T> = {
	[P in keyof T]: P extends K ? T[P] | null : T[P];
};

type RunDistance = 0 | 0.25 | 0.5 | 0.75 | 1;

export type MurphStage =
	| "not_started"
	| "first_run"
	| "exercises"
	| "second_run"
	| "completed";

type MurphState = Omit<
	NullableFields<
		NewMurph,
		"startTime" | "firstRunEndTime" | "exercisesEndTime" | "secondRunEndTime"
	>,
	"userId" | "murphType" | "duration"
>;

const INITIAL_MURPH: MurphState = {
	startTime: null,

	firstRunDistance: 0,
	firstRunEndTime: null,

	pullups: 0,
	pushups: 0,
	squats: 0,
	exercisesEndTime: null,

	secondRunDistance: 0,
	secondRunEndTime: null,
};

const MAX_REPS = {
	pullups: 100,
	pushups: 200,
	squats: 300,
} as const;

// Type for raw data from localStorage (dates are strings)
type RawMurphState = Omit<MurphState, "startTime" | "firstRunEndTime" | "exercisesEndTime" | "secondRunEndTime"> & {
	startTime: string | null;
	firstRunEndTime: string | null;
	exercisesEndTime: string | null;
	secondRunEndTime: string | null;
};

// Helper function to deserialize dates from localStorage
function deserializeMurphState(data: RawMurphState | null): MurphState {
	if (!data) return INITIAL_MURPH;
	
	return {
		...data,
		startTime: data.startTime ? new Date(data.startTime) : null,
		firstRunEndTime: data.firstRunEndTime ? new Date(data.firstRunEndTime) : null,
		exercisesEndTime: data.exercisesEndTime ? new Date(data.exercisesEndTime) : null,
		secondRunEndTime: data.secondRunEndTime ? new Date(data.secondRunEndTime) : null,
	};
}

// Helper function to serialize dates for localStorage
function serializeMurphState(data: MurphState): RawMurphState {
	return {
		...data,
		startTime: data.startTime ? data.startTime.toISOString() : null,
		firstRunEndTime: data.firstRunEndTime ? data.firstRunEndTime.toISOString() : null,
		exercisesEndTime: data.exercisesEndTime ? data.exercisesEndTime.toISOString() : null,
		secondRunEndTime: data.secondRunEndTime ? data.secondRunEndTime.toISOString() : null,
	};
}

// Helper function to format time (same as in useStopwatch)
function formatTime(milliseconds: number): string {
	const hours = Math.floor(milliseconds / 3600000)
		.toString()
		.padStart(2, "0");
	const minutes = Math.floor((milliseconds % 3600000) / 60000)
		.toString()
		.padStart(2, "0");
	const seconds = Math.floor((milliseconds % 60000) / 1000)
		.toString()
		.padStart(2, "0");
	const ms = (milliseconds % 1000).toString().padStart(3, "0");
	return `${hours}:${minutes}:${seconds}.${ms}`;
}

export function useMurph() {
	const [rawMurph, setRawMurph] = useLocalStorage<RawMurphState | null>(
		"murph-state",
		null
	);
	
	// Track if murph has been saved to prevent duplicates
	const [hasBeenSaved, setHasBeenSaved] = useLocalStorage<boolean>(
		"murph-saved",
		false
	);
	
	// Deserialize dates on every render
	const murph = useMemo(() => deserializeMurphState(rawMurph), [rawMurph]);
	
	const setMurph = useCallback((value: MurphState | ((prev: MurphState) => MurphState)) => {
		const newValue = typeof value === 'function' ? value(murph) : value;
		setRawMurph(serializeMurphState(newValue));
	}, [murph, setRawMurph]);

	// Calculate current stage early so we can use it in stopwatch
	const currentStage = useMemo((): MurphStage => {
		if (murph.startTime === null) return "not_started";
		if (murph.firstRunEndTime === null) return "first_run";
		if (murph.exercisesEndTime === null) return "exercises";
		if (murph.secondRunEndTime === null) return "second_run";
		return "completed";
	}, [
		murph.startTime,
		murph.firstRunEndTime,
		murph.exercisesEndTime,
		murph.secondRunEndTime,
	]);

	// Calculate final elapsed time for completed murph
	const finalElapsedTime = useMemo(() => {
		if (currentStage === "completed" && murph.startTime && murph.secondRunEndTime) {
			return murph.secondRunEndTime.getTime() - murph.startTime.getTime();
		}
		return 0;
	}, [currentStage, murph.startTime, murph.secondRunEndTime]);

	const {
		elapsed: stopwatchElapsed,
		formatted: stopwatchFormatted,
		isRunning: stopwatchRunning,
		start: startTimer,
		reset: resetTimer,
		stop: stopTimer,
	} = useStopwatch(currentStage === "completed" ? null : murph.startTime);

	// Use final elapsed time for completed murph, otherwise use stopwatch
	const elapsed = currentStage === "completed" ? finalElapsedTime : stopwatchElapsed;
	const formattedTime = currentStage === "completed" 
		? formatTime(finalElapsedTime) 
		: stopwatchFormatted;
	const started = currentStage === "completed" ? false : stopwatchRunning;

	const logMurph = useServerFn(addMurphServerFn);
	const {
		mutate,
		isPending: isSaving,
		isSuccess: isSaveSuccess,
	} = useMutation({
		mutationFn: () => logMurph({ data: murph as NewMurph }),
	});

	const start = useCallback(() => {
		startTimer();
		setMurph((prev) => ({ ...prev, startTime: new Date() }));
		setHasBeenSaved(false);
	}, [startTimer, setMurph, setHasBeenSaved]);

	const finishFirstRun = useCallback((distance: RunDistance) => {
		setMurph((prev) => ({
			...prev,
			firstRunDistance: distance,
			firstRunEndTime: new Date(),
		}));
	}, [setMurph]);

	const finishSecondRun = useCallback(
		(distance: RunDistance) => {
			stopTimer();
			setMurph((prev) => ({
				...prev,
				secondRunDistance: distance,
				secondRunEndTime: new Date(),
			}));
		},
		[stopTimer, setMurph],
	);

	const reset = useCallback(() => {
		resetTimer();
		setMurph(INITIAL_MURPH);
		setHasBeenSaved(false);
	}, [resetTimer, setMurph, setHasBeenSaved]);

	const isBefore = useCallback(
		(minutes: number, seconds?: number) => {
			return elapsed < toMilliseconds(minutes, seconds);
		},
		[elapsed],
	);

	const addReps = useCallback(
		(exercise: keyof typeof MAX_REPS, repsToAdd: number) => {
			setMurph((prev) => ({
				...prev,
				[exercise]: clamp(prev[exercise] + repsToAdd, 0, MAX_REPS[exercise]),
			}));
		},
		[setMurph],
	);

	const save = useCallback(async () => {
		await mutate();
		setHasBeenSaved(true);
	}, [mutate, setHasBeenSaved]);

	const completeExercises = useCallback(() => {
		setMurph((prev) => ({
			...prev,
			exercisesEndTime: new Date(),
		}));
	}, [setMurph]);

	const exercisesCompleted = useMemo(() => {
		return (
			murph.pullups >= MAX_REPS.pullups &&
			murph.pushups >= MAX_REPS.pushups &&
			murph.squats >= MAX_REPS.squats
		);
	}, [murph.pullups, murph.pushups, murph.squats]);

	// Utility functions for stage checking
	const compareStage = useCallback(
		(stage: MurphStage, comparison: "before" | "after" | "at") => {
			const stageOrder: MurphStage[] = [
				"not_started",
				"first_run",
				"exercises",
				"second_run",
				"completed",
			];
			const currentIndex = stageOrder.indexOf(currentStage);
			const targetIndex = stageOrder.indexOf(stage);

			switch (comparison) {
				case "before":
					return currentIndex < targetIndex;
				case "after":
					return currentIndex > targetIndex;
				case "at":
					return currentIndex === targetIndex;
				default:
					return false;
			}
		},
		[currentStage],
	);

	// Convenience functions for backward compatibility
	const isBeforeStage = useCallback(
		(stage: MurphStage) => compareStage(stage, "before"),
		[compareStage],
	);

	const isAfterStage = useCallback(
		(stage: MurphStage) => compareStage(stage, "after"),
		[compareStage],
	);

	const isAtStage = useCallback(
		(stage: MurphStage) => compareStage(stage, "at"),
		[compareStage],
	);

	// Stop timer when murph is completed
	useEffect(() => {
		if (currentStage === "completed") {
			stopTimer();
		}
	}, [currentStage, stopTimer]);

	// Auto-save when workout is completed
	useEffect(() => {
		if (currentStage === "completed" && !isSaving && !hasBeenSaved) {
			save();
		}
	}, [currentStage, isSaving, hasBeenSaved, save]);

	return {
		// State
		murph,
		started,
		formattedTime,
		isSaving,
		currentStage,
		isSaveSuccess: hasBeenSaved || isSaveSuccess,

		// Actions
		start,
		finishFirstRun,
		finishSecondRun,
		reset,
		addReps,
		save,
		completeExercises,

		// Utilities
		isBefore,
		isBeforeStage,
		isAfterStage,
		isAtStage,
		MAX_REPS,
		exercisesCompleted,
	};
}
