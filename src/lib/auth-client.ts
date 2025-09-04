import { createAuthClient } from "better-auth/react";
import { usernameClient } from "better-auth/client/plugins";

export const {
	useSession,
	getSession,
	signIn,
	signUp,
	signOut,
	isUsernameAvailable,
	updateUser,
} = createAuthClient({
	baseURL: "http://localhost:3000",
	// redirectTo: "/feed",
	plugins: [usernameClient()],
});
