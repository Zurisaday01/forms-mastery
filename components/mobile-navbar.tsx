'use client';
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetTrigger,
} from '@/components/ui/sheet';

import Link from 'next/link';
import Image from 'next/image';
import { sidebarLinks } from '@/constants';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Icons } from './icons';
import { Menu } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { Button } from './ui/button';
import UserAvatar from './user-avatar';
import SignOutButton from './auth/sign-out-button';
import { useSession } from 'next-auth/react';

const Navbar = () => {
	const { data: session, status } = useSession();
	const currentLocale = useLocale();
	const pathname = usePathname();
	const tAuth = useTranslations('Auth');

	return (
		<section>
			<Sheet>
				<SheetTrigger>
					<Menu className='cursor-pointer w-5 h-5' />
				</SheetTrigger>
				<SheetContent
					side='left'
					className='border-none h-[100vh] pb-4 bg-white dark:bg-black pr-0 flex flex-col justify-between'>
					<div>
						<Link
							href='/'
							className='flex cursor-pointer items-center gap-1 pb-10 pl-4'>
							<Image src='/logo.png' alt='logo' width={23} height={27} />
							<h1 className='font-extrabold ml-2'>Forms Mastery</h1>
						</Link>
						<div className='flex flex-col justify-between overflow-y-auto'>
							<SheetClose asChild>
								<div className='h-full flex flex-col justify-between'>
									<nav className='flex flex-col gap-6'>
										{sidebarLinks.map(({ route, label, icon }) => {
											const isActive =
												pathname === route || pathname.startsWith(`${route}/`);

											const Icon = Icons[(icon || 'arrowRight') as IconType];

											if (
												session?.user?.role !== 'ADMIN' &&
												(label[currentLocale as keyof typeof label] ===
													'Users' ||
													label[currentLocale as keyof typeof label] ===
														'Usuarios')
											)
												return null;
											if (
												!session &&
												(label[currentLocale as keyof typeof label] ===
													'My Templates' ||
													label[currentLocale as keyof typeof label] ===
														'Mis Plantillas')
											)
												return null;

											if (
												!session &&
												(label[currentLocale as keyof typeof label] ===
													'Answered Forms' ||
													label[currentLocale as keyof typeof label] ===
														'Formularios Contestados')
											)
												return null;

											return (
												<SheetClose asChild key={route}>
													<Link
														href={route}
														className={cn(
															'flex gap-3 items-center py-4 max-lg:px-4 justify-start',
															{
																'bg-blue-400 rounded-l-full': isActive,
															}
														)}>
														<Icon className={`ml-3 size-5 flex-none`} />
														<p>{label[currentLocale as keyof typeof label]}</p>
													</Link>
												</SheetClose>
											);
										})}
									</nav>
								</div>
							</SheetClose>
						</div>
					</div>
					<div className='flex w-full flex-col gap-4 pr-6 max-lg:px-4'>
						<div className='md:hidden'>
							<UserAvatar />
						</div>
						{status === 'authenticated' && <SignOutButton />}

						{status === 'unauthenticated' && (
							<Button asChild className='w-full'>
								<Link href='/authenticate'>{tAuth('signIn')}</Link>
							</Button>
						)}
					</div>
				</SheetContent>
			</Sheet>
		</section>
	);
};
export default Navbar;
