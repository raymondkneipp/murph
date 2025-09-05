import { useCallback, useEffect, useRef, useState } from "react";

export function useStopwatch(startTime?: Date | null) {
	const [elapsed, setElapsed] = useState(0); // milliseconds
	const [isRunning, setIsRunning] = useState(false);

	const startTimeRef = useRef<number | null>(null);
	const rafRef = useRef<number | null>(null);

	// tick function updates elapsed every frame
	const tick = useCallback(() => {
		if (startTimeRef.current !== null) {
			setElapsed(Date.now() - startTimeRef.current);
			rafRef.current = requestAnimationFrame(tick);
		}
	}, []);

	// Initialize with past start time if provided (for page reloads)
	useEffect(() => {
		if (startTime && !isRunning && startTimeRef.current === null) {
			const pastStartTime = startTime.getTime();
			const now = Date.now();
			const calculatedElapsed = now - pastStartTime;
			
			if (calculatedElapsed > 0) {
				setElapsed(calculatedElapsed);
				startTimeRef.current = pastStartTime;
				setIsRunning(true);
			}
		}
	}, [startTime, isRunning]);

	// Handle animation loop when running state changes
	useEffect(() => {
		if (isRunning && startTimeRef.current !== null) {
			rafRef.current = requestAnimationFrame(tick);
		} else if (rafRef.current) {
			cancelAnimationFrame(rafRef.current);
			rafRef.current = null;
		}
	}, [isRunning, tick]);

	const start = () => {
		if (!isRunning) {
			startTimeRef.current = Date.now() - elapsed; // resume support
			setIsRunning(true);
		}
	};

	const stop = () => {
		setIsRunning(false);
	};

	const reset = () => {
		stop();
		setElapsed(0);
		startTimeRef.current = null;
	};

	// cleanup on unmount
	useEffect(() => {
		return () => {
			if (rafRef.current) cancelAnimationFrame(rafRef.current);
		};
	}, []);

	// formatted hh:mm:ss.SSS
	const hours = Math.floor(elapsed / 3600000)
		.toString()
		.padStart(2, "0");
	const minutes = Math.floor((elapsed % 3600000) / 60000)
		.toString()
		.padStart(2, "0");
	const seconds = Math.floor((elapsed % 60000) / 1000)
		.toString()
		.padStart(2, "0");
	const milliseconds = (elapsed % 1000).toString().padStart(3, "0");
	const formatted = `${hours}:${minutes}:${seconds}.${milliseconds}`;

	return { elapsed, formatted, isRunning, start, stop, reset };
}
