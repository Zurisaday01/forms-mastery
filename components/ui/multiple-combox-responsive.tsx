'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';

interface Option {
	label: string;
	value: string;
}

interface MultipleComboxProps {
	options: Option[];
	searchFor: string;
	onAdd: React.Dispatch<React.SetStateAction<string[]>>;
	data: string[];
}

import { useMediaQuery } from '@/hooks/use-media-query';
import { Button } from '@/components/ui/button';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { useTranslations } from 'next-intl';

export function MultipleCombox({
	options,
	searchFor,
	onAdd,
	data,
}: MultipleComboxProps) {
	const [open, setOpen] = React.useState(false);
	const isDesktop = useMediaQuery('(min-width: 768px)');
	const [value, setValue] = React.useState<string[]>(data);

	const t = useTranslations('MultipleCombox');

	// Sync value with data prop when it changes
	React.useEffect(() => {
		setValue(data); // Update value whenever data changes
	}, [data]);

	const handleSetValue = (val: string) => {
		if (value.includes(val)) {
			value.splice(value.indexOf(val), 1);
			setValue(value.filter(item => item !== val));
			onAdd(value.filter(item => item !== val));
		} else {
			setValue(prevValue => [...prevValue, val]);
			onAdd(prevValue => [...prevValue, val]);
		}
	};

	if (isDesktop) {
		return (
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						variant='outline'
						role='combobox'
						aria-expanded={open}
						className='w-full h-max max-w-[480px] justify-between'>
						<div className='flex flex-wrap gap-2 justify-start'>
							{value?.length
								? value.map((val, i) => (
										<div
											key={i}
											className='px-2 py-1 rounded-xl border bg-slate-200 text-xs font-medium'>
											{options.find(option => option.value === val)?.label}
										</div>
								  ))
								: t('placeholder', { searchFor })}
						</div>
						<ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
					</Button>
				</PopoverTrigger>
				<PopoverContent className='w-[200px] p-0' align='start'>
					<StatusList
						searchPlaceholder={t('searchPlaceholder')}
						labelEmpty={t('noFound')}
						handleSetValue={handleSetValue}
						options={options}
						value={value}
					/>
				</PopoverContent>
			</Popover>
		);
	}

	return (
		<Drawer open={open} onOpenChange={setOpen}>
			<DrawerTrigger asChild>
				<Button
					variant='outline'
					role='combobox'
					aria-expanded={open}
					className='w-full h-max max-w-[480px] justify-between'>
					<div className='flex flex-wrap gap-2 justify-start'>
						{value?.length
							? value.map((val, i) => (
									<div
										key={i}
										className='px-2 py-1 rounded-xl border bg-slate-200 text-xs font-medium'>
										{options.find(option => option.value === val)?.label}
									</div>
							  ))
							: t('placeholder', { searchFor })}
					</div>
					<ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
				</Button>
			</DrawerTrigger>
			<DrawerContent>
				<div className='mt-4 border-t'>
					<StatusList
						searchPlaceholder={t('searchPlaceholder')}
						labelEmpty={t('noFound')}
						handleSetValue={handleSetValue}
						options={options}
						value={value}
					/>
				</div>
			</DrawerContent>
		</Drawer>
	);
}

function StatusList({
	searchPlaceholder,
	labelEmpty,
	handleSetValue,
	options,
	value,
}: {
	searchPlaceholder: string;
	labelEmpty: string;
	handleSetValue: (val: string) => void;
	options: Option[];
	value: string[];
}) {
	return (
		<Command
			className='data-[disabled]:pointer-events-none data-[disabled]:opacity-50
'>
			<CommandInput placeholder={searchPlaceholder} />
			<CommandEmpty className='px-3 text-sm'>{labelEmpty}</CommandEmpty>
			<CommandGroup>
				<CommandList>
					{options.map(option => (
						<CommandItem
							key={option.value}
							value={option.value}
							onSelect={() => {
								handleSetValue(option.value);
							}}>
							<Check
								className={cn(
									'mr-2 h-4 w-4',
									value.includes(option.value) ? 'opacity-100' : 'opacity-0'
								)}
							/>
							{option.label}
						</CommandItem>
					))}
				</CommandList>
			</CommandGroup>
		</Command>
	);
}
