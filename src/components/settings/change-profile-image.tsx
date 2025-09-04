import { useRouter } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { uploadProfilePictureServerFn } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import z from "zod";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export function ChangeProfileImage(props: {
	user: {
		name: string;
		image: string | null | undefined;
	};
}) {
	const schema = z.object({
		file: z
			.file()
			.max(2_000_000, { message: "Must be smaller than 2MB" })
			.mime(["image/webp", "image/jpeg", "image/png"]),
	});

	const [profileImage, setProfileImage] = useState<File | null>(null);
	const [uploadError, setUploadError] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const router = useRouter();
	const uploadProfilePicture = useServerFn(uploadProfilePictureServerFn);

	const previewUrl = useMemo(() => {
		if (!profileImage) return null;
		return URL.createObjectURL(profileImage);
	}, [profileImage]);

	useEffect(() => {
		return () => {
			if (previewUrl) {
				URL.revokeObjectURL(previewUrl);
			}
		};
	}, [previewUrl]);

	const cancelImage = () => {
		setProfileImage(null);
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	const { mutate: handleUpload, isPending: isUploading } = useMutation({
		mutationFn: () => {
			if (!profileImage) throw new Error("No file selected");

			const result = schema.safeParse({ file: profileImage });
			if (!result.success) throw result.error;

			const formData = new FormData();
			formData.append("file", result.data.file);

			return uploadProfilePicture({ data: formData });
		},
		onSuccess: () => {
			router.invalidate();
			setUploadError(null);
			cancelImage();
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
		<Card>
			<CardHeader>
				<CardTitle>Change Profile Image</CardTitle>
			</CardHeader>
			<CardContent className="flex items-center gap-4 flex-wrap">
				<Avatar className="size-36 text-6xl">
					<AvatarImage
						src={previewUrl ?? props.user.image ?? ""}
						className="object-cover"
					/>
					<AvatarFallback>{props.user.name.charAt(0)}</AvatarFallback>
				</Avatar>

				<div className="flex flex-col gap-2 w-full sm:max-w-xs">
					<div className="flex flex-col gap-1.5">
						<Label htmlFor="picture">Profile Picture</Label>
						<Input
							id="picture"
							type="file"
							accept="image/png,image/jpeg,image/webp"
							onChange={(e) => setProfileImage(e.target.files?.[0] ?? null)}
							ref={fileInputRef}
						/>
						{uploadError && (
							<p className="text-destructive text-sm">{uploadError}</p>
						)}
					</div>
				</div>
			</CardContent>
			<CardFooter className="flex items-center justify-between gap-2">
				<Button
					onClick={cancelImage}
					disabled={isUploading || !profileImage}
					variant="secondary"
				>
					Cancel
				</Button>
				<Button
					onClick={() => handleUpload()}
					disabled={isUploading || !profileImage}
				>
					Save
				</Button>
			</CardFooter>
		</Card>
	);
}
