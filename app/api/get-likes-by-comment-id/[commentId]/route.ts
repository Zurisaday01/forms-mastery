import { getLikesByCommentId } from '@/actions/comment.actions';
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
		// Fetch likes for the given comment ID
		const likes = await getLikesByCommentId(commentId);

		// If likes is null or undefined, handle it
		if (!likes) {
			return NextResponse.json(
				{ error: 'No likes found for this comment' },
				{ status: 404 }
			);
		}

		// Success response with likes data
		return NextResponse.json({ likes });
	} catch (error) {
		console.error('Error fetching likes:', error);

		// Return a 500 response with the error message
		return NextResponse.json(
			{ error: 'An error occurred while fetching likes' },
			{ status: 500 }
		);
	}
}
