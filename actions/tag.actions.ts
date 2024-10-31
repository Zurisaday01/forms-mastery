'use server';

import { prisma as db } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { cache } from 'react';

export const getAllAvailableTags = cache(async () => {
	try {
		const tags = await db.tag.findMany();

		return tags;
	} catch (error) {
		console.error('Error getting all tags:', error);
		throw error;
	}
});

export const createTag = async (name: string) => {
	try {
		// Check if the tag already exists
		const existingTag = await db.tag.findUnique({
			where: {
				name,
			},
		});

		if (existingTag) {
			// Throw an error if the tag already exists
			throw new Error(`Tag "${name}" already exists.`);
		}

		// Create the new tag if it doesn't exist
		const tag = await db.tag.create({
			data: {
				name,
			},
		});

		// Revalidate the path if the tag is created
		revalidatePath('/templates/new');
		return tag;
	} catch (error: unknown) {
		console.error(
			'Error creating a new tag:',
			(error as Error).message || error
		);
		throw error;
	}
};
export const getAllTagsUsages = async () => {
	try {
		const tagUsage = await db.tag.findMany({
			select: {
				name: true, // Select the tag name
				_count: {
					select: { templates: true }, // Count the number of templates related to each tag
				},
			},
		});
		return tagUsage;
	} catch (error) {
		console.error('Error getting tag usage:', error);
		throw error;
	}
};

export const getTemplatesByTagName = async (tagName: string) => {
	try {
		if (tagName === '') return [];
		// Find the tag first
		const tag = await db.tag.findUnique({
			where: { name: tagName },
			select: {
				id: true, // Get the ID to find templates associated with this tag
			},
		});

		if (!tag) {
			throw new Error(`Tag with name ${tagName} not found.`);
		}

		// Now fetch templates associated with the found tag
		const templatesWithTag = await db.template.findMany({
			where: {
				tags: {
					some: { id: tag.id }, // Filter templates by the tag ID
				},
			},
			include: {
				tags: true, // Include tags associated with the template
				author: true, // Include author details
				_count: {
					select: {
						likes: true,
						comments: true,
						forms: true,
					},
				},
			},
			orderBy: {
				createdAt: 'desc', // Order templates by creation date
			},
		});

		return templatesWithTag;
	} catch (error) {
		console.error('Error getting templates by tag name:', error);
		throw error;
	}
};
