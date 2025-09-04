import { createFileRoute } from "@tanstack/react-router";
import { getUserServerFn } from "@/lib/api";
import { ChangeProfileImage } from "@/components/settings/change-profile-image";
import { ChangeName } from "@/components/settings/change-name";
import { ChangeUsername } from "@/components/settings/change-username";

export const Route = createFileRoute("/app/settings")({
	component: RouteComponent,
	beforeLoad: async () => {
		const user = await getUserServerFn();

		return {
			user: {
				...user,
				name: user.name ?? "Anonymous",
			},
		}
	},

	loader: async ({ context }) => {
		return { user: context.user };
	},
});

function RouteComponent() {
	const { user } = Route.useLoaderData();

	return (
		<div className="flex flex-col gap-8">
			<h1 className="font-bold text-3xl">Settings</h1>

			<ChangeProfileImage user={user} />

			<ChangeName name={user.name} />
			<ChangeUsername username={user.username ?? user.name} />
		</div>
	)
}
