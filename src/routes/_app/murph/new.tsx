import { createFileRoute } from "@tanstack/react-router";
import {
	LoaderIcon,
	MinusIcon,
	PlayIcon,
	PlusIcon,
	TimerResetIcon,
} from "lucide-react";
import { useState } from "react";
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
import { Button } from "@/components/ui/button";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { SegmentedProgress } from "@/components/ui/segmented-progress";
import { useMurph } from "@/hooks/use-murph";
import { cn, formatTimeDifference } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_app/murph/new")({
	component: RouteComponent,
});

// Constants
const COMMON_FACTORS = [100, 50, 25, 20, 10, 5, 4, 2, 1];

type RunDistance = 0 | 0.25 | 0.5 | 0.75 | 1;

function RouteComponent() {
	// Pagination state and logic
	const [currentRepPage, setCurrentRepPage] = useState(0);

	const totalPages = Math.ceil(COMMON_FACTORS.length / 3);
	const canGoLeft = currentRepPage > 0;
	const canGoRight = currentRepPage < totalPages - 1;

	// Get current page of rep values (3 at a time) for a specific exercise
	const getCurrentRepValues = (maxReps: number) => {
		const repValues = COMMON_FACTORS.map((factor) => maxReps / factor);
		const startIndex = currentRepPage * 3;
		return repValues.slice(startIndex, startIndex + 3);
	};

	const handleRepPageChange = (direction: "left" | "right") => {
		if (direction === "left" && canGoLeft) {
			setCurrentRepPage((prev) => prev - 1);
		} else if (direction === "right" && canGoRight) {
			setCurrentRepPage((prev) => prev + 1);
		}
	};

	// Main component logic
	const {
		murph: murphState,
		started,
		formattedTime,
		start,
		finishFirstRun,
		finishSecondRun,
		addReps,
		reset,
		isSaveSuccess,
		isSaving,
		MAX_REPS,
		completeExercises,
		exercisesCompleted,
		isAtStage,
		isAfterStage,
	} = useMurph();

	// Time checking functions for run distance restrictions
	// Helper function to check if enough time has passed for a run distance
	const isBefore = (minutes: number, seconds?: number) => {
		const elapsed = Date.now() - (murphState.startTime?.getTime() || 0);
		const requiredTime = (minutes * 60 + (seconds || 0)) * 1000;
		return elapsed < requiredTime;
	};

	// Helper function to check if enough time has passed for second run
	const isBeforeSecondRun = (minutes: number, seconds?: number) => {
		if (!murphState.exercisesEndTime) return false;
		const elapsed = Date.now() - murphState.exercisesEndTime.getTime();
		const requiredTime = (minutes * 60 + (seconds || 0)) * 1000;
		return elapsed < requiredTime;
	};

	// Constants for run distances with time requirements
	// Time requirements are the same for both runs, but calculated from different start times
	const RUN_DISTANCES = [
		{ distance: 0.25, minutes: 0, seconds: 40 }, // 40 seconds
		{ distance: 0.5, minutes: 1, seconds: 40 }, // 1:40
		{ distance: 0.75, minutes: 3, seconds: 0 }, // 3:00
		{ distance: 1, minutes: 3, seconds: 43 }, // 3:43
	] as const;

	// Helper Functions
	/**
	 * Renders buttons for selecting run distance with time-based disabling
	 * This function is reusable for both first and second runs:
	 * - First run: Time calculated from workout start
	 * - Second run: Time calculated from exercises completion
	 * Both runs can be skipped
	 * @param onDistanceSelect - Function to call when a distance is selected
	 * @param timeChecker - Function to check if enough time has passed for each distance
	 * @returns JSX element for run distance selection
	 */
	const renderRunDistanceButtons = (
		onDistanceSelect: (distance: RunDistance) => void,
		timeChecker: (minutes: number, seconds?: number) => boolean,
	) => (
		<div className="grid grid-cols-4 gap-2">
			{RUN_DISTANCES.map(({ distance, minutes, seconds }) => (
				<Button
					key={distance}
					variant={distance !== 1 ? "outline" : "default"}
					size="lg"
					onClick={() => onDistanceSelect(distance)}
					disabled={timeChecker(minutes, seconds)}
				>
					{distance} mi
				</Button>
			))}

			<AlertDialog>
				<AlertDialogTrigger asChild>
					<Button className="col-span-full mr-auto mt-2" variant="ghost">
						Skip Run
					</Button>
				</AlertDialogTrigger>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
						<AlertDialogDescription>
							You will get credit for any reps completed but this attempt will
							not count as a Murph.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={() => onDistanceSelect(0)}>
							Skip
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);

	/**
	 * Renders an exercise section with progress bars and rep buttons
	 * @param exercise - The exercise type (pullups, pushups, or squats)
	 * @returns JSX element for the exercise section
	 */
	const renderExerciseSection = (exercise: keyof typeof MAX_REPS) => {
		const maxReps = MAX_REPS[exercise];

		return (
			<div key={exercise} className="flex flex-col gap-2">
				<div className="flex items-center justify-between">
					<h2 className="font-bold text-lg capitalize">{exercise}</h2>
					<p className="text-xs">
						<span className="text-xl font-bold">{murphState[exercise]}</span> /{" "}
						{maxReps}
					</p>
				</div>

				<SegmentedProgress
					current={murphState[exercise]}
					max={maxReps}
					segments={4}
				/>

				<div className="grid grid-cols-3 gap-1 justify-center">
					{getCurrentRepValues(maxReps).map((reps) => (
						<Button
							key={`${exercise}-${reps}`}
							variant="outline"
							size="lg"
							onClick={() => addReps(exercise, reps)}
						>
							<PlusIcon />
							{reps}
						</Button>
					))}
				</div>
			</div>
		);
	};

	/**
	 * Renders navigation controls for paginating through rep values
	 * @returns JSX element for navigation controls
	 */
	const renderNavigationControls = () => (
		<div className="flex items-center justify-center gap-4">
			<Button
				variant="outline"
				size="icon"
				onClick={() => handleRepPageChange("left")}
				disabled={!canGoLeft}
			>
				<MinusIcon className="size-4" />
			</Button>

			<div className="flex gap-1">
				{Array.from({ length: totalPages }, (_, i) => (
					<div
						key={`page-${i}-${totalPages}`}
						className={cn(
							"size-3 rounded-full transition-all duration-200 border",
							i === currentRepPage
								? "bg-primary border-primary"
								: "bg-muted border-border",
						)}
					/>
				))}
			</div>

			<Button
				variant="outline"
				size="icon"
				onClick={() => handleRepPageChange("right")}
				disabled={!canGoRight}
			>
				<PlusIcon className="size-4" />
			</Button>
		</div>
	);

	return (
		<div className="flex flex-col gap-4">
			<h1 className="font-bold text-3xl">New Murph</h1>

			<p className="font-bold font-mono text-5xl mb-4">{formattedTime}</p>

			{isAtStage("not_started") && (
				<Button size="lg" onClick={() => start()} className="lg:max-w-48">
					<PlayIcon />
					Start Murph
				</Button>
			)}

			<Card
				className={
					isAtStage("first_run")
						? "border-primary drop-shadow-xl drop-shadow-primary/50"
						: ""
				}
			>
				<CardHeader>
					<CardTitle>First Run</CardTitle>
					<CardDescription>
						{murphState.firstRunDistance ?? "1"} Mile
					</CardDescription>

					{isAfterStage("first_run") && (
						<CardAction className="flex flex-col items-end">
							{murphState.firstRunEndTime && murphState.startTime && (
								<p className="text-center text-sm">
									{formatTimeDifference(
										murphState.startTime,
										murphState.firstRunEndTime,
									)}
								</p>
							)}
						</CardAction>
					)}
				</CardHeader>

				{isAtStage("first_run") && (
					<CardContent>
						{renderRunDistanceButtons(finishFirstRun, isBefore)}
					</CardContent>
				)}
			</Card>

			<Card
				className={
					isAtStage("exercises")
						? "border-primary drop-shadow-xl drop-shadow-primary/50"
						: ""
				}
			>
				<CardHeader>
					<CardTitle>Exercises</CardTitle>
					<CardDescription>
						{murphState.exercisesEndTime
							? `${murphState.pullups} pullups, ${murphState.pushups} pushups, ${murphState.squats} squats`
							: "100 pullups, 200 pushups, 300 squats"}
					</CardDescription>

					{isAfterStage("exercises") && (
						<CardAction className="flex flex-col items-end">
							{murphState.exercisesEndTime && murphState.firstRunEndTime && (
								<p className="text-center text-sm">
									{formatTimeDifference(
										murphState.firstRunEndTime,
										murphState.exercisesEndTime,
									)}
								</p>
							)}
						</CardAction>
					)}
				</CardHeader>

				{isAtStage("exercises") && (
					<CardContent>
						{(Object.keys(MAX_REPS) as Array<keyof typeof MAX_REPS>).map(
							renderExerciseSection,
						)}

						<div className="flex items-center justify-between mt-4">
							{renderNavigationControls()}

							<Button
								onClick={() => completeExercises()}
								variant={exercisesCompleted ? "default" : "outline"}
							>
								Next
							</Button>
						</div>
					</CardContent>
				)}
			</Card>

			<Card
				className={
					isAtStage("second_run")
						? "border-primary drop-shadow-xl drop-shadow-primary/50"
						: ""
				}
			>
				<CardHeader>
					<CardTitle>Second Run</CardTitle>
					<CardDescription>
						{murphState.secondRunDistance ?? "1"} Mile
					</CardDescription>

					{isAfterStage("second_run") && (
						<CardAction className="flex flex-col items-end">
							{murphState.secondRunEndTime && murphState.exercisesEndTime && (
								<p className="text-center text-sm">
									{formatTimeDifference(
										murphState.exercisesEndTime,
										murphState.secondRunEndTime,
									)}
								</p>
							)}
						</CardAction>
					)}
				</CardHeader>

				{isAtStage("second_run") && (
					<CardContent>
						{renderRunDistanceButtons(finishSecondRun, isBeforeSecondRun)}
					</CardContent>
				)}
			</Card>

			{isAtStage("completed") && (
				<div className="flex flex-col gap-4 mt-4 items-center">
					{isSaving ? (
						<LoaderIcon className="animate-spin" />
					) : (
						<>
							{isSaveSuccess ? (
								<Badge variant="success">Murph Saved</Badge>
							) : (
								<Badge variant="destructive">Murph not Saved</Badge>
							)}

							<Button variant="ghost" onClick={reset}>
								<TimerResetIcon />
								Reset
							</Button>
						</>
					)}
				</div>
			)}

			{started && (
				<AlertDialog>
					<AlertDialogTrigger asChild>
						<Button type="button" variant="ghost" className="mr-auto">
							Cancel
						</Button>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
							<AlertDialogDescription>
								This action cannot be undone. This will permanently delete your
								murph attempt.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<AlertDialogAction onClick={() => reset()}>
								Continue
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			)}
		</div>
	);
}
