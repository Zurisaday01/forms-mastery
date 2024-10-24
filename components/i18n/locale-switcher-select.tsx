'use client';

import { useTransition } from 'react';
import { Locale } from '@/i18n/config';
import { setUserLocale } from '@/services/locale';
import { Languages, Check } from 'lucide-react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '../ui/button';

type Props = {
	defaultValue: string;
	items: Array<{ value: string; label: string }>;
	label: string;
};

export default function LocaleSwitcherSelect({
	defaultValue,
	items,
	label,
}: Props) {
	const [isPending, startTransition] = useTransition();

	function onChange(value: string) {
		const locale = value as Locale;
		startTransition(() => {
			setUserLocale(locale);
		});
	}

	return (
		<div className='relative'>
			<DropdownMenu>
				<DropdownMenuTrigger aria-label={label} asChild>
					<Button variant='outline' size='icon' disabled={isPending}>
						<Languages className='h-6 w-6 text-slate-600 dark:text-white transition-colors group-hover:text-slate-900' />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align='end'>
					{items.map(item => (
						<DropdownMenuItem
							key={item.value}
							onClick={() => onChange(item.value)}>
							<div className='mr-2 w-[1rem]'>
								{item.value === defaultValue && (
									<Check className='h-5 w-5 text-slate-600' />
								)}
							</div>
							{item.label}
						</DropdownMenuItem>
					))}
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
