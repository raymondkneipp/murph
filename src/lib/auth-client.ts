import { createAuthClient } from "better-auth/react";
import { usernameClient } from "better-auth/client/plugins";
import { env } from "@/env/client";

export const {
	useSession,
	getSession,
	signIn,
	signUp,
	signOut,
	isUsernameAvailable,
	updateUser,
} = createAuthClient({
	baseURL: env.VITE_BETTER_AUTH_URL,
	// redirectTo: "/feed",
	plugins: [usernameClient()],
});
