import {
	getDislikesByCommentId,
	isDislikedByCurrentUserAction,
} from '@/actions/comment.actions';
import { Dislike } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function GET(
	request: Request,
	{ params }: { params: { commentId: string } }
) {
	const { commentId } = params;

	if (!commentId) {
		return NextResponse.json(
			{ error: 'Comment ID is required' },
			{ status: 400 }
		);
	}

	try {
		// Fetch dislikes for the given comment ID
		const dislikes = await getDislikesByCommentId(commentId);

		// If dislikes is null or undefined, handle it
		if (!dislikes) {
			return NextResponse.json(
				{ error: 'No dislikes found for this comment' },
				{ status: 404 }
			);
		}

		// Check if the current user has liked the template
		const isDislikedByCurrentUser = await isDislikedByCurrentUserAction(
			dislikes as Dislike[]
		);

		// Success response with dislikes data
		return NextResponse.json({ dislikes, isDislikedByCurrentUser });
	} catch (error) {
		console.error('Error fetching dislikes:', error);

		// Return a 500 response with the error message
		return NextResponse.json(
			{ error: 'An error occurred while fetching dislikes' },
			{ status: 500 }
		);
	}
}
