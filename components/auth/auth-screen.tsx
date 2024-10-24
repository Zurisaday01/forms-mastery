'use client';

import { useState } from 'react';
import SignInCard from './sign-in-card';
import SignUpCard from './sign-up-card';
import { ModeToggle } from '../mode-toggle';
import LocaleSwitcher from '../i18n/locale-switcher';

const AuthScreen = () => {
	const [state, setState] = useState<SignInFlow>('signIn');

	return (
		<div className='h-[100vh] flex items-center justify-center bg-blue-500 dark:bg-gray-800 px-3 relative'>
			<div className='absolute top-2 left-5 flex gap-2'>
				<LocaleSwitcher />
				<ModeToggle />
			</div>
			<div className='md:h-auto w-full max-w-[520px]'>
				{state === 'signIn' ? (
					<SignInCard setState={setState} />
				) : (
					<SignUpCard setState={setState} />
				)}
			</div>
		</div>
	);
};
export default AuthScreen;
