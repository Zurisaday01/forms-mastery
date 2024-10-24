'use client';

import ContentCard from '../content-card';
import QuestionResponseCard from './question-response-card';
import { Button } from '../ui/button';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useSession } from 'next-auth/react';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { useCallback, useEffect, useState, useTransition } from 'react';
import Spinner from '../spinner';
import {
	createForm,
	updateForm as updateFormAction,
} from '@/actions/form.actions';
import { useRouter } from 'next/navigation';
import { User } from '@prisma/client';
import { enUS, es } from 'date-fns/locale';
import { useLocale, useTranslations } from 'next-intl';
import { createFormSchema } from '@/schema';

interface MappedAnswer {
	questionId: string;
	answerType: string;
	answers: string[];
}

interface TemplateFormProps {
	templateId?: string;
	title: string;
	description: string;
	questions: Question[];
	isPreview?: boolean;
	updateForm?: boolean;
	answers?: MappedAnswer[];
	author?: User;
	isOwner?: boolean;
	responses?: Response[];
	formId?: string;
	modifiedBy?: string;
}

const TemplateForm = ({
	templateId,
	title,
	description,
	questions,
	isPreview,
	answers,
	updateForm,
	author,
	formId,
	responses,
	modifiedBy,
}: TemplateFormProps) => {
	const { toast } = useToast();
	const [isPending, startTransition] = useTransition();
	const { data: session, status } = useSession();
	const router = useRouter();
	const currentDate = new Date();
	const currentUser = author ? author : session?.user;

	const currentLocale = useLocale();
	const t = useTranslations('TemplateForm');
	const tFormValidation = useTranslations('FormSchemaValidation');
	const tToast = useTranslations('Toast');
	// Create the schema using the translation function
	const [FormSchema, setFormSchema] = useState(
		createFormSchema(tFormValidation)
	);

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			answers: updateForm
				? answers
				: questions.map(question => ({
						questionId: question.id,
						answerType: question.answerType,
						answers: [],
				  })),
		},
	});
	const updateSchema = useCallback(() => {
		setFormSchema(createFormSchema(tFormValidation)); // Create a new schema
		form.clearErrors(); // Clear existing errors to reflect new messages
	}, [tFormValidation, form]);

	// Update the schema when the translation function or locale changes
	useEffect(() => {
		updateSchema();
	}, [tFormValidation, currentLocale, updateSchema]);

	const onSubmit = (data: z.infer<typeof FormSchema>) => {
		if (!updateForm) {
			startTransition(async () => {
				try {
					const form = await createForm({
						userId: session?.user?.id as string,
						templateId: templateId!,
						answersData: data.answers,
					});

					if (form) {
						toast({
							title: tToast('formSubmittedTitle'),
						});

						// Redirect to the form response page
						router.push(`/forms/response?templateId=${templateId}`);
					}
				} catch (error: unknown) {
					toast({
						variant: 'destructive',
						title: 'Something went wrong!',
						description: (error as Error).message,
					});
				} finally {
					form.reset();
				}
			});
		} else {
			// Handle update
			startTransition(async () => {
				try {
					const form = await updateFormAction({
						formId: formId!,
						userId: currentUser?.id as string,
						templateId: templateId!,
						answersData: data.answers,
						responses: responses!,
					});

					if (form) {
						toast({
							title: tToast('formUpdatedTitle'),
						});

						if (modifiedBy === 'user') {
							router.push(`/templates/view/${templateId}`);
						} else {
							router.push(`/templates/manage/${templateId}`);
						}
					}
				} catch (error: unknown) {
					toast({
						variant: 'destructive',
						title: 'Something went wrong!',
						description: (error as Error).message,
					});
				} finally {
					form.reset();
				}
			});
		}
	};

	return (
		<div className='w-full max-w-[800px] mx-auto space-y-4'>
			<ContentCard type='info'>
				<h1 className='text-2xl font-barlow font-bold'>{title}</h1>
				<p className='text-gray-600'>{description}</p>

				<div className='mt-3 flex items-center justify-between'>
					{currentUser && status === 'authenticated' ? (
						<p className='text-blue-500'>
							{currentUser?.firstName} {currentUser?.lastName}
						</p>
					) : (
						<Skeleton className='w-[200px] h-[20px] rounded-full' />
					)}

					<p className='text-blue-500'>
						{format(currentDate, 'MMMM/dd/yyyy', {
							locale: currentLocale === 'es' ? es : enUS,
						})}
					</p>
				</div>
			</ContentCard>

			{questions.length === 0 && (
				<p className='text-gray-500'>{t('noQuestions')}</p>
			)}

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
					{questions.map((question, index) => (
						<FormField
							key={question.id}
							control={form.control}
							name={`answers.${index}`}
							render={({ field }) => {
								return (
									<FormItem>
										<QuestionResponseCard
											value={field.value}
											onChange={field.onChange}
											question={question}
										/>
										<FormMessage />
									</FormItem>
								);
							}}
						/>
					))}
					<div className='w-full'>
						<Button
							type='submit'
							disabled={isPreview || form.formState.isLoading || isPending}>
							{form.formState.isLoading || isPending ? (
								<Spinner className='h-5 w-5' />
							) : updateForm ? (
								t('updateButton')
							) : (
								t('submitButton')
							)}
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
};
export default TemplateForm;
