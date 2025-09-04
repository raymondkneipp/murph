import { z } from "zod";
import { useAppForm } from "../../hooks/demo.form";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { updateUser } from "@/lib/auth-client";
import { useRouter } from "@tanstack/react-router";

const schema = z.object({
	name: z.string().min(1, "Name is required").max(20),
});

export function ChangeName(props: { name: string }) {
	const router = useRouter();

	const form = useAppForm({
		defaultValues: {
			name: props.name,
		},
		validators: {
			onSubmit: schema,
		},
		onSubmit: async ({ value }) => {
			await updateUser({
				name: value.name,
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
					<CardTitle>Change Name</CardTitle>
				</CardHeader>
				<CardContent>
					<form.AppField name="name">
						{(field) => <field.TextField label="Name" />}
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
