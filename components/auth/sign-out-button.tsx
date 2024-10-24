'use client';
import { signOutAction } from '@/actions/auth.actions';
import { Button } from '../ui/button';
import { signOut } from 'next-auth/react';
import { useTranslations } from 'next-intl';

const SignOutButton = () => {
	const t = useTranslations('Auth');
	return (
		<form action={signOutAction}>
			<Button
				className='w-full'
				onClick={() => {
					signOut({ callbackUrl: '/' });
				}}
				type='submit'>
				{t('signOut')}
			</Button>
		</form>
	);
};
export default SignOutButton;
