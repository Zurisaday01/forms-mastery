'use client';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import MultipleChoiceAnswer from './multiple-choice-answer';
import { CheckboxAnswer } from './checkbox-answer';
import { Badge } from '@/components/ui/badge';
import { convertToKebabCase } from '@/lib/utils';
import { FormControl } from '../ui/form';
import React, { memo, useCallback } from 'react';
import { useTranslations } from 'next-intl';

interface ControllerAnswer {
	answers: string[];
	questionId: string;
	answerType: string;
}

interface QuestionResponseCardProps {
	question: Question;
	value: ControllerAnswer;
	onChange: (arg0: ControllerAnswer) => void;
}

const QuestionResponseCard = memo(
	({ question, value, onChange }: QuestionResponseCardProps) => {
		const { description, title, answerType, isRated, options } = question;

		const t = useTranslations('QuestionResponseCard');

		const handleChangeSingleAnswer = useCallback(
			(
				e:
					| React.ChangeEvent<HTMLInputElement>
					| React.ChangeEvent<HTMLTextAreaElement>
			) => {
				onChange({
					questionId: question.id,
					answerType: question.answerType,
					answers: [e.target.value], // Update the answers array with the new value
				});
			},
			[onChange, question.id, question.answerType]
		);

		const handleChangeMultipleAnswer = (
			answersValue: string[],
			label: string
		) => {
			// Get current answers
			const currentAnswers = answersValue || [];

			// Toggle the answer: add if not present, remove if present
			const updatedAnswers = currentAnswers.includes(label)
				? currentAnswers.filter(answer => answer !== label) // Remove if already selected
				: [...currentAnswers, label]; // Add if not selected

			// Update the field value
			onChange({
				questionId: question.id,
				answerType: question.answerType,
				answers: updatedAnswers, // Update the answers array
			});
		};

		const handleChangeMultipleChoice = (selectedValue: string) => {
			// Update the field value with the selected option
			onChange({
				questionId: question.id,
				answerType: question.answerType,
				answers: [selectedValue], // Update the answers array with the selected value
			});
		};

		return (
			<div className='relative border border-primary/30 rounded-md flex flex-col gap-3 p-4 border-b border-b-primary/30  shadow-sm transition-border duration-150'>
				<header className='flex flex-col gap-2'>
					<div className='flex flex-col-reverse items-start md:flex-row md:items-center justify-between'>
						<h2 className='font-barlow text-xl font-bold'>
							{title ? title : t('noTitle')}
						</h2>
						{isRated && (
							<Badge className='bg-blue-500 text-white self-end md:self-center hover:bg-blue-500'>
								{t('ratedBadge')}
							</Badge>
						)}
					</div>
					<p className='text-sm text-gray-600'>{description}</p>
				</header>
				<div className='mt-2'>
					{answerType === 'short' && (
						<FormControl>
							<Input
								key={question.id}
								type='text'
								className='focus-visible:ring-0 border-t-0 border-x-0 rounded-none border-b-2 focus-visible:border-blue-500'
								placeholder={t('answerPlaceholder')}
								value={(value as ControllerAnswer)?.answers?.[0] || ''}
								onChange={handleChangeSingleAnswer}
							/>
						</FormControl>
					)}

					{answerType === 'long' && (
						<FormControl>
							<Textarea
								key={question.id}
								className='focus-visible:ring-0 border-t-0 border-x-0 rounded-none border-b-2 focus-visible:border-blue-500'
								placeholder={t('answerPlaceholder')}
								value={(value as ControllerAnswer)?.answers?.[0] || ''}
								onChange={handleChangeSingleAnswer}
							/>
						</FormControl>
					)}

					{answerType === 'number' && (
						<FormControl>
							<Input
								key={question.id}
								type='number'
								className='focus-visible:ring-0 border-t-0 border-x-0 rounded-none border-b-2 focus-visible:border-blue-500'
								placeholder={t('answerPlaceholder')}
								value={(value as ControllerAnswer)?.answers?.[0] || ''}
								onChange={handleChangeSingleAnswer}
							/>
						</FormControl>
					)}

					{convertToKebabCase(answerType) === 'multiple-choice' && (
						<MultipleChoiceAnswer
							options={options}
							value={(value as ControllerAnswer)?.answers}
							onChange={handleChangeMultipleChoice}
						/>
					)}

					{answerType === 'checkbox' && (
						<CheckboxAnswer
							options={options}
							value={(value as ControllerAnswer)?.answers}
							onChange={handleChangeMultipleAnswer}
						/>
					)}
				</div>
			</div>
		);
	}
);

QuestionResponseCard.displayName = 'QuestionResponseCard';

export default QuestionResponseCard;
