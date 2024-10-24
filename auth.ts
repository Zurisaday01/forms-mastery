import NextAuth, { User as NextAuthUser } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { UserRole, UserStatus } from '@prisma/client';

import { prisma as db } from '@/lib/prisma';
import authConfig from './auth.config';
import {
	getAccountByUserId,
	getUserByEmail,
	getUserById,
} from './actions/auth.actions';

declare module 'next-auth' {
	interface Session {
		user: NextAuthUser & {
			role: UserRole;
			status: UserStatus;
			isOAuth: boolean;
			firstName: string;
			lastName: string;
			email: string;
			image: string;
		};
	}
}

export const { handlers, signIn, signOut, auth } = NextAuth({
	pages: {
		signIn: '/authenticate',
	},
	callbacks: {
		async signIn({ account, user }) {
			// Check if the user exists in the database
			const existingUser = await getUserByEmail(user?.email as string);

			// If the user is blocked, prevent sign-in
			if (existingUser && existingUser?.status === 'BLOCKED') {
				throw new Error('User is blocked.');
				// return false;
			}

			if (account?.provider === 'google') {
				return true;
			}
			return true;

			// If the user has signed in with Google (an OAuth provider), NextAuth.js extracts the profile data and passes it into your custom createUser function in the adapter. from the id_token
		},
		async session({ token, session }) {
			if (token.sub && session.user) {
				session.user.id = token.sub;
			}

			if (session.user) {
				session.user.firstName = token.firstName as string;
				session.user.lastName = token.lastName as string;
				session.user.email = token.email as string;
				session.user.role = token.role as UserRole;
				session.user.status = token.status as UserStatus;
				session.user.isOAuth = token.isOAuth as boolean;
			}

			return session;
		},
		async jwt({ token }) {
			if (!token.sub) return token;

			const existingUser = await getUserById(token.sub);

			if (!existingUser) return token;

			const existingAccount = await getAccountByUserId(existingUser.id);

			// Custom token fields
			token.isOAuth = !!existingAccount;
			// eslint-disable-next-line @typescript-eslint/no-unused-expressions
			(token.firstName = existingUser.firstName),
				(token.lastName = existingUser.lastName),
				(token.email = existingUser.email),
				(token.role = existingUser.role),
				(token.status = existingUser.status);
			token.role = existingUser.role;

			return token;
		},
	},
	adapter: PrismaAdapter(db),
	session: { strategy: 'jwt' },
	...authConfig,
});
