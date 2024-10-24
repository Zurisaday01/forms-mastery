'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { createUpdateCommentSchema } from '@/schema';
import { useCallback, useEffect, useState, useTransition } from 'react';
import { createUpdateComment } from '@/actions/comment.actions';
import Spinner from '../spinner';
import { useLocale, useTranslations } from 'next-intl';

interface CreateUpdateCommentProps {
	authorId: string | undefined;
	templateId: string;
	commentId?: string;
	content?: string;
	type?: 'create' | 'update';
}

export default function CreateUpdateComment({
	authorId,
	templateId,
	commentId,
	content,
	type = 'create',
}: CreateUpdateCommentProps) {
	const [isPending, startTransition] = useTransition();
	const t = useTranslations('CreateUpdateComment');
	const tToast = useTranslations('Toast');
	const tFormValidation = useTranslations(
		'CreateUpdateCommentSchemaValidation'
	);
	const currentLocal = useLocale();

	// Create the schema using the translation function
	const [CreateUpdateCommentSchema, setCreateUpdateCommentSchema] = useState(
		createUpdateCommentSchema(tFormValidation)
	);

	const form = useForm<z.infer<typeof CreateUpdateCommentSchema>>({
		resolver: zodResolver(CreateUpdateCommentSchema),
		defaultValues: {
			content: content || '',
			authorId: authorId || '',
			templateId,
		},
	});

	const updateSchema = useCallback(() => {
		setCreateUpdateCommentSchema(createUpdateCommentSchema(tFormValidation)); // Create a new schema
		form.clearErrors(); // Clear existing errors to reflect new messages
	}, [tFormValidation, form]);

	// Update the schema when the translation function or locale changes
	useEffect(() => {
		updateSchema();
	}, [tFormValidation, updateSchema]);

	function onSubmit(data: z.infer<typeof CreateUpdateCommentSchema>) {
		startTransition(async () => {
			try {
				if (type === 'create') {
					const comment = await createUpdateComment({
						values: data,
						type: 'create',
					});

					if (comment) {
						toast({
							title: tToast('commentSubmittedTitle'),
							description: tToast('commentSubmittedDescription'),
						});

						form.reset();
					}
				}

				if (type === 'update') {
					const comment = await createUpdateComment({
						values: data,
						type: 'update',
						commentId,
					});

					if (comment) {
						toast({
							title: tToast('commentUpdatedTitle'),
						});

						form.reset({ content: (comment as Comment).content });
					}
				}
			} catch (error: unknown) {
				toast({
					variant: 'destructive',
					title: tToast('errorTitle'),
					description: (error as Error).message,
				});

				form.reset();
			}
		});
	}

	const handleSendFeedback = () => {
		if (!authorId) {
			toast({
				variant: 'destructive',
				title: tToast('signInTitle'),
				description: tToast('signInDescription', {
					feature:
						currentLocal === 'es' ? 'enviar un comentario' : 'submit a comment',
				}),
				duration: 1000,
			});

			return;
		}

		return;
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='w-full flex flex-col gap-3 items-end'>
				<FormField
					control={form.control}
					name='content'
					render={({ field }) => (
						<FormItem className='w-full'>
							<FormControl>
								<Textarea
									onClick={handleSendFeedback}
									placeholder={t('placeholder')}
									disabled={form.formState.isLoading || isPending}
									className='resize-none'
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button
					type='submit'
					disabled={!authorId || form.formState.isLoading || isPending}>
					{form.formState.isLoading || isPending ? (
						<Spinner className='h-5 w-5' />
					) : type === 'create' ? (
						t('submitButton')
					) : (
						t('updateButton')
					)}
				</Button>
			</form>
		</Form>
	);
}
