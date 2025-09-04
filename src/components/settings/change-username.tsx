import { z } from "zod";
import { useAppForm } from "../../hooks/demo.form";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { isUsernameAvailable, updateUser } from "@/lib/auth-client";
import { useRouter } from "@tanstack/react-router";

const schema = z.object({
	username: z.string().min(1, "Username is required").max(20),
});

export function ChangeUsername(props: { username: string }) {
	const router = useRouter();

	const form = useAppForm({
		defaultValues: {
			username: props.username,
		},
		validators: {
			onSubmit: schema,
		},
		onSubmit: async ({ value }) => {
			await updateUser({
				username: value.username,
			});
			router.invalidate();
		},
	});

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
		>
			<Card>
				<CardHeader>
					<CardTitle>Change Username</CardTitle>
				</CardHeader>
				<CardContent>
					<form.AppField
						name="username"
						asyncDebounceMs={500}
						validators={{
							onChangeAsync: async ({ value }) => {
								const { data: res } = await isUsernameAvailable({
									username: value,
								});

								return res?.available ? undefined : "Username is taken";
							},
						}}
					>
						{(field) => <field.TextField label="Username" />}
					</form.AppField>
				</CardContent>
				<CardFooter>
					<form.AppForm>
						<form.SubscribeButton label="Save" />
					</form.AppForm>
				</CardFooter>
			</Card>
		</form>
	);
}
