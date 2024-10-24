'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { FormControl, FormItem, FormLabel } from '@/components/ui/form';

interface CheckboxAnswerProps {
	options: AnswerOption[];
	value: string[];
	onChange: (answersValue: string[], label: string) => void;
}

export function CheckboxAnswer({
	options,
	value,
	onChange,
}: CheckboxAnswerProps) {
	return (
		<FormItem>
			{options.map(option => (
				<FormControl
					key={option.id}
					className='flex flex-row items-start space-x-3 space-y-0'>
					<div className='flex items-center'>
						<Checkbox
							checked={value?.includes(option.label)} // Check if the label is in the array
							value={option.label}
							onCheckedChange={() => onChange(value, option.label)}
						/>
						<FormLabel className='text-sm font-normal'>
							{option.label}
						</FormLabel>
					</div>
				</FormControl>
			))}
		</FormItem>
	);
}
