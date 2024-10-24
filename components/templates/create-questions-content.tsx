'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import ContentCard from '../content-card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import QuestionCard from './question-card';
import { Button } from '../ui/button';
import { generateUniqueId } from '@/lib/utils';
import { limitQuestionTypes } from '@/constants';
import { useToast } from '@/hooks/use-toast';
import { useTemplateContext } from '@/context/template-context';
// drag and drop
import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
	DragEndEvent,
} from '@dnd-kit/core';
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import {
	restrictToVerticalAxis,
	restrictToParentElement,
} from '@dnd-kit/modifiers';
import { useLocale, useTranslations } from 'next-intl';

const CreateQuestionsContent = () => {
	const t = useTranslations('CreateQuestionsContent');
	const tToast = useTranslations('Toast');
	const currentLocale = useLocale();
	const { toast } = useToast();
	const {
		title,
		setTitle,
		description,
		setDescription,
		questions,
		setQuestions,
	} = useTemplateContext();
	const [selectedCard, setSelectedCard] = useState('info');

	const titleRef = useRef<null | HTMLInputElement>(null);

	useEffect(() => {
		titleRef.current?.focus(); // Focus the title input when the component mounts or updates
	}, [title]);

	// drag and drop
	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;

		if (active?.id !== over?.id) {
			setQuestions(prevItems => {
				const oldIndex = prevItems.findIndex(item => item.id === active.id);
				const newIndex = prevItems.findIndex(item => item.id === over?.id);

				return arrayMove(prevItems, oldIndex, newIndex);
			});
		}
	};

	const handleCardClick = (cardId: string) => {
		setSelectedCard(cardId);
	};

	const createNewQuestion = (id: string) => ({
		id: id,
		templateId: '',
		isVisible: true,
		isRated: false,
		title: '',
		description: '',
		answerType: 'short',
		options: [],
		correctAnswers: [],
		answers: [],
	});

	const handleAddQuestion = () => {
		// Count the current number of each question type
		const typeCounts = questions.reduce((acc: { [key: string]: number }, q) => {
			acc[q.answerType] = (acc[q.answerType] || 0) + 1;
			return acc;
		}, {});

		const currentType = 'short'; // Default type
		const currentTypeLabel =
			currentLocale === 'es'
				? 'preguntas de respuesta corta'
				: 'short answer questions'; // Default type

		if (typeCounts[currentType] >= limitQuestionTypes[currentType]) {
			toast({
				variant: 'destructive',
				title: tToast('errorAddQuestionTitle', {
					number: limitQuestionTypes[currentType],
					label: currentTypeLabel,
				}),
			});

			return;
		}
		const newQuestion = createNewQuestion(generateUniqueId());
		setQuestions([...questions, newQuestion]);
	};

	const handleDeleteQuestion = (id: string) => {
		const newQuestions = questions.filter(question => question.id !== id);
		setQuestions(newQuestions);
	};

	const handleQuestionChange = useCallback(
		(updatedQuestion: Question, index: number) => {
			setQuestions(prevQuestions => {
				const newQuestions = [...prevQuestions];
				newQuestions[index] = updatedQuestion;
				return newQuestions;
			});
		},
		[setQuestions]
	);

	return (
		<div className='lg:w-[800px] mx-auto space-y-4'>
			<ContentCard
				key='info'
				type='info'
				isSelected={selectedCard === 'info'}
				onClick={() => handleCardClick('info')}>
				<Input
					ref={titleRef}
					key='title-input'
					placeholder={t('titlePlaceholder')}
					type='text'
					className='text-2xl focus-visible:ring-0 border-t-0 border-x-0 rounded-none border-b-2 focus-visible:border-blue-500'
					value={title}
					onChange={e => setTitle(e.target.value)}
				/>
				<Textarea
					className='focus-visible:ring-0 border-t-0 border-x-0 rounded-none border-b-2 focus-visible:border-blue-500'
					placeholder={t('descriptionPlaceholder')}
					value={description}
					onChange={e => setDescription(e.target.value)}
				/>
			</ContentCard>
			<div className='space-y-4'>
				<DndContext
					sensors={sensors}
					collisionDetection={closestCenter}
					onDragEnd={handleDragEnd}
					modifiers={[restrictToVerticalAxis, restrictToParentElement]}>
					<SortableContext
						items={questions}
						strategy={verticalListSortingStrategy}>
						{questions.map((question, index) => (
							<ContentCard
								key={question.id}
								id={question.id}
								isSelected={selectedCard === question.id}
								usage='create'
								onClick={() => handleCardClick(question.id)}>
								<QuestionCard
									questions={questions}
									isSelected={selectedCard === question.id}
									key={question.id}
									question={question}
									onDelete={() => handleDeleteQuestion(question.id)}
									onDeleteDisabled={questions.length === 1}
									onChange={updatedQuestion =>
										handleQuestionChange(updatedQuestion, index)
									}
								/>
							</ContentCard>
						))}
					</SortableContext>
				</DndContext>
			</div>
			<div className='w-full flex gap-4 justify-between'>
				<Button onClick={handleAddQuestion}>{t('addQuestionButton')}</Button>
			</div>
		</div>
	);
};
export default CreateQuestionsContent;
