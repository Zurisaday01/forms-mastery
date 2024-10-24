'use server';

import { prisma as db } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { cache } from 'react';

export const createForm = async ({
	userId,
	templateId,
	answersData,
}: CreateFormProps) => {
	try {
		// First, create the form and link it to the user and template
		const form = await db.form.create({
			data: {
				userId: userId, // Link form to user
				templateId: templateId, // Link form to template (optional)
				questions: {
					connect: answersData.map(answer => ({
						id: answer.questionId, // Connect existing questions by their ID
					})),
				},
			},
			include: {
				questions: true, // Optionally return related questions
			},
		});

		// Store the answers separately in the Response table
		await Promise.all(
			answersData.map(async answer => {
				return await db.response.create({
					data: {
						userId: userId, // Store who is answering
						formId: form.id, // Link the response to the form
						questionId: answer.questionId, // Link to the specific question
						answers: answer.answers, // Store the user's answers
					},
				});
			})
		);

		revalidatePath(`/templates/manage/${templateId}`);

		return form;
	} catch (error) {
		console.error('Error creating form:', error);
		throw error;
	}
};

export const updateForm = async ({
	formId,
	userId,
	responses, // Existing responses array
	answersData, // New answers data array
}: UpdateFormProps) => {
	try {
		// Update the form if needed (optional)
		const form = await db.form.findUnique({
			where: { id: formId },
			include: {
				questions: true, // Optionally return related questions
			},
		});

		// Create a map for quick lookup of existing responses by questionId
		const existingResponsesMap = new Map(
			responses.map(response => [response.questionId, response])
		);

		// Iterate through answersData to update existing or create new responses
		await Promise.all(
			answersData.map(async answerData => {
				const existingResponse = existingResponsesMap.get(
					answerData.questionId
				);

				if (existingResponse) {
					// If response exists, update it
					return await db.response.update({
						where: { id: existingResponse.id }, // Use the existing response ID
						data: {
							answers: answerData.answers, // Update the user's answers
						},
					});
				} else {
					// If no existing response, create a new one
					return await db.response.create({
						data: {
							userId: userId, // Store who is answering
							formId: form?.id!, // Link the response to the form
							questionId: answerData.questionId, // Link to the specific question
							answers: answerData.answers, // Store the user's answers
						},
					});
				}
			})
		);

		// Optional: Revalidate path if necessary
		revalidatePath(`/templates/manage/${form!.templateId}`);

		return form; // Return the updated form
	} catch (error) {
		console.error('Error updating form:', error);
		throw error;
	}
};

export const getFormsByUserIdAndTemplateId = cache(
	async (userId: string, templateId: string) => {
		try {
			const forms = await db.form.findMany({
				where: {
					userId,
					templateId,
				},
				include: {
					questions: true,
					Response: true,
					user: true,
				},
				orderBy: {
					createdAt: 'desc', // Order by creation date, newest first
				},
			});

			return forms; // Return the list of forms found
		} catch (error) {
			console.error('Error getting forms by user and template:', error);
			throw error; // Throw the error for further handling
		}
	}
);

export const getAnsweredTemplatesByUserId = cache(async (userId: string) => {
	try {
		// Fetch templates with their forms filtered by userId
		const templates = await db.template.findMany({
			where: {
				forms: {
					some: {
						userId,
					},
				},
			},
			include: {
				forms: {
					where: {
						userId,
					},
				},
				questions: true,
				author: true,
				tags: true,
			},
			orderBy: {
				createdAt: 'desc',
			},
		});

		return templates; // Return the templates that the user has answered
	} catch (error) {
		console.error('Error getting answered templates:', error);
		throw error;
	}
});

export const getFormsByTemplateId = cache(async (templateId: string) => {
	try {
		const forms = await db.form.findMany({
			where: {
				templateId,
			},
			include: {
				user: true,
				template: true,
				questions: true,
				Response: true,
			},
			orderBy: {
				createdAt: 'desc',
			},
		});

		return forms;
	} catch (error) {
		console.error('Error getting responses:', error);
		throw error;
	}
});

export const getFormById = cache(async (formId: string) => {
	try {
		const form = await db.form.findUnique({
			where: {
				id: formId,
			},
			include: {
				template: {
					include: {
						questions: true, // Include questions related to the template
					},
				},
				user: true,
				questions: true,
				Response: true,
			},
		});

		return form;
	} catch (error) {
		console.error('Error getting form:', error);
		throw error;
	}
});
