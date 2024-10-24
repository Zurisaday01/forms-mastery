'use client';

import * as React from 'react';
import { MoonIcon, SunIcon } from '@radix-ui/react-icons';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTranslations } from 'next-intl';
import { Check } from 'lucide-react';

export function ModeToggle() {
	const { setTheme, theme } = useTheme();
	const t = useTranslations('ModeToggle');

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant='outline' size='icon'>
					<SunIcon className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
					<MoonIcon className='absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end'>
				<DropdownMenuItem onClick={() => setTheme('light')}>
					<div className='mr-2 w-[1rem]'>
						{'light' === theme && <Check className='h-5 w-5 text-slate-600' />}
					</div>
					{t('light')}
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme('dark')}>
					<div className='mr-2 w-[1rem]'>
						{'dark' === theme && <Check className='h-5 w-5 text-slate-600' />}
					</div>
					{t('dark')}
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme('system')}>
					<div className='mr-2 w-[1rem]'>
						{'system' === theme && <Check className='h-5 w-5 text-slate-600' />}
					</div>
					{t('system')}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
