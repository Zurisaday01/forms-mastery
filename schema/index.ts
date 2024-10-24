import * as z from 'zod';
// keep to validation the login register action
export const RegisterSchema = z.object({
	email: z.string().email({
		message: 'Email is required',
	}),
	password: z
		.string()
		.min(8, {
			message: 'Password must be at least 8 characters',
		})
		.regex(
			new RegExp('(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%&]).{8,32}'),
			{
				message:
					'Password must contain one uppercase letter, one lowercase letter, one number and one of the following characters: * . ! @ $ % &',
			}
		),
	firstName: z.string().min(1, {
		message: 'First name is required',
	}),
	lastName: z.string().min(1, {
		message: 'Last name is required',
	}),
});

export const registerSchema = (t: (key: string) => string) => {
	return z.object({
		email: z.string().email({
			message: t('email'), // Use translation key
		}),
		password: z
			.string()
			.min(8, {
				message: t('password'), // Use translation key
			})
			.regex(
				new RegExp('(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%&]).{8,32}'),
				{
					message: t('passwordRegex'), // Use translation key
				}
			),
		firstName: z.string().min(1, {
			message: t('firstName'), // Use translation key
		}),
		lastName: z.string().min(1, {
			message: t('lastName'), // Use translation key
		}),
	});
};

// keep to validation the login server action
export const LoginSchema = z.object({
	email: z.string().email({
		message: 'Email is required',
	}),
	password: z.string().min(1, {
		message: 'Password is required',
	}),
});

export const loginSchema = (t: (key: string) => string) => {
	return z.object({
		email: z.string().email({
			message: t('email'), // Use translation key
		}),
		password: z.string().min(1, {
			message: t('password'), // Use translation key
		}),
	});
};

// keep to validation the create server action
export const CreateUpdateCommentSchema = z.object({
	content: z.string().min(10, {
		message: 'Content must be at least 10 characters.',
	}),
	authorId: z.string(),
	templateId: z.string(),
});

export const createUpdateCommentSchema = (t: (key: string) => string) => {
	return z.object({
		content: z.string().min(10, {
			message: t('content'), // Use translation key
		}),
		authorId: z.string(),
		templateId: z.string(),
	});
};

export const createFormSchema = (t: (key: string) => string) => {
	return z.object({
		answers: z.array(
			z
				.object({
					questionId: z.string(),
					answerType: z.string(),
					answers: z.array(z.string()).nonempty(), // Ensure answers array is not empty
				})
				.superRefine((value, ctx) => {
					// Handle multipleChoice answer type
					if (
						value.answerType === 'multipleChoice' &&
						value.answers.every(item => item.trim() === '')
					) {
						ctx.addIssue({
							code: z.ZodIssueCode.custom,
							message: t('selectOption'), // Use translation key
						});
					}

					// Handle checkbox answer type
					if (
						value.answerType === 'checkbox' &&
						!value.answers.some(item => item.trim() !== '')
					) {
						ctx.addIssue({
							code: z.ZodIssueCode.custom,
							message: t('selectAtLeastOneOption'), // Use translation key
						});
					}

					// Handle number, short, and long answer types
					if (
						(value.answerType === 'number' ||
							value.answerType === 'short' ||
							value.answerType === 'long') &&
						value.answers.every(item => item.trim() === '')
					) {
						ctx.addIssue({
							code: z.ZodIssueCode.custom,
							message: t('answerRequired'), // Use translation key
						});
					}
				})
		),
	});
};
