'use client';
import { getAnswerCounts } from '@/lib/utils';
import SimpleBar from './simple-bar';
import { Checkbox } from '@/components/ui/checkbox';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface DisplayShortAnswerProps {
	answers: Answer[];
}

const DisplayShortAnswers = ({ answers }: DisplayShortAnswerProps) => {
	const [checked, setChecked] = useState(false);

	const t = useTranslations('DisplayShortAnswers');

	return (
		<div>
			<div className='flex gap-3'>
				<Checkbox
					checked={checked}
					onCheckedChange={() => setChecked(prev => !prev)}
					disabled={answers.length === 0}
					id='bar'
				/>
				<label
					htmlFor='bar'
					className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
					{t('displayBarQuestion')}
				</label>
			</div>

			{checked ? (
				<div className='h-[400px] w-full'>
					<SimpleBar data={getAnswerCounts(answers)} />
				</div>
			) : (
				<ul className='flex gap-2 flex-col mt-3'>
					{answers.map((answer: Answer) => {
						return (
							<li
								key={answer.id}
								className='flex flex-col gap-3 bg-blue-100 rounded-sm p-2'>
								{answer.answers.map((item, index) => {
									return <p key={`${answer.id}${index}`}>{item}</p>;
								})}
							</li>
						);
					})}
				</ul>
			)}
		</div>
	);
};
export default DisplayShortAnswers;
