import { Button } from "@/components/ui/button";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { z } from "zod";
import { useAppForm } from "../../hooks/demo.form";
import { signIn } from "@/lib/auth-client";

const schema = z.object({
	email: z.string().min(1, "Email is required"),
	password: z.string().min(1, "Password is required"),
});

export const Route = createFileRoute("/_auth/login")({
	component: RouteComponent,
});

function RouteComponent() {
	const router = useRouter();

	const form = useAppForm({
		defaultValues: {
			email: "",
			password: "",
		},
		validators: {
			onChange: schema,
		},
		onSubmit: async ({ value }) => {
			await signIn.email(value, {
				onSuccess: () => router.navigate({ to: "/app/feed" }),
				onError: () => alert("Something went wrong. Try again later."),
			});
		},
	});

	return (
		<div>
			<h1 className="font-bold text-3xl">Login</h1>

			<form
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				}}
				className="flex flex-col gap-4 my-8"
			>
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
				<p className="text-sm">Don't have an account?</p>
				<Button variant="link" asChild>
					<Link to="/signup">Sign up</Link>
				</Button>
			</div>
		</div>
	);
}
