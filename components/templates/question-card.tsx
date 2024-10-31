'use client';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

import { Input } from '@/components/ui/input';
import { limitQuestionTypes, questionTypes } from '@/constants';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Trash2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import MultipleChoiceQuestion from './multiple-choice-question';
import { Textarea } from '../ui/textarea';
import CheckboxesQuestion from './checkboxes-question';
import { useToast } from '@/hooks/use-toast';
import { useLocale, useTranslations } from 'next-intl';

interface QuestionCardProps {
	isSelected: boolean;
	question: Question;
	questions: Question[];
	onChange: (question: Question) => void;
	onDeleteDisabled: boolean;
	onDelete: () => void;
}

const noRatedTypes = ['long', 'short'];

const QuestionCard = ({
	isSelected,
	question,
	questions,
	onChange,
	onDelete,
	onDeleteDisabled,
}: QuestionCardProps) => {
	const { toast } = useToast();
	const [title, setTitle] = useState(question.title);
	const [description, setDescription] = useState(question.description);
	const [questionType, setQuestionType] = useState(question.answerType);
	const [isVisible, setIsVisible] = useState(question.isVisible);
	const [isRated, setIsRated] = useState(question.isRated);

	const t = useTranslations('QuestionCard');
	const currentLocale = useLocale();

	// answer short answer question
	const [shortAnswer, setShortAnswer] = useState('');

	// answer long answer question
	const [longAnswer, setLongAnswer] = useState('');

	// answer number question - will be in the correctAnswers array
	const [numberAnswer, setNumberAnswer] = useState<string[]>(
		question.correctAnswers
	);

	// answer multiple choice question - options array
	const [multipleChoiceOptions, setMultipleChoiceOptions] = useState<
		AnswerOption[]
	>(question.options);

	const [correctAnswersMultiple, setCorrectAnswersMultiple] = useState<
		string[]
	>([]);

	// answer checkboxes question - options array
	const [checkboxesOptions, setCheckboxesOptions] = useState<AnswerOption[]>(
		question.options
	);

	const [correctAnswersCheckboxes, setCorrectAnswersCheckboxes] = useState<
		string[]
	>([]);

	const handleTitleChange = (value: string) => {
		setTitle(value);
		// Update title in the original question
		onChange({ ...question, title: value });
	};

	const handleDescriptionChange = (value: string) => {
		setDescription(value);
		// Update description in the original question
		onChange({ ...question, description: value });
	};

	const handleIsVisibleChange = (checked: boolean) => {
		setIsVisible(checked);
		// Update description in the original question
		onChange({ ...question, isVisible: checked });
	};

	const handleIsRatedChange = (checked: boolean) => {
		const possibleRatedTypes = ['multiple-choice', 'checkbox', 'number'];
		if (!checked && possibleRatedTypes.includes(questionType)) {
			onChange({ ...question, correctAnswers: [] });
		}

		if (checked && 'number') {
			onChange({ ...question, correctAnswers: numberAnswer });
		}

		if (!checked && 'multiple-choice') {
			setCorrectAnswersMultiple([]);
			onChange({ ...question, correctAnswers: correctAnswersMultiple });
		}

		setIsRated(checked);

		onChange({ ...question, isRated: checked });
	};

	const handleQuestionTypeChange = (value: string) => {
		const typeCounts = questions.reduce((acc: { [key: string]: number }, q) => {
			acc[q.answerType] = (acc[q.answerType] || 0) + 1;
			return acc;
		}, {});

		if (
			typeCounts[value] >=
			limitQuestionTypes[value as keyof typeof limitQuestionTypes]
		) {
			toast({
				variant: 'destructive',
				title: `You can only add up to ${
					limitQuestionTypes[value as keyof typeof limitQuestionTypes]
				} ${value} answer questions.`,
			});

			return;
		}

		const possibleRatedTypes = ['multiple-choice', 'checkbox', 'number'];
		setQuestionType(value);

		// update the state of is rated
		if (possibleRatedTypes.includes(value)) {
			setIsRated(true);
		} else {
			setIsRated(false);
		}

		// Update question type in the original question and reset the options and correct answers
		onChange({
			...question,
			answerType: value,
			options:
				value === 'multiple-choice'
					? multipleChoiceOptions
					: value === 'checkbox'
					? checkboxesOptions
					: [],
			correctAnswers: [],
			isRated: possibleRatedTypes.includes(value),
		});

		// Reset the answer states
		setShortAnswer('');
		setLongAnswer('');
		setNumberAnswer([]);
	};

	const handleNumberChange = (value: string) => {
		// Update the first index in the numberAnswer array
		const updatedAnswers = [value]; // Ensure it's a single value in an array
		setNumberAnswer(updatedAnswers);
		if (isRated) {
			// Notify parent of the updated answers
			onChange({ ...question, correctAnswers: updatedAnswers });
		}
	};

	useEffect(() => {
		// if the correct answer is modified
		onChange({ ...question, correctAnswers: correctAnswersMultiple });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [correctAnswersMultiple]);

	useEffect(() => {
		// if the options are modified
		onChange({ ...question, options: multipleChoiceOptions });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [multipleChoiceOptions]);

	useEffect(() => {
		// if the correct answer is modified
		onChange({ ...question, correctAnswers: correctAnswersCheckboxes });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [correctAnswersCheckboxes]);

	useEffect(() => {
		// if the options are modified
		onChange({ ...question, options: checkboxesOptions });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [checkboxesOptions]);

	if (!isSelected) {
		return (
			<div className='flex flex-col gap-4'>
				<Input
					type='text'
					className='focus-visible:ring-0 border-t-0 border-x-0 rounded-none border-b-2 focus-visible:border-blue-500'
					placeholder={t('questionPlaceholder')}
					value={title}
					onChange={e => handleTitleChange(e.target.value)}
				/>
				<p className='text-sm text-muted-foreground'>{description}</p>
				<div className='text-primary/80'>
					{
						questionTypes.filter(type => type.value === questionType)[0]?.label[
							currentLocale as keyof (typeof questionTypes)[0]['label']
						]
					}
				</div>
			</div>
		);
	}
	return (
		<div className='flex flex-col gap-4'>
			<div className='flex gap-4'>
				<Input
					type='text'
					className='focus-visible:ring-0 border-t-0 border-x-0 rounded-none border-b-2 focus-visible:border-blue-500'
					placeholder={t('questionPlaceholder')}
					value={title}
					onChange={e => handleTitleChange(e.target.value)}
				/>
				<Select
					value={questionType}
					onValueChange={(value: string) => handleQuestionTypeChange(value)}>
					<SelectTrigger className='w-[180px] focus:ring-0 ring-0 outline-none'>
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{questionTypes.map(type => (
							<SelectItem key={type.value} value={type.value}>
								{
									type.label[
										currentLocale as keyof (typeof questionTypes)[0]['label']
									]
								}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<Textarea
				className='focus-visible:ring-0 border-t-0 border-x-0 rounded-none border-b-2 focus-visible:border-blue-500'
				placeholder={t('descriptionPlaceholder')}
				value={description}
				onChange={e => handleDescriptionChange(e.target.value)}
			/>

			{questionType === 'short' && (
				<Input
					type='text'
					className='focus-visible:ring-0 border-t-0 border-x-0 rounded-none border-b-2 focus-visible:border-blue-500'
					placeholder={t('shortAnswerPlaceholder')}
					value={shortAnswer}
					onChange={e => setShortAnswer(e.target.value)}
					disabled
				/>
			)}

			{questionType === 'long' && (
				<Textarea
					className='focus-visible:ring-0 border-t-0 border-x-0 rounded-none border-b-2 focus-visible:border-blue-500'
					placeholder={t('longAnswerPlaceholder')}
					value={longAnswer}
					disabled
					onChange={e => setLongAnswer(e.target.value)}
				/>
			)}

			{questionType === 'number' && (
				<Input
					type='number'
					className='focus-visible:ring-0 border-t-0 border-x-0 rounded-none border-b-2 focus-visible:border-blue-500'
					placeholder={t('numberAnswerPlaceholder')}
					value={numberAnswer[0]}
					onChange={e => handleNumberChange(e.target.value)}
				/>
			)}

			{questionType === 'multiple-choice' && (
				<MultipleChoiceQuestion
					multipleChoiceOptions={multipleChoiceOptions}
					setMultipleChoiceOptions={setMultipleChoiceOptions}
					question={question}
					onChange={onChange}
					correctAnswers={correctAnswersMultiple}
					setCorrectAnswers={setCorrectAnswersMultiple}
				/>
			)}

			{questionType === 'checkbox' && (
				<CheckboxesQuestion
					checkboxesOptions={checkboxesOptions}
					setCheckboxesOptions={setCheckboxesOptions}
					question={question}
					onChange={onChange}
					correctAnswers={correctAnswersCheckboxes}
					setCorrectAnswers={setCorrectAnswersCheckboxes}
				/>
			)}

			<div className='flex items-center gap-3 justify-end'>
				<Button variant='ghost' onClick={onDelete} disabled={onDeleteDisabled}>
					<Trash2 className='w-5' />
				</Button>

				<div className='h-[25px] block w-0.5 bg-gray-200'></div>
				<div className='flex items-center gap-2'>
					<p className='text-sm'>{t('summarySwitch')}</p>
					<Switch checked={isVisible} onCheckedChange={handleIsVisibleChange} />
				</div>
				<div className='h-[25px] block w-0.5 bg-gray-200'></div>
				<div className='flex gap-2'>
					<p className='text-sm'>{t('ratingSwitch')}</p>
					<Switch
						checked={isRated}
						disabled={noRatedTypes.includes(questionType)}
						onCheckedChange={handleIsRatedChange}
					/>
				</div>
			</div>
		</div>
	);
};
export default QuestionCard;
