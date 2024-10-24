'use server';

import { prisma as db } from '@/lib/prisma';
import { formatToCamelCase } from '@/lib/utils';
import { AnswerType, Prisma } from '@prisma/client';
import { getTranslations } from 'next-intl/server';
import { revalidatePath } from 'next/cache';
import { cache } from 'react';

export const createTemplate = async ({
	authorId,
	title,
	description,
	tags,
	questions,
}: CreateTemplateProps) => {
	try {
		// Find existing tags by their names
		const tagRecords = await db.tag.findMany({
			where: {
				name: {
					in: tags, // Find tags where the name is in the provided array of strings
				},
			},
		});

		const tagIds = tagRecords.map((tag: Tag) => ({ id: tag.id }));

		const template = await db.template.create({
			data: {
				authorId: authorId,
				title,
				description,
				// Connect the template with the tags using the tag IDs
				tags: {
					connect: tagIds,
				},
				questions: {
					create: questions.map(question => {
						const jsonOptions = question.options as unknown as Prisma.JsonArray;

						return {
							title: question.title,
							description: question.description,
							isVisible: question.isVisible,
							isRated: question.isRated,
							answerType: formatToCamelCase(question.answerType) as AnswerType,
							options: jsonOptions,
							correctAnswers: question.correctAnswers || [],
						};
					}),
				},
			},
			include: {
				questions: true,
				tags: true,
			},
		});

		revalidatePath('/');

		return template;
	} catch (error) {
		console.error('Error creating template:', error);
		throw error;
	}
};

export const updateTemplate = async ({
	templateId,
	title,
	description,
	tags,
	questions,
}: UpdateTemplateProps) => {
	try {
		// Find existing tags by their names
		const tagRecords = await db.tag.findMany({
			where: {
				name: {
					in: tags, // Find tags where the name is in the provided array of strings
				},
			},
		});

		const tagIds = tagRecords.map((tag: Tag) => ({ id: tag.id }));

		// Update the template
		const updatedTemplate = await db.template.update({
			where: {
				id: templateId, // Specify the template to update by its ID
			},
			data: {
				title,
				description,
				// Update the tags by connecting to the existing tags
				tags: {
					set: tagIds, // Overwrite the existing tags with the new ones
				},
				questions: {
					// Handle questions by updating existing ones or creating new ones
					upsert: questions.map(question => {
						const jsonOptions = question.options as unknown as Prisma.JsonArray;

						return {
							where: { id: question.id || '' }, // Update existing question if it has an ID
							create: {
								title: question.title,
								description: question.description,
								isVisible: question.isVisible,
								isRated: question.isRated,
								answerType: formatToCamelCase(
									question.answerType
								) as AnswerType,
								options: jsonOptions,
								correctAnswers: question.correctAnswers || [],
							},
							update: {
								title: question.title,
								description: question.description,
								isVisible: question.isVisible,
								isRated: question.isRated,
								answerType: formatToCamelCase(
									question.answerType
								) as AnswerType,
								options: jsonOptions,
								correctAnswers: question.correctAnswers || [],
							},
						};
					}),
				},
			},
			include: {
				questions: true,
				tags: true,
			},
		});

		revalidatePath(`/templates/manage/${templateId}`);

		return updatedTemplate;
	} catch (error) {
		console.error('Error updating template:', error);
		throw error;
	}
};

export const getTemplateById = cache(async (id: string) => {
	try {
		const template = await db.template.findUnique({
			where: {
				id,
			},
			include: {
				questions: true,
				author: true,
				tags: true,
			},
		});

		return template;
	} catch (error) {
		console.error('Error getting template by id:', error);
		throw error;
	}
});

export const deleteAllTemplates = async () => {
	try {
		const deletedTemplates = await db.template.deleteMany();

		revalidatePath('/');

		console.log('Deleted templates:', deletedTemplates);
	} catch (error) {
		console.error('Error deleting templates:', error);
		throw error;
	}
};

interface GetTemplatesParams {
	sort?: string;
	ownership?: string;
	userId?: string;
}

export const getAllTemplates = cache(
	async ({
		ownership, // Ownership filter
		userId, // User ID for filtering
		sort, // Sorting parameter
	}: GetTemplatesParams) => {
		try {
			const whereConditions: Prisma.TemplateWhereInput = {}; // Prepare where conditions for filtering

			// Apply ownership filter conditions
			if (ownership === 'me' && userId) {
				whereConditions.authorId = userId; // Filter for templates owned by the user
			} else if (ownership === 'not-me' && userId) {
				whereConditions.authorId = { not: userId }; // Filter for templates not owned by the user
			}
			// Note: If ownership is 'anyone', no conditions are added

			const orderByConditions: Prisma.TemplateOrderByWithRelationInput = {}; // Prepare order by conditions for sorting

			// Define sorting behavior based on the sort parameter
			if (sort === 'asc') {
				orderByConditions.createdAt = 'asc'; // Oldest to newest
			} else {
				orderByConditions.createdAt = 'desc'; // Default: newest to oldest
			}

			// Query the database with the specified conditions
			const templates = await db.template.findMany({
				where: whereConditions,
				include: {
					questions: true,
					author: true,
					tags: true,
				},
				orderBy: orderByConditions,
			});

			return templates; // Return the fetched templates
		} catch (error) {
			console.error('Error getting templates:', error);
			throw error; // Throw error for handling in the calling function
		}
	}
);

export const getMyTemplates = async (userId: string) => {
	try {
		const templates = await db.template.findMany({
			where: {
				authorId: userId,
			},
			include: {
				questions: true,
				tags: true,
				author: true,
			},
			orderBy: {
				createdAt: 'desc',
			},
		});

		return templates;
	} catch (error) {
		console.error('Error getting my templates:', error);
		throw error;
	}
};

