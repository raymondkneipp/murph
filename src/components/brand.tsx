import { Link } from "@tanstack/react-router";
import { ShieldIcon } from "lucide-react";

export function Brand() {
	return (
		<Link to="/">
			<div className="uppercase font-bold text-2xl flex items-center gap-1.5">
				<ShieldIcon className="fill-primary text-primary size-8" /> Murph
			</div>
		</Link>
	);
}
