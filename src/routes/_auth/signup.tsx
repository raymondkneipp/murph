import { Button } from "@/components/ui/button";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { z } from "zod";
import { useAppForm } from "../../hooks/demo.form";
import { signUp } from "@/lib/auth-client";

export const Route = createFileRoute("/_auth/signup")({
	component: RouteComponent,
});

const schema = z.object({
	name: z.string().min(1, "Name is required"),
	email: z.string().min(1, "Email is required"),
	password: z.string().min(1, "Password is required"),
});

function RouteComponent() {
	const router = useRouter();

	const form = useAppForm({
		defaultValues: {
			name: "",
			email: "",
			password: "",
		},
		validators: {
			onChange: schema,
		},
		onSubmit: async ({ value }) => {
			await signUp.email(value, {
				onSuccess: () => router.navigate({ to: "/feed" }),
			});
		},
	});

	return (
		<div>
			<h1 className="font-bold text-3xl">Sign Up</h1>

			<form
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				}}
				className="flex flex-col gap-4 my-8"
			>
				<form.AppField name="name">
					{(field) => <field.TextField label="Name" type="text" />}
				</form.AppField>

				<form.AppField name="email">
					{(field) => (
						<field.TextField label="Email" type="email" inputMode="email" />
					)}
				</form.AppField>

				<form.AppField name="password">
					{(field) => <field.TextField label="Password" type="password" />}
				</form.AppField>

				<form.AppForm>
					<form.SubscribeButton label="Submit" />
				</form.AppForm>
			</form>

			<div className="flex items-center gap-0">
				<p className="text-sm">Already have an account?</p>
				<Button variant="link" asChild>
					<Link to="/login">Login</Link>
				</Button>
			</div>
		</div>
	);
}
