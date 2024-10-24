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

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';

import { useCallback, useEffect, useState, useTransition } from 'react';
import { registerSchema } from '@/schema';
import { register } from '@/actions/auth.actions';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import PasswordInput from '../password-input';
import SignInGoogleButton from './sign-in-google-button';
import Spinner from '../spinner';
import { useLocale, useTranslations } from 'next-intl';

interface SignUpCardProps {
	setState: React.Dispatch<React.SetStateAction<SignInFlow>>;
}

const SignUpCard = ({ setState }: SignUpCardProps) => {
	const router = useRouter();
	const { toast } = useToast();
	const [isPending, startTransition] = useTransition();
	const tToast = useTranslations('Toast');
	const t = useTranslations('Auth');
	const currentLocale = useLocale();
	const tFormValidation = useTranslations(
		'RegisterSchemaValidation'
	);

	// Create the schema using the translation function
	const [RegisterSchema, setRegisterSchema] = useState(
		registerSchema(tFormValidation)
	);

	const form = useForm<z.infer<typeof RegisterSchema>>({
		resolver: zodResolver(RegisterSchema),
		defaultValues: {
			email: '',
			password: '',
			firstName: '',
			lastName: '',
		},
	});

	const updateSchema = useCallback(() => {
		setRegisterSchema(registerSchema(tFormValidation)); // Create a new schema
		form.clearErrors(); // Clear existing errors to reflect new messages
	}, [tFormValidation, form]);

	// Update the schema when the translation function or locale changes
	useEffect(() => {
		updateSchema();
	}, [tFormValidation, updateSchema]);

	const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
		startTransition(() => {
			register(values).then(data => {
				if (data?.error) {
					toast({
						variant: 'destructive',
						title: tToast('errorTitle'),
						description: data.message,
					});

					return;
				} else {
					toast({
						title: tToast('formRegisterSuccessTitle'),
						description: data.message,
					});
					router.push('/authenticate');
				}
			});
		});

		form.reset();
	};

	const actionLocale = currentLocale === 'en' ? 'Sign Up' : 'Regístrate';

	return (
		<Card className='p-4'>
			<CardHeader className='px-0'>
				<CardTitle className='font-barlow text-2xl'>
					{t('title', { action: actionLocale })}
				</CardTitle>
				<CardDescription>{t('description')}</CardDescription>
			</CardHeader>
			<CardContent className='space-y-5 px-0 pb-0'>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
						<div className='space-y-4'>
							<FormField
								control={form.control}
								name='firstName'
								render={({ field }) => (
									<FormItem>
										<FormLabel>{t('firstName')}</FormLabel>
										<FormControl>
											<Input
												{...field}
												placeholder='John'
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
								name='lastName'
								render={({ field }) => (
									<FormItem>
										<FormLabel>{t('lastName')}</FormLabel>
										<FormControl>
											<Input
												{...field}
												placeholder='Doe'
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
								name='email'
								render={({ field }) => (
									<FormItem>
										<FormLabel>{t('email')}</FormLabel>
										<FormControl>
											<Input
												{...field}
												placeholder='john.doe@example.com'
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
					{t('goToSignIn')}{' '}
					<span
						className='text-blue-600 hover:underline cursor-pointer'
						onClick={() => setState('signIn')}>
						{t('signIn')}
					</span>
				</p>
			</CardContent>
		</Card>
	);
};
export default SignUpCard;
