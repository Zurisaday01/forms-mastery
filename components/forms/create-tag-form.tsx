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
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { useTransition } from 'react';
import Spinner from '../spinner';
import { createTag } from '@/actions/tag.actions';

const FormSchema = z.object({
	name: z
		.string()
		.min(2, { message: 'Name must be at least 2 characters.' })
		.refine(value => value === value.toLowerCase(), {
			message: 'Name must be in lowercase.',
		}),
});

export function CreateTagForm() {
	const [isPending, startTransition] = useTransition();
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			name: '',
		},
	});

	const onSubmit = (data: z.infer<typeof FormSchema>) => {
		startTransition(async () => {
			try {
				const tag = await createTag(data.name);

				if (tag) {
					toast({
						title: 'You successfully created a tag!',
						description: (
							<span className='bg-blue-600 px-2 py-[4px] text-white text-sm rounded-full'>
								{data.name}
							</span>
						),
					});
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
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='flex flex-col gap-3'>
				<FormField
					control={form.control}
					name='name'
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Input
									placeholder='...'
									autoComplete='off'
									disabled={form.formState.isLoading || isPending}
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type='submit' disabled={form.formState.isLoading || isPending}>
					{form.formState.isLoading || isPending ? (
						<Spinner className='h-5 w-5' />
					) : (
						'Create tag'
					)}
				</Button>
			</form>
		</Form>
	);
}
