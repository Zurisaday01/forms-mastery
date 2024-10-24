'use client';
import { Session } from 'next-auth';
import { useCurrentSession } from '@/hooks/use-current-session';
import { useTranslations } from 'next-intl';

export default function UserAvatar() {
	const { session } = useCurrentSession();
	const t = useTranslations('UserAvatar');

	return (
		<div className='flex max-md:flex-row-reverse justify-end items-center gap-2'>
			{!session ? (
				<>
					<p className='text-sm font-bold'>{t('guest')}</p>
					<div className='animated-background h-8 w-8 bg-gradient-to-r from-blue-500 via-blue-500 to-indigo-500 rounded-full'></div>
				</>
			) : (
				<>
					<p className='text-sm font-bold'>
						{(session as Session)?.user?.firstName}{' '}
						{(session as Session).user?.lastName}
					</p>
					<div className='animated-background h-8 w-8 bg-gradient-to-r from-blue-500 via-blue-500 to-indigo-500 rounded-full'></div>
				</>
			)}
		</div>
	);
}
