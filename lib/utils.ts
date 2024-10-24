import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const generateUniqueId = (): string => {
	return `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
};

export const createTagOptions = (tags: string[]) => {
	return tags.map(item => ({
		value: item,
		label: item,
	}));
};

export function formatToCamelCase(str: string): string {
	return str
		.toLowerCase()
		.split('-')
		.map((word, index) =>
			index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
		)
		.join('');
}

// Convert the tags object to an array of strings
export const formatTagsToStringArray = (tags: Tag[]) => {
	return tags?.map(tag => tag.name);
};

// Output:   "multipleChoice" =>  "multiple-choice"
export const convertToKebabCase = (str: string) => {
	return str
		.replace(/([a-z])([A-Z])/g, '$1-$2') // Insert a hyphen between lowercase and uppercase letters
		.toLowerCase(); // Convert the entire string to lowercase
};

export const getAnswerCounts = (answers: Answer[]) => {
	const answerMap: { [key: string]: number } = {};

	answers.forEach(answerObj => {
		answerObj.answers.forEach(answer => {
			answerMap[answer] = (answerMap[answer] || 0) + 1;
		});
	});

	return Object.keys(answerMap).map(answer => ({
		name: answer,
		count: answerMap[answer],
	}));
};

// charts

// multiple-choice =

// short = bar chart - SimpleBarChart

// multiple-choice = pie chart - SimplePieChart - PieChartWithCustomizedLabel

// checkbox = bar chart - SimpleBarChart - horizontal bar chart

// Define the WordData interface
export interface WordData {
	text: string;
	value: number;
}

// Helper function to transform tag data into WordData array
export function createWordDataFromTags(
	tags: { name: string; _count: { templates: number } }[]
): WordData[] {
	return tags.map(tag => ({
		text: tag.name, // 'text' corresponds to the tag name
		value: tag._count.templates, // 'value' corresponds to the template count
	}));
}
