import { Center, Page } from '@layouts';
import { signOut, useSession } from 'next-auth/react';

import { GiCrossedBones } from 'react-icons/gi';
import type { NextPage } from 'next';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Me: NextPage = () => {
	const { data: session } = useSession();
	const router = useRouter();

	useEffect(() => {
		if (!session) {
			router.push('/');
		}
	}, [session]);

	if (!session) return null;

	return (
		<Page title="Murph Profile">
			<Center>
				<div className="flex flex-col gap-6">
					<h1>Welcome {session.user?.name}</h1>
					<button
						className="flex items-center gap-6 rounded-md border-l-8 border-red-400 bg-neutral-900 py-3 px-6 font-bold text-red-400 shadow-2xl shadow-red-500"
						onClick={() => signOut()}
					>
						<GiCrossedBones size={30} />
						<span className="text-white">Sign Out</span>
					</button>
				</div>
			</Center>
		</Page>
	);
};

export default Me;