export const getTemplatesByQuery = cache(async (query: string) => {
	console.log('Query:', query);
	try {
		const templates = await db.template.findMany({
			where: {
				OR: [
					// Search in template title
					{
						title: {
							contains: query, // Adjust query mode if needed (insensitive, etc.)
							mode: 'insensitive',
						},
					},
					// Search in template description
					{
						description: {
							contains: query,
							mode: 'insensitive',
						},
					},
					// Search in related questions' title
					{
						questions: {
							some: {
								title: {
									contains: query,
									mode: 'insensitive',
								},
							},
						},
					},
					// Search in related comments' text
					// {
					// 	comments: {
					// 		some: {
					// 			content: {
					// 				contains: query,
					// 				mode: 'insensitive',
					// 			},
					// 		},
					// 	},
					// },
				],
			},
			include: {
				author: true,
				tags: true,
			},
		});

		revalidatePath('/search');

		return templates;
	} catch (error) {
		console.error('Error getting templates by query:', error);
		throw error;
	}
});

// templates with the most filled forms
export const getPopularTemplates = cache(async () => {
	try {
		const templates = await db.template.findMany({
			take: 5,
			include: {
				questions: true,
				author: true,
				tags: true,
			},
			orderBy: {
				forms: {
					_count: 'desc',
				},
			},
		});

		return templates;
	} catch (error) {
		console.error('Error getting popular templates:', error);
		throw error;
	}
});

export const getLatestTemplates = cache(async () => {
	try {
		// Query the database with the specified conditions
		const templates = await db.template.findMany({
			take: 8,
			include: {
				questions: true,
				author: true,
				tags: true,
			},
			orderBy: {
				createdAt: 'desc',
			},
		});

		return templates; // Return the fetched templates
	} catch (error) {
		console.error('Error getting latest templates:', error);
		throw error; // Throw error for handling in the calling function
	}
});

export const getResponsesByTemplateId = cache(async (templateId: string) => {
	try {
		// Step 1: Fetch questions associated with the given template ID
		const templateQuestions = await db.question.findMany({
			where: {
				templateId: templateId,
			},
		});

		// Step 2: Fetch forms along with their associated questions and responses
		const forms = await db.form.findMany({
			where: {
				templateId: templateId,
			},
			include: {
				Response: true, // Include responses related to each form
			},
		});

		// Step 3: Create a map to group responses by question
		const groupedResponses: { [key: string]: GroupQuestion } = {};

		templateQuestions.forEach(question => {
			// Initialize the question in the groupedResponses if it doesn't exist
			groupedResponses[question.id] = {
				...question, // Spread the question properties
				answers: [], // Initialize answers array
			};

			// Loop over the forms to gather responses for this question
			forms.forEach(form => {
				form.Response.forEach(response => {
					if (response.questionId === question.id) {
						// Push the answer into the answers array with its unique ID
						groupedResponses[question.id].answers.push({
							id: response.id, // Use the response ID as the unique identifier
							answers: response.answers, // The answers from this response
						});
					}
				});
			});
		});

		// Step 4: Convert the groupedResponses object back into an array
		const responsesArray = Object.values(groupedResponses);

		return responsesArray; // Return the structured data
	} catch (error) {
		console.error('Error fetching responses by template ID:', error);
		throw error;
	}
});

export const getLikesByTemplateId = cache(async (templateId: string) => {
	try {
		const likes = await db.like.findMany({
			where: {
				templateId,
			},
		});

		return likes;
	} catch (error) {
		console.error('Error fetching likes by template ID:', error);
		throw error;
	}
});

// Like a template or remove the like
export const toggleTemplateLike = async (
	userId: string,
	templateId: string
) => {
	try {
		const t = await getTranslations('TemplateServerActions');
		// Check if the user has already liked the template
		const existingLike = await db.like.findFirst({
			where: {
				userId,
				templateId,
			},
		});

		if (existingLike) {
			// If like exists, remove it (unlike)
			await db.like.delete({
				where: {
					id: existingLike.id,
				},
			});

			// Fetch the updated count of likes
			const likesCount = await db.like.count({
				where: {
					templateId,
				},
			});

			revalidatePath('/');
			revalidatePath('/templates/view/[id]', 'page');
			return { likesCount, message: t('noLike') };
		} else {
			// If like doesn't exist, create a new like
			await db.like.create({
				data: {
					userId,
					templateId,
				},
			});

			// Fetch the updated count of likes
			const likesCount = await db.like.count({
				where: {
					templateId,
				},
			});
			revalidatePath('/');
			revalidatePath('/templates/view/[id]', 'page');
			return { likesCount, message: t('like') };
		}
	} catch (error) {
		console.error('Error toggling like:', error);
		throw new Error('Unable to process the like/unlike action.');
	}
};

export const hasUserAnsweredTemplateForms = cache(
	async (userId: string | undefined, templateId: string) => {
		if (!userId) return false;
		try {
			// Check if any response exists for the specified user and template
			const response = await db.response.findFirst({
				where: {
					userId,
					form: {
						templateId, // Filter by templateId through the form relation
					},
				},
			});

			// Return true if a response is found, otherwise false
			return response !== null;
		} catch (error) {
			console.error(
				'Error checking if user has answered template forms:',
				error
			);
			throw error;
		}
	}
);

export const deleteTemplate = async (templateId: string) => {
	try {
		const deletedTemplate = await db.template.delete({
			where: {
				id: templateId,
			},
		});

		revalidatePath('/');

		return deletedTemplate;
	} catch (error) {
		console.error('Error deleting template:', error);
		throw error;
	}
};
