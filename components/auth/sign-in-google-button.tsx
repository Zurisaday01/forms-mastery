'use client';
import { FcGoogle } from 'react-icons/fc';
import { Button } from '../ui/button';
import { signInAction } from '@/actions/auth.actions';
import { useTranslations } from 'next-intl';

const SignInGoogleButton = () => {
	const t = useTranslations('Auth');

	return (
		<form action={signInAction}>
			<Button
				variant='outline'
				size='lg'
				disabled={false}
				className='w-full relative'>
				<FcGoogle className='size-5 absolute top-2.5 left-2.5' />
				{t('continueGoogle')}
			</Button>
		</form>
	);
};
export default SignInGoogleButton;
