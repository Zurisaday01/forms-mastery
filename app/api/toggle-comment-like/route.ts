import { toggleCommentLike } from '@/actions/comment.actions';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
	try {
		// Parse the JSON body
		const body = await request.json();

		const { userId, commentId } = body;

		const response = await toggleCommentLike(userId, commentId);

		return NextResponse.json(
			{ message: response.message, likesCount: response.likesCount },
			{ status: 200 }
		);

		// Process the webhook payload
	} catch (error: unknown) {
		return NextResponse.json(
			{ error: `Somethig went wrong: ${(error as Error).message}` },
			{ status: 400 }
		);
	}
}
