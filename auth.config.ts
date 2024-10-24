import bcrypt from 'bcryptjs';
import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';

import { LoginSchema } from './schema';
import { getUserByEmail } from './actions/auth.actions';

export default {
	providers: [
		Google({
			allowDangerousEmailAccountLinking: true,
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			profile(profile) {
				// return user's shape
				return {
					firstName: profile.given_name,
					lastName: profile.family_name,
					email: profile.email,
				};
			},
		}),
		Credentials({
			async authorize(credentials) {
				const validatedFields = LoginSchema.safeParse(credentials);

				if (validatedFields.success) {
					const { email, password } = validatedFields.data;

					const user = await getUserByEmail(email);

					if (!user) {
						// throw new Error('No user found with this email.');
						return null;
					}

					if (!user.password) {
						// throw new Error(
						// 	'Password not set for this user. Please use OAuth.'
						// );
						return null;
					}

					// Check if the user is active

					if (user.status === 'BLOCKED') {
						// throw new Error('Your account is blocked.');
						return null;
					}

					const passwordMatches = await bcrypt.compare(password, user.password);

					// If the password does not match, log and return null
					if (!passwordMatches) {
						return null;
						// throw new Error('Incorrect password.');
					}

					return user;
				}

				return null;
			},
		}),
	],
} satisfies NextAuthConfig;
