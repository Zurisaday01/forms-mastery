import { Tag } from 'lucide-react';
import FullTextSearch from './full-text-search';
import LocaleSwitcher from './i18n/locale-switcher';
import { ModeToggle } from './mode-toggle';
import { Button } from './ui/button';
import UserAvatar from './user-avatar';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import MobileNavbar from '@/components/mobile-navbar';
import Image from 'next/image';

import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

const Navbar = async () => {
	const t = await getTranslations('Navbar');

	return (
		<header className=' h-[50px] w-full items-center justify-between px-4 border border-b-primary/30 flex gap-3'>
			<Link href='/' className='xl:hidden max-xl:flex cursor-pointer items-center gap-2'>
				<Image src='/logo.png' alt='logo' width={23} height={27} />
				<h1 className='font-extrabold ml-2 max-lg:hidden'>Forms Mastery</h1>
			</Link>
			<div className='flex-1 flex items-center gap-3 justify-center'>
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant='ghost'
								className='rounded-full h-8 w-8 p-1'
								asChild>
								<Link href='/tag-search'>
									<Tag className='w-4 h-4' />
								</Link>
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>{t('tagCloud')}</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>

				<FullTextSearch />
			</div>
			<div className='flex items-center gap-3'>
				<LocaleSwitcher />
				<ModeToggle />
				<div className='max-md:hidden'>
					<UserAvatar />
				</div>
				<div className='xl:hidden flex items-center'>
					<MobileNavbar />
				</div>
			</div>
		</header>
	);
};
export default Navbar;
