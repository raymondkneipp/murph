import { useMutation } from "@tanstack/react-query";
import { redirect } from "@tanstack/react-router";
import { createServerFn, useServerFn } from "@tanstack/react-start";
import { useCallback, useEffect, useMemo, useState } from "react";
import z from "zod";
import { db } from "@/db";
import type { NewMurph } from "@/db/schema";
import { murphsTable } from "@/db/schema";
import { authMiddleware } from "@/lib/auth-middleware";
import { clamp, toMilliseconds } from "@/lib/utils";
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
	"userId" | "murphType"
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

const addMurph = createServerFn({ method: "POST" })
	.validator(
		z.object({
			startTime: z.date(),

			firstRunDistance: z.number(),
			firstRunEndTime: z.date(),

			pullups: z.number(),
			pushups: z.number(),
			squats: z.number(),
			exercisesEndTime: z.date(),

			secondRunDistance: z.number(),
			secondRunEndTime: z.date(),
		}),
	)
	.middleware([authMiddleware])
	.handler(async ({ data, context }) => {
		const { user } = context;

		if (!user.id) {
			throw redirect({ to: "/login" });
		}

		return db
			.insert(murphsTable)
			.values({ ...data, userId: user.id })
			.returning();
	});

export function useMurph() {
	const [murph, setMurph] = useState<MurphState>(INITIAL_MURPH);

	const {
		elapsed,
		formatted: formattedTime,
		isRunning: started,
		start: startTimer,
		reset: resetTimer,
		stop: stopTimer,
	} = useStopwatch();

	const logMurph = useServerFn(addMurph);
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
	}, [startTimer]);

	const finishFirstRun = useCallback((distance: RunDistance) => {
		setMurph((prev) => ({
			...prev,
			firstRunDistance: distance,
			firstRunEndTime: new Date(),
		}));
	}, []);

	const finishSecondRun = useCallback(
		(distance: RunDistance) => {
			stopTimer();
			setMurph((prev) => ({
				...prev,
				secondRunDistance: distance,
				secondRunEndTime: new Date(),
			}));
		},
		[stopTimer],
	);

	const reset = useCallback(() => {
		resetTimer();
		setMurph(INITIAL_MURPH);
	}, [resetTimer]);

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
		[],
	);

	const save = useCallback(async () => {
		await mutate();
	}, [mutate, resetTimer]);

	const completeExercises = useCallback(() => {
		setMurph((prev) => ({
			...prev,
			exercisesEndTime: new Date(),
		}));
	}, []);

	const exercisesCompleted = useMemo(() => {
		return (
			murph.pullups >= MAX_REPS.pullups &&
			murph.pushups >= MAX_REPS.pushups &&
			murph.squats >= MAX_REPS.squats
		);
	}, [murph.pullups, murph.pushups, murph.squats]);

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

	// Auto-save when workout is completed
	useEffect(() => {
		if (currentStage === "completed" && !isSaving) {
			save();
		}
	}, [currentStage]);

	return {
		// State
		murph,
		started,
		formattedTime,
		isSaving,
		currentStage,
		isSaveSuccess,

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
