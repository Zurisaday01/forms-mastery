'use client';

import {  useState } from 'react';
import { Check, X } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { generateUniqueId } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface MultipleChoiceQuestionProps {
	multipleChoiceOptions: AnswerOption[];
	setMultipleChoiceOptions: React.Dispatch<
		React.SetStateAction<AnswerOption[]>
	>;
	question: Question;
	onChange: (question: Question) => void;
	correctAnswers: string[];
	setCorrectAnswers: React.Dispatch<React.SetStateAction<string[]>>;
}

const MultipleChoiceQuestion = ({
	multipleChoiceOptions,
	setMultipleChoiceOptions,
	question,
	onChange,
	correctAnswers,
	setCorrectAnswers,
}: MultipleChoiceQuestionProps) => {
	const { toast } = useToast();
	const [isAnswerReady, setIsAnswerReady] = useState(false);
	const [newOption, setNewOption] = useState('');
	const [isAddOptionVisible, setIsAddOptionVisible] = useState(false);
	const [optionBeingEdited, setOptionBeingEdited] =
		useState<AnswerOption | null>(null);

	const handleAddOption = () => {
		// if the new option is empty
		if (newOption === '') {
			// hide the input
			setIsAddOptionVisible(false);

			return;
		}

		// if the new option already exists (the label is the same)
		if (
			multipleChoiceOptions.some(
				option => option.label.trim() === newOption.trim()
			)
		) {
			toast({
				variant: 'destructive',
				title:
					'⚠️ Option already exists. You cannot add the same label another option has already. 🚨',
			});
			return;
		}

		// add the new option
		setMultipleChoiceOptions(prev => [
			...prev,
			{ id: generateUniqueId(), label: newOption.trim() },
		]);

		// clear the input
		setNewOption('');

		// hide the input
		setIsAddOptionVisible(false);
	};

	const handleSetCorrectAnswer = (option: AnswerOption) => {
		if (correctAnswers.includes(option.label)) {
			setCorrectAnswers(prev => prev.filter(answer => answer !== option.label));
		} else {
			if (correctAnswers.length < 1) {
				setCorrectAnswers(prev => [...prev, option.label]);
				onChange({ ...question, correctAnswers });
			}
		}
	};

	const handleUpdateLabelOption = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!optionBeingEdited) return;

		const newLabel = e.target?.value; // Get the new value from the input

		setOptionBeingEdited(prev => {
			if (!prev) return null;

			return {
				...prev,
				label: newLabel,
			};
		});
	};


	const handleSubmitUpdateOption = (label: string) => {
		if (correctAnswers.includes(label)) {
			setCorrectAnswers([]);
			onChange({ ...question, correctAnswers: [] });
		}

		// get the option from the original list
		const currentOption = multipleChoiceOptions.find(
			option => option.id === optionBeingEdited?.id
		);

		// if the label is the same as the original
		if (currentOption?.label.trim() === optionBeingEdited?.label.trim()) {
			return;
		}

		// if the option already exists (the label is the same)
		if (
			multipleChoiceOptions.find(
				option => option.label.trim() === optionBeingEdited?.label.trim()
			)
		) {
			toast({
				variant: 'destructive',
				title:
					'⚠️ Option already exists. You cannot add the same label another option has already. Try again 🚨',
			});

			return;
		}

		const updatedOptions = multipleChoiceOptions.map(opt => {
			if (opt.id === optionBeingEdited?.id) {
				return {
					...opt,
					label: optionBeingEdited?.label,
				};
			}
			return opt;
		});

		setMultipleChoiceOptions(updatedOptions);
	};

	const handleDeleteOption = (option: AnswerOption) => {
		// remove the option from the list
		const updatedOptions = multipleChoiceOptions.filter(
			opt => opt.id !== option.id
		);
		// remove the option from the correct answers
		if (correctAnswers.includes(option.label))
			setCorrectAnswers(prev => prev.filter(answer => answer !== option.label));

		// update the state
		setMultipleChoiceOptions(updatedOptions);
	};

	return (
		<div>
			<div className='flex flex-col gap-3'>
				<RadioGroup>
					{multipleChoiceOptions.map(option => (
						<div
							key={option.id}
							className='flex gap-3 justify-between items-center'>
							<div className='flex items-center space-x-2 w-full'>
								<RadioGroupItem
									key={option.id}
									checked={correctAnswers.includes(option.label)}
									disabled
									value={option.id}
									id={option.id}
								/>
								{option.id !== optionBeingEdited?.id && (
									<Label htmlFor={option.id}>{option.label}</Label>
								)}

								{optionBeingEdited?.id === option.id && (
									<Input
										type='text'
										value={optionBeingEdited.label}
										className='focus-visible:ring-0 border-t-0 border-x-0 rounded-none border-b-2 focus-visible:border-blue-500'
										onChange={handleUpdateLabelOption}
									/>
								)}
							</div>

							{!isAnswerReady && (
								<div className='flex items-center gap-3'>
									<Button
										onClick={() => {
											// if the option is being edited and it is done
											if (optionBeingEdited?.id === option.id) {
												handleSubmitUpdateOption(option.label);
											}

											// set the option being edited
											setOptionBeingEdited(prev =>
												option.id === prev?.id ? null : option
											);
										}}
										className='text-blue-500'
										variant='link'>
										{optionBeingEdited?.id === option.id ? 'Done' : 'Edit'}
									</Button>

									{multipleChoiceOptions.length > 1 && (
										<Button
											variant='ghost'
											onClick={() => handleDeleteOption(option)}>
											<X className='w-4' />
										</Button>
									)}
								</div>
							)}

							{isAnswerReady && question.isRated && (
								<Button
									variant='secondary'
									className={`p-2 w-8 h-8 rounded-full ${
										correctAnswers.includes(option.label)
											? 'bg-blue-500 hover:bg-blue-400'
											: ''
									}`}
									onClick={() => handleSetCorrectAnswer(option)}>
									<Check
										className={`${
											correctAnswers.includes(option.label)
												? 'text-white'
												: 'text-blue-500'
										}`}
									/>
								</Button>
							)}
						</div>
					))}
				</RadioGroup>

				{isAddOptionVisible && (
					<Input
						type='text'
						value={newOption}
						onChange={e => setNewOption(e.target.value)}
						onBlur={handleAddOption}
					/>
				)}
			</div>
			<Button
				variant='link'
				className='text-blue-500'
				onClick={() => setIsAddOptionVisible(true)}>
				Add option
			</Button>
			{question.isRated && (
				<Button
					variant='link'
					className='text-blue-500'
					onClick={() => {
						setIsAnswerReady(prev => !prev);
					}}>
					{isAnswerReady ? 'Done' : 'Set correct answer'}
				</Button>
			)}
		</div>
	);
};
export default MultipleChoiceQuestion;
