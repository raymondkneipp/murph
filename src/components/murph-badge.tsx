import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import { ShieldIcon, StarIcon } from "lucide-react";

const murphBadgeVariants = cva("size-18", {
	variants: {
		level: {
			1: "fill-foreground text-foreground",
			2: "fill-accent-foreground text-accent-foreground",
			3: "text-primary fill-primary",
			4: "text-destructive fill-destructive",
		},
	},
	defaultVariants: {
		level: 1,
	},
});

export function MurphBadge({
	className,
	children,
	level,
	...props
}: React.ComponentProps<"div"> & VariantProps<typeof murphBadgeVariants>) {
	return (
		<div className="relative size-18" {...props}>
			<ShieldIcon
				className={cn(murphBadgeVariants({ level, className }))}
				strokeWidth="1.2px"
			/>
			<span className="text-2xl font-bold text-background top-1/2 left-1/2 absolute -translate-y-1/2 -translate-x-1/2 text-center flex flex-col items-center gap-0.5 leading-6">
				{children}

				<div className="flex">
					{(level ?? 1) >= 2 && (
						<StarIcon className="size-3 fill-background" strokeWidth="0" />
					)}
					{(level ?? 1) >= 3 && (
						<StarIcon className="size-3 fill-background" strokeWidth="0" />
					)}
					{level === 4 && (
						<StarIcon className="size-3 fill-background" strokeWidth="0" />
					)}
				</div>
			</span>
		</div>
	);
}
