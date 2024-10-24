'use server';
import { auth, signIn, signOut } from '@/auth';

import { prisma as db } from '@/lib/prisma';
import { LoginSchema, RegisterSchema } from '@/schema';
import { UserRole, UserStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { AuthError } from 'next-auth';
import { getTranslations } from 'next-intl/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

export const signInAction = async () => {
	await signIn('google', { redirectTo: '/' });
};

export const signOutAction = async () => {
	await signOut({ redirectTo: '/' });
};

export const getUserByEmail = async (email: string) => {
	try {
		const user = await db.user.findUnique({
			where: {
				email,
			},
		});

		return user;
	} catch {
		return null;
	}
};

export const getUserById = async (id: string) => {
	try {
		const user = await db.user.findUnique({
			where: {
				id,
			},
		});

		return user;
	} catch {
		return null;
	}
};

export const getAccountByUserId = async (userId: string) => {
	try {
		const account = await db.account.findFirst({
			where: {
				userId,
			},
		});

		return account;
	} catch (error: unknown) {
		console.log('Failed to fetch account', error);
		return null;
	}
};

export const register = async (values: z.infer<typeof RegisterSchema>) => {
	const validatedFields = RegisterSchema.safeParse(values);
	// get the translation of  messages
	const t = await getTranslations('AuthServerActions');

	if (!validatedFields.success) {
		return { error: true, message: t('invalidFields') };
	}

	const { email, password, firstName, lastName } = validatedFields.data;
	const hashedPassword = await bcrypt.hash(password, 10);

	const existingUser = await getUserByEmail(email);

	if (existingUser) {
		return { error: true, message: t('register.errorEmailTaken') };
	}

	// Create user
	await db.user.create({
		data: {
			firstName,
			lastName,
			email: email.toLowerCase(),
			password: hashedPassword,
		},
	});

	return { success: true, message: t('register.success') };
};

export const login = async (values: z.infer<typeof LoginSchema>) => {
	const validatedFields = LoginSchema.safeParse(values);
	// get the translation of  messages
	const t = await getTranslations('AuthServerActions');

	if (!validatedFields.success) {
		return { error: true, message: t('invalidFields') };
	}

	const { email, password } = validatedFields.data;

	const existingUser = await getUserByEmail(email);

	if (!existingUser || !existingUser.email) {
		return { error: true, message: t('login.errorInvalidCredentials') };
	}

	if (!existingUser.password) {
		return { error: true, message: t('login.errorNoPassword') };
	}

	if (existingUser.status === 'BLOCKED') {
		return { error: true, message: t('login.errorBlocked') };
	}

	try {
		await signIn('credentials', {
			email: email.toLowerCase(),
			password,
			redirectTo: '/',
		});

		revalidatePath('/');
	} catch (error) {
		if (error instanceof AuthError) {
			switch (error.type) {
				case 'CredentialsSignin':
					return { error: true, message: t('login.errorInvalidCredentials') };
				default:
					return { error: true, message: t('login.errorGeneric') };
			}
		}

		throw error;
	}
};

export const getAllUsers = async () => {
	try {
		const users = await db.user.findMany();

		revalidatePath('/users');
		return users;
	} catch (error) {
		console.log('Failed to fetch users');
		throw error;
	}
};

export const deleteUsers = async (userIds: string[]) => {
	try {
		const session = await auth();

		// Delete multiple users
		await db.user.deleteMany({
			where: {
				id: {
					in: userIds,
				},
			},
		});

		// If the current user is deleted, log them out
		if (session?.user?.id && userIds.includes(session.user.id)) {
			// Ensure deleteSession is awaited if it's asynchronous
			await signOut();
		}
	} catch (error) {
		console.error('Failed to delete user(s)', error);
		throw error;
	}
};

// export const UserStatus: {
// 	ACTIVE: 'ACTIVE',
// 	BLOCKED: 'BLOCKED'
//   };

export const updateStatusUsers = async (
	userIds: string[],
	status: UserStatus
) => {
	try {
		const session = await auth();
		// Block multiple users
		await Promise.all(
			userIds.map(userId =>
				db.user.update({
					where: { id: userId },
					data: { status: status },
				})
			)
		);

		// If the current user is blocked, log them out
		if (session?.user?.id && userIds.includes(session?.user?.id)) {
			// Ensure deleteSession is awaited if it's asynchronous
			await signOut();
		}

		revalidatePath('/users');
	} catch (error) {
		console.error('Failed to block user(s)', error);
		throw error;
	}
};

export const updateRoleUsers = async (userIds: string[], role: UserRole) => {
	try {
		// Change role for multiple users
		await Promise.all(
			userIds.map(userId =>
				db.user.update({
					where: { id: userId },
					data: { role: role },
				})
			)
		);

		revalidatePath('/users');
	} catch (error) {
		console.error('Failed to change user(s) role(s)', error);
		throw error;
	}
};
