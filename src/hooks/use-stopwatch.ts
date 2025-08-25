import { useEffect, useRef, useState } from "react";

export function useStopwatch() {
	const [elapsed, setElapsed] = useState(0); // milliseconds
	const [isRunning, setIsRunning] = useState(false);

	const startTimeRef = useRef<number | null>(null);
	const rafRef = useRef<number | null>(null);

	// tick function updates elapsed every frame
	const tick = () => {
		if (startTimeRef.current !== null) {
			setElapsed(Date.now() - startTimeRef.current);
			rafRef.current = requestAnimationFrame(tick);
		}
	};

	const start = () => {
		if (!isRunning) {
			setIsRunning(true);
			startTimeRef.current = Date.now() - elapsed; // resume support
			rafRef.current = requestAnimationFrame(tick);
		}
	};

	const stop = () => {
		setIsRunning(false);
		if (rafRef.current) cancelAnimationFrame(rafRef.current);
		rafRef.current = null;
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
