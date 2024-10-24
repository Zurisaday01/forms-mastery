'use client';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@radix-ui/react-separator';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useCallback, useEffect, useState, useTransition } from 'react';
import { loginSchema } from '@/schema';
import { login } from '@/actions/auth.actions';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import SignInGoogleButton from './sign-in-google-button';
import PasswordInput from '../password-input';
import Spinner from '../spinner';
import { useLocale, useTranslations } from 'next-intl';

interface SignInCardProps {
	setState: React.Dispatch<React.SetStateAction<SignInFlow>>;
}
const SignInCard = ({ setState }: SignInCardProps) => {
	const router = useRouter();
	const tToast = useTranslations('Toast');
	const t = useTranslations('Auth');
	const currentLocale = useLocale();
	const tFormValidation = useTranslations(
		'LoginSchemaValidation'
	);
	const { toast } = useToast();

	const [isPending, startTransition] = useTransition();

	// Create the schema using the translation function
	const [LoginSchema, setLoginSchema] = useState(
		loginSchema(tFormValidation)
	);

	const form = useForm<z.infer<typeof LoginSchema>>({
		resolver: zodResolver(LoginSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	const updateSchema = useCallback(() => {
		setLoginSchema(loginSchema(tFormValidation)); // Create a new schema
		form.clearErrors(); // Clear existing errors to reflect new messages
	}, [tFormValidation, form]);

	// Update the schema when the translation function or locale changes
	useEffect(() => {
		updateSchema();
	}, [tFormValidation, updateSchema]);

	const onSubmit = (values: z.infer<typeof LoginSchema>) => {
		startTransition(() => {
			login(values).then(data => {
				if (data?.error) {
					toast({
						variant: 'destructive',
						title: tToast('errorTitle'),
						description: data.message,
					});

					return;
				}

				toast({
					title: tToast('welcome'),
				});
				router.push('/');
			});
		});

		form.reset();
	};

	const actionLocale = currentLocale === 'en' ? 'Sign In' : 'Inicia sesión';

	return (
		<Card className=' p-4'>
			<CardHeader className='px-0'>
				<CardTitle className='font-barlow text-2xl'>
					{t('title', { action: actionLocale })}
				</CardTitle>
				<CardDescription>{t('description')}</CardDescription>
			</CardHeader>
			<CardContent className='space-y-5  px-0 pb-0'>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
						<div className='space-y-4'>
							<FormField
								control={form.control}
								name='email'
								render={({ field }) => (
									<FormItem>
										<FormLabel>{t('email')}</FormLabel>
										<FormControl>
											<Input
												{...field}
												placeholder='test@example.com'
												type='email'
												autoCorrect='off'
												autoComplete='off'
												disabled={isPending}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='password'
								render={({ field }) => (
									<FormItem>
										<FormLabel>{t('password')}</FormLabel>
										<FormControl>
											<PasswordInput
												{...field}
												placeholder='•••••••••'
												autoCorrect='off'
												autoComplete='off'
												disabled={isPending}
											/>
										</FormControl>

										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<Button
							type='submit'
							disabled={isPending}
							className='w-full'
							size='lg'>
							{isPending ? (
								<Spinner className='h-5 w-5' />
							) : (
								t('continueButton')
							)}
						</Button>
					</form>
				</Form>
				<Separator />
				<div>
					<SignInGoogleButton />
				</div>
				<p className='text-xs text-muted-foreground'>
					{t('goToSignUp')}{' '}
					<span
						className='text-blue-600 hover:underline cursor-pointer'
						onClick={() => setState('signUp')}>
						{t('signUp')}
					</span>
				</p>
			</CardContent>
		</Card>
	);
};
export default SignInCard;
