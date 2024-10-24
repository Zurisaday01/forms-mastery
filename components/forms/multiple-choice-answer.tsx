'use client';

import { FormControl, FormItem, FormLabel } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface MultipleChoiceAnswerProps {
	options: AnswerOption[];
	value: string[];
	onChange: (value: string) => void;
}
const MultipleChoiceAnswer = ({
	options,
	value,
	onChange,
}: MultipleChoiceAnswerProps) => {
	return (
		<FormItem>
			<FormControl>
				<RadioGroup
					onValueChange={onChange}
					value={value?.length > 0 ? value[0] : ''}
					className='flex flex-col space-y-1'>
					{options.map(option => (
						<FormItem
							key={option.id}
							className='flex items-center space-x-3 space-y-0'>
							<FormControl>
								<RadioGroupItem value={option.label} />
							</FormControl>
							<FormLabel className='font-normal'>{option.label}</FormLabel>
						</FormItem>
					))}
				</RadioGroup>
			</FormControl>
		</FormItem>
	);
};

export default MultipleChoiceAnswer;
