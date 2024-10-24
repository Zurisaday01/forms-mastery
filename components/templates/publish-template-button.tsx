'use client';
import { useTemplateContext } from '@/context/template-context';
import { Button } from '../ui/button';
import { createTemplate, updateTemplate } from '@/actions/template.actions';
import { toast } from '@/hooks/use-toast';
import { User } from 'next-auth';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';

import { useState, useTransition } from 'react';
import Spinner from '../spinner';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

interface PublishTemplateButtonProps {
	user: User | null;
	type?: 'create' | 'update';
	templateId?: string;
}

const PublishTemplateButton = ({
	user,
	type = 'create',
	templateId,
}: PublishTemplateButtonProps) => {
	const { title, description, tags, questions } = useTemplateContext();
	const t = useTranslations('PublishTemplateButton');
	const tToast = useTranslations('Toast');
	const [isOpen, setIsOpen] = useState(false);
	const [isOpenInvalidCriteria, setIsOpenInvalidCriteria] = useState(false);
	const [isPending, startTransition] = useTransition();
	const router = useRouter();
	// user is the session user, if the user is an admin or the author of the template, they can update it
	// but the author remains the user that created the template not the admin if it is different

	const handleValidate = () => {
		const templateErrors: string[] = [];
		const questionErrors: string[] = [];

		// General validation for the template
		if (!title) {
			templateErrors.push(t('errorMessage.title'));
		}
		if (!description) {
			templateErrors.push(t('errorMessage.description'));
		}
		if (!tags.length) {
			templateErrors.push(t('errorMessage.tag'));
		}
		if (!questions.length) {
			templateErrors.push(t('errorMessage.question'));
		}

		// Validate each question based on the provided rules
		questions.filter(question => {
			let isInvalid = false;
			// Check if the question has a title and description
			if (!question.title) {
				questionErrors.push(t('errorMessage.questionTitle'));
				isInvalid = true;
			}
			if (!question.description) {
				questionErrors.push(t('errorMessage.questionDescription'));
				isInvalid = true;
			}

			// If answerType is 'multiple-choice' or 'checkbox', ensure there are at least 2 options
			if (
				(question.answerType === 'multiple-choice' ||
					question.answerType === 'checkbox') &&
				(!question.options || question.options.length < 2)
			) {
				questionErrors.push(
					t('questionValidOptions', { title: question.title })
				);
				isInvalid = true;
			}

			// If the question is rated, ensure the correct answers are set
			if (
				question.isRated &&
				(question.answerType === 'multiple-choice' ||
					question.answerType === 'checkbox' ||
					question.answerType === 'number') &&
				(!question.correctAnswers || question.correctAnswers.length === 0)
			) {
				questionErrors.push(t('questionSetAnswer', { title: question.title }));
				console.log(
					t('errorMessage.questionSetAnswer', { title: question.title })
				);
				isInvalid = true;
			}

			return isInvalid;
		});

		if (templateErrors.length > 0 || questionErrors.length > 0) {
			const fullErrorMessage = [];

			if (templateErrors.length > 0) {
				fullErrorMessage.push(...templateErrors);
			}

			if (questionErrors.length > 0) {
				fullErrorMessage.push(...questionErrors);
			}

			toast({
				title: t('toastError'),
				description: (
					<div className='flex flex-col gap-1'>
						{fullErrorMessage.map((message, index) => (
							<p key={index}>{message}</p>
						))}
					</div>
				),
				variant: 'destructive',
				action: (
					<Button
						variant='ghost'
						onClick={() => setIsOpenInvalidCriteria(true)}>
						{t('toastMoreInfo')}
					</Button>
				),
			});
			return; // Exit the function if there are errors
		}

		setIsOpen(true);
	};

	const handleCreate = () => {
		startTransition(async () => {
			try {
				await createTemplate({
					title,
					description,
					tags,
					questions,
					authorId: user?.id || '',
				});

				toast({
					title: tToast('templateCreatedSuccessTitle'),
				});
				// redirect to the home page
				router.push('/');
			} catch (error: unknown) {
				console.error(error);
				toast({
					title: tToast('errorTitle'),
					variant: 'destructive',
				});
			}
		});
	};

	const handleUpdate = () => {
		startTransition(async () => {
			try {
				await updateTemplate({
					templateId: templateId as string,
					title,
					description,
					tags,
					questions,
				});

				toast({
					title: tToast('templateUpdatedSuccessTitle'),
				});

				setIsOpen(false);
			} catch (error: unknown) {
				console.error(error);
				toast({
					title: tToast('errorTitle'),
					variant: 'destructive',
				});
			}
		});
	};

	return (
		<>
			<AlertDialog open={isOpen}>
				<AlertDialogTrigger asChild>
					<Button
						className='bg-blue-500 dark:text-white hover:bg-blue-500/80'
						onClick={handleValidate}>
						{t('publishButton')}
					</Button>
				</AlertDialogTrigger>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle className='font-barlow text-2xl'>
							{t('dialogTitle')}
						</AlertDialogTitle>
						<AlertDialogDescription>
							{t('dialogDescription')}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel
							onClick={() => setIsOpen(false)}
							disabled={isPending}>
							{t('cancelButton')}
						</AlertDialogCancel>
						<AlertDialogAction
							className='flex justify-center items-center'
							onClick={type === 'create' ? handleCreate : handleUpdate}
							disabled={isPending}>
							{isPending ? (
								<Spinner className='h-5 w-5' />
							) : (
								t('continueButton')
							)}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			<Dialog
				open={isOpenInvalidCriteria}
				onOpenChange={() => setIsOpenInvalidCriteria(false)}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle className='text-2xl font-barlow'>
							{t('dialogMoreInfoTitle')}
						</DialogTitle>
						<DialogDescription>
							{t('dialogMoreInfoDescription')}
						</DialogDescription>
						<div>
							<p className='font-bold mb-2'>
								{t('dialogMoreInfoCriteriaBody')}
							</p>
							<ul className='flex flex-col gap-1'>
								<li>{t('dialogMoreInfoCriteria1')}</li>
								<li>{t('dialogMoreInfoCriteria2')}</li>
								<li>{t('dialogMoreInfoCriteria3')}</li>
								<li>{t('dialogMoreInfoCriteria4')}</li>
							</ul>
						</div>
					</DialogHeader>
				</DialogContent>
			</Dialog>
		</>
	);
};
export default PublishTemplateButton;
