'use server';

import { prisma as db } from '@/lib/prisma';
import { CreateUpdateCommentSchema } from '@/schema';
import { Prisma } from '@prisma/client';
import { getTranslations } from 'next-intl/server';
import { revalidatePath } from 'next/cache';
import { cache } from 'react';
import { z } from 'zod';

export const getAllCommentsByTemplateId = cache(async (templateId: string) => {
	try {
		const comments = await db.comment.findMany({
			where: {
				templateId,
			},
			include: {
				// likes: true,
				// dislikes: true,
				author: true,
			},
		});

		return comments;
	} catch (error: unknown) {
		console.log('error', (error as Error).message);
		throw error;
	}
});

export const getCommentById = cache(async (commentId: string) => {
	try {
		const comment = await db.comment.findUnique({
			where: {
				id: commentId,
			},
			include: {
				author: true,
			},
		});

		return comment;
	} catch (error: unknown) {
		console.log('error', (error as Error).message);
		throw error;
	}
});

export const createUpdateComment = async ({
	values,
	type,
	commentId,
}: {
	values: z.infer<typeof CreateUpdateCommentSchema>;
	type: 'create' | 'update';
	commentId?: string;
}) => {
	// validate fields
	const validatedFields = CreateUpdateCommentSchema.safeParse(values);

	if (!validatedFields.success) {
		return { error: 'Invalid fields!' };
	}

	const { content, authorId, templateId } = validatedFields.data;

	try {
		let comment;

		if (type === 'create') {
			comment = await db.comment.create({
				data: {
					content,
					authorId,
					templateId,
				},
				include: {
					author: true,
				},
			});
		} else if (type === 'update') {
			comment = await db.comment.update({
				where: {
					id: commentId,
				},
				data: {
					content,
				},
				include: {
					author: true,
				},
			});
		}

		// Revalidate the path after either operation
		revalidatePath(`/templates/view/${templateId}`);
		revalidatePath('/');

		return comment;
	} catch (error: unknown) {
		console.log('error', (error as Error).message);
		throw error;
	}
};

export const deleteComment = async (commentId: string) => {
	try {
		const comment = await db.comment.delete({
			where: {
				id: commentId,
			},
		});

		// Revalidate the path after either operation
		revalidatePath(`/templates/view/${comment.templateId}`);
		revalidatePath('/');
	} catch (error: unknown) {
		console.log('error', (error as Error).message);
		throw error;
	}
};

export const getLikesByCommentId = cache(async (commentId: string) => {
	try {
		const likes = await db.like.findMany({
			where: {
				commentId,
			},
		});

		return likes;
	} catch (error) {
		console.error('Error fetching likes by comment ID:', error);
		throw error;
	}
});

export const getDislikesByCommentId = cache(async (commentId: string) => {
	try {
		const dislikes = await db.dislike.findMany({
			where: {
				commentId,
			},
		});

		return dislikes;
	} catch (error) {
		console.error('Error fetching dislikes by comment ID:', error);
		throw error;
	}
});

// Toggle like on a comment and remove dislike if it exists, then return updated counts

export const toggleCommentLike = async (userId: string, commentId: string) => {
	try {
		const t = await getTranslations('CommentServerActions');

		const transaction = await db.$transaction(
			async (prisma: Prisma.TransactionClient) => {
				const existingLike = await prisma.like.findFirst({
					where: {
						userId,
						commentId,
					},
				});

				const existingDislike = await prisma.dislike.findFirst({
					where: {
						userId,
						commentId,
					},
				});

				// Remove existing like or create a new like
				if (existingLike) {
					await prisma.like.delete({
						where: { id: existingLike.id },
					});
				} else {
					await prisma.like.create({
						data: { userId, commentId },
					});
				}

				// Remove dislike if exists
				if (existingDislike) {
					await prisma.dislike.delete({
						where: { id: existingDislike.id },
					});
				}

				// Fetch updated counts
				const [likesCount, dislikesCount] = await Promise.all([
					prisma.like.count({ where: { commentId } }),
					prisma.dislike.count({ where: { commentId } }),
				]);

				return {
					likesCount,
					dislikesCount,
					message: existingLike ? t('likeRemoved') : t('likeAdded'),
				};
			}
		);

		revalidatePath('/');
		revalidatePath('/templates/view/[id]', 'page');

		return transaction;
	} catch (error) {
		console.error('Error toggling like:', error);
		throw new Error('Unable to process the like action.');
	}
};

// Toggle dislike on a comment and remove like if it exists, then return updated counts
export const toggleCommentDislike = async (
	userId: string,
	commentId: string
) => {
	try {
		const t = await getTranslations('CommentServerActions');
		const transaction = await db.$transaction(
			async (prisma: Prisma.TransactionClient) => {
				const existingDislike = await prisma.dislike.findFirst({
					where: {
						userId,
						commentId,
					},
				});

				const existingLike = await prisma.like.findFirst({
					where: {
						userId,
						commentId,
					},
				});

				// Remove existing dislike or create a new dislike
				if (existingDislike) {
					await prisma.dislike.delete({
						where: { id: existingDislike.id },
					});
				} else {
					await prisma.dislike.create({
						data: { userId, commentId },
					});
				}

				// Remove like if exists
				if (existingLike) {
					await prisma.like.delete({
						where: { id: existingLike.id },
					});
				}

				// Fetch updated counts
				const [likesCount, dislikesCount] = await Promise.all([
					prisma.like.count({ where: { commentId } }),
					prisma.dislike.count({ where: { commentId } }),
				]);

				return {
					likesCount,
					dislikesCount,
					message: existingDislike ? t('dislikeRemoved') : t('dislikeAdded'),
				};
			}
		);

		revalidatePath('/');
		revalidatePath('/templates/view/[id]', 'page');

		return transaction;
	} catch (error) {
		console.error('Error toggling dislike:', error);
		throw new Error('Unable to process the dislike action.');
	}
};
