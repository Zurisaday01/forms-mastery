'use client';

import { SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth';
import { useMemo } from 'react';

type Props = {
	children?: React.ReactNode;
	session?: Session | null;
};

export const NextAuthProvider = ({ children, session }: Props) => {
	const sessionKey = new Date().valueOf();

	const memoizedSessionKey = useMemo(() => {
		return sessionKey;
	}, [session, sessionKey]);

	return (
		<SessionProvider session={session} key={memoizedSessionKey}>
			{children}
		</SessionProvider>
	);
};
