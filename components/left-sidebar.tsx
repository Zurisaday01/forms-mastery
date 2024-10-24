'use client';

import { sidebarLinks } from '@/constants';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from './ui/button';
import { Icons } from '@/components/icons';
import { useSession } from 'next-auth/react';
import { useLocale, useTranslations } from 'next-intl';
import SignOutButton from './auth/sign-out-button';

const LeftSidebar = () => {
	const { data: session, status } = useSession();
	const pathname = usePathname();
	const currentLocale = useLocale();
	const tAuth = useTranslations('Auth');

	return (
		<section
			className={cn('left-sidebar h-[100vh] pb-4', 'max-xl:hidden')}>
			<nav className='flex flex-col'>
				<Link
					href='/'
					className='flex cursor-pointer items-center gap-2 pb-10 max-lg:justify-center'>
					<Image src='/logo.png' alt='logo' width={23} height={27} />
					<h1 className='font-barlow font-extrabold  '>Forms Mastery</h1>
				</Link>

				{sidebarLinks.map(({ route, label, icon }) => {
					const isActive =
						pathname === route || pathname.startsWith(`${route}/`);

					const Icon = Icons[(icon || 'arrowRight') as IconType];

					if (
						session?.user?.role !== 'ADMIN' &&
						(label[currentLocale as keyof typeof label] === 'Users' ||
							label[currentLocale as keyof typeof label] === 'Usuarios')
					)
						return null;
					if (
						!session &&
						(label[currentLocale as keyof typeof label] === 'My Templates' ||
							label[currentLocale as keyof typeof label] === 'Mis Plantillas')
					)
						return null;

					if (
						!session &&
						(label[currentLocale as keyof typeof label] === 'Answered Forms' ||
							label[currentLocale as keyof typeof label] ===
								'Formularios Contestados')
					)
						return null;

					return (
						<Link
							href={route}
							key={route}
							className={cn(
								'flex gap-3 items-center py-4 max-lg:px-4 justify-start',
								{
									'bg-blue-400 rounded-l-full': isActive,
								}
							)}>
							<Icon className={`ml-3 size-5 flex-none`} />
							<p>{label[currentLocale as keyof typeof label]}</p>
						</Link>
					);
				})}
			</nav>

			<div className='flex flex-col gap-4 pr-6 max-lg:px-4'>
				{status === 'authenticated' && <SignOutButton />}

				{status === 'unauthenticated' && (
					<Button asChild className='w-full'>
						<Link href='/authenticate'>{tAuth('signIn')}</Link>
					</Button>
				)}
			</div>
		</section>
	);
};

export default LeftSidebar;
