import { cn } from "@/lib/utils";

interface PieProps {
	value: "FULL" | "THREE_QUARTER" | "HALF" | "QUARTER" | "INCOMPLETE";
	size?: number;
	className?: string;
}

export function Pie({ value, size = 24, className }: PieProps) {
	const r = 10; // radius (keeps stroke inside 24x24)
	const c = 12; // center
	const strokeWidth = 2;

	// Color classes based on value
	const colorClass =
		value === "FULL"
			? "text-success"
			: value === "INCOMPLETE" || value === "QUARTER"
				? "text-destructive"
				: "text-foreground";

	// Convenience points
	const top = `${c},${c - r}`;
	const right = `${c + r},${c}`;
	const bottom = `${c},${c + r}`;
	const left = `${c - r},${c}`;

	// Paths for slices
	const paths: Record<PieProps["value"], string[]> = {
		FULL: [
			`M ${c},${c} m -${r},0 a ${r},${r} 0 1,0 ${2 * r},0 a ${r},${r} 0 1,0 -${2 * r},0 Z`,
		],
		THREE_QUARTER: [
			`M ${c},${c} L ${top} A ${r},${r} 0 1,1 ${left} L ${c},${c} Z`,
			`M ${c},${c} L ${left} A ${r},${r} 0 0,1 ${bottom} L ${c},${c} Z`,
			`M ${c},${c} L ${bottom} A ${r},${r} 0 0,1 ${right} L ${c},${c} Z`,
		],
		HALF: [`M ${c},${c} L ${top} A ${r},${r} 0 0,1 ${bottom} L ${c},${c} Z`],
		QUARTER: [`M ${c},${c} L ${top} A ${r},${r} 0 0,1 ${right} L ${c},${c} Z`],
		INCOMPLETE: [],
	};

	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 24 24"
			className={cn(colorClass, className)}
			fill="none"
			stroke="currentColor"
			strokeWidth={strokeWidth}
			aria-label={`${value.toLowerCase().replace("_", " ")} progress`}
		>
			<title>{`${value.toLowerCase().replace("_", " ")} progress`}</title>
			{/* Fill wedges */}
			{paths[value].map((d, i) => (
				<path key={`${value}-${i}`} d={d} fill="currentColor" stroke="none" />
			))}

			{/* Circle outline */}
			<circle cx={c} cy={c} r={r} />
		</svg>
	);
}
