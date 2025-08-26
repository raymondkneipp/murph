import { createAuthClient } from "better-auth/react";
export const { useSession, getSession, signIn, signUp, signOut } =
	createAuthClient({
		baseURL: "http://localhost:3000",
		redirectTo: "/feed",
	});
