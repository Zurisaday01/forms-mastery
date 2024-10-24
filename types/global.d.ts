import { Icons } from '@/components/icons';
import { User } from '@prisma/client';
declare global {
	type SignInFlow = 'signIn' | 'signUp';
	type IconType = keyof typeof Icons;

	interface AnswerOption {
		id: string;
		label: string;
	}

	interface Answer {
		id: string;
		answers: string[];
	}

	interface Like {
		id: string;
		commentId?: string;
		templateId?: string;
		userId: string;
	}

	interface Question {
		id: string;
		templateId: string;
		isVisible: boolean;
		isRated: boolean;
		title: string;
		description: string;
		answerType: string;
		options: AnswerOption[]; // the labels of the options
		correctAnswers: string[]; // the labels of the correct answers options
		answers: string[]; // the labels of the answers
	}

	interface GroupQuestion {
		id: string;
		templateId: string | null;
		formId: string | null;
		isVisible: boolean;
		isRated: boolean;
		title: string;
		description: string | null;
		answerType: string;
		options: Prisma.JsonValue;
		correctAnswers: string[];
		answers: Answer[];
	}

	interface Tag {
		id: string;
		name: string;
	}

	interface Form {
		id: string;
		templateId: string;
		user?: User;
		userId: string;
		questions: Question[];
		createdAt: Date;
	}

	interface Template {
		id?: string;
		title: string;
		description: string;
		tags: Tag[];
		authorId: string;
		author?: User;
		questions: Question[];
		forms?: Form[];
		createdAt: Date;
		updatedAt: Date;
	}

	interface CreateTemplateProps {
		authorId: string;
		title: string;
		description: string;
		tags: string[];
		questions: Question[];
	}
	interface UpdateTemplateProps {
		templateId: string;
		title: string;
		description: string;
		tags: string[];
		questions: Question[];
	}

	interface CreateFormProps {
		userId: string;
		templateId: string;
		answersData: AnswersData[];
	}

	interface UpdateFormProps {
		formId: string;
		userId: string;
		templateId: string;
		answersData: AnswersData[];
		responses: Response[];
	}

	interface AnswersData {
		questionId: string;
		answers: string[];
		answerType: string;
	}

	interface Comment {
		id: string;
		author: User;
		authorId: string;
		templateId: string;
		template?: Template;
		content: string;
		createdAt: Date;
		updatedAt: Date;
		likes: Like[];
		dislikes: Like[];
	}

	interface WordData {
		text: string;
		value: number;
	}

	interface Response {
		id: string;
		userId: string;
		formId: string;
		questionId: string;
		answers: string[];
	}

	interface InputObject {
		id: string;
		userId: string;
		createdAt: string;
		templateId: string;
		template: {
			id: string;
			authorId: string;
			title: string;
			description: string;
			createdAt: string;
			updatedAt: string;
			questions: Question[];
		};
		user: {
			id: string;
			firstName: string;
			lastName: string;
			email: string;
			password: null | string;
			role: string;
			status: string;
			emailVerified: boolean;
		};
		questions: Question[];
		Response: Response[];
	}

	interface LocaleLabel {
		en: string;
		es: string;
	}
}
export {};
