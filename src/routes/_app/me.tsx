import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FlameIcon, HashIcon, HourglassIcon, TimerIcon } from "lucide-react";
import { Icon as CustomIcons } from "@/components/icon";
import { formatNumber, murphMetrics } from "@/lib/utils";
import { MurphItem } from "@/components/murph-item";
import { DemoBadges } from "@/components/demo-badges";
import {
	getUserMurphsServerFn,
	getUserServerFn,
	uploadProfilePictureServerFn,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import z from "zod";

export const Route = createFileRoute("/_app/me")({
	component: RouteComponent,
	beforeLoad: async () => {
		const user = await getUserServerFn();

		return {
			user: {
				...user,
				name: user.name ?? "Anonymous",
			},
		};
	},

	loader: async ({ context }) => {
		return {
			murphs: await getUserMurphsServerFn(),
			user: context.user,
		};
	},
});

function RouteComponent() {
	const { murphs, user } = Route.useLoaderData();

	const {
		totalDistance,
		totalPullups,
		totalPushups,
		totalSquats,
		totalMurphs,
		fastestMurph,
		longestStreak,
		averageMurph,
	} = useMemo(() => murphMetrics(murphs ?? []), [murphs]);

	const schema = z.object({
		file: z
			.file()
			.max(2_000_000, { message: "Must be smaller than 2MB" })
			.mime(["image/webp", "image/jpeg", "image/png"]),
	});

	const [profileImage, setProfileImage] = useState<File | null>(null);
	const [uploadError, setUploadError] = useState<string | null>(null);
	const [isUploadDialogOpen, setIsUploadDialogOpen] = useState<boolean>(false);

	const router = useRouter();

	const uploadProfilePicture = useServerFn(uploadProfilePictureServerFn);
	const { mutate: handleUpload, isPending: isUploading } = useMutation({
		mutationFn: () => {
			if (!profileImage) throw new Error("No file selected");

			const result = schema.safeParse({ file: profileImage });

			if (!result.success) {
				throw result.error;
			}

			const formData = new FormData();
			formData.append("file", result.data.file);

			return uploadProfilePicture({ data: formData });
		},
		onSuccess: () => {
			// Close the dialog and refresh the current route to update the data
			router.invalidate();
			setUploadError(null);
			setIsUploadDialogOpen(false);
		},
		onError: (err: any) => {
			if (err instanceof z.ZodError) {
				setUploadError(err.issues.map((e) => e.message).join(", "));
			} else {
				setUploadError("Something went wrong.");
			}
			console.error("Upload failed:", err);
		},
	});

	return (
		<div className="flex flex-col gap-8">
			<h1 className="font-bold text-3xl">My Profile</h1>

			<div className="flex items-center gap-8">
				<Avatar className="size-36 text-6xl group">
					<AvatarImage src={user.image ?? ""} />
					<AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
					<div className="absolute inset-0 bg-background/50 backdrop-blur hidden group-hover:flex items-center justify-center">
						<Dialog
							open={isUploadDialogOpen}
							onOpenChange={setIsUploadDialogOpen}
						>
							<DialogTrigger asChild>
								<Button variant="outline">Edit</Button>
							</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>Change Profile Picture</DialogTitle>
								</DialogHeader>

								<div className="grid w-full items-center gap-3">
									<Label htmlFor="picture">Profile Picture</Label>
									<Input
										id="picture"
										type="file"
										multiple={false}
										onChange={(e) =>
											setProfileImage(e.target.files?.[0] ?? null)
										}
										accept="image/png,image/jpeg,image/webp"
									/>
									{uploadError && (
										<p className="text-destructive">{uploadError}</p>
									)}
								</div>

								<Button onClick={() => handleUpload()} disabled={isUploading}>
									Save
								</Button>
							</DialogContent>
						</Dialog>
					</div>
				</Avatar>
				<h2 className="font-bold text-2xl">{user.name}</h2>
			</div>

			<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
				<div className="flex items-center gap-3">
					<CustomIcons.Pullup className="size-8" />
					<div className="flex flex-col">
						<p className="font-bold">{formatNumber(totalPullups)}</p>
						<h3 className="text-xs">Total Pullups</h3>
					</div>
				</div>

				<div className="flex items-center gap-3">
					<CustomIcons.Pushup className="size-8" />
					<div className="flex flex-col">
						<p className="font-bold">{formatNumber(totalPushups)}</p>
						<h3 className="text-xs">Total Pushups</h3>
					</div>
				</div>

				<div className="flex items-center gap-3">
					<CustomIcons.Squat className="size-8" />
					<div className="flex flex-col">
						<p className="font-bold">{formatNumber(totalSquats)}</p>
						<h3 className="text-xs">Total Squats</h3>
					</div>
				</div>

				<div className="flex items-center gap-3">
					<CustomIcons.Running className="size-8" />
					<div className="flex flex-col">
						<p className="font-bold">{formatNumber(totalDistance)} mi</p>
						<h3 className="text-xs">Total Distance</h3>
					</div>
				</div>

				<div className="flex items-center gap-3">
					<HashIcon className="size-8" />
					<div className="flex flex-col">
						<p className="font-bold">{formatNumber(totalMurphs)}</p>
						<h3 className="text-xs">Total Murphs</h3>
					</div>
				</div>

				<div className="flex items-center gap-3">
					<TimerIcon className="size-8" />
					<div className="flex flex-col">
						<p className="font-bold">{fastestMurph ?? "N/A"}</p>
						<h3 className="text-xs">Fastest Time</h3>
					</div>
				</div>

				<div className="flex items-center gap-3">
					<HourglassIcon className="size-8" />
					<div className="flex flex-col">
						<p className="font-bold">{averageMurph ?? "N/A"}</p>
						<h3 className="text-xs">Average Time</h3>
					</div>
				</div>

				<div className="flex items-center gap-3">
					<FlameIcon className="size-8" />
					<div className="flex flex-col">
						<p className="font-bold">{longestStreak}</p>
						<h3 className="text-xs">Longest Streak</h3>
					</div>
				</div>
			</div>

			<div className="flex flex-col gap-2">
				{murphs?.map((m) => (
					<MurphItem m={m} key={m.id} />
				))}
			</div>

			<DemoBadges />
		</div>
	);
}
