import { toggleCommentDislike } from '@/actions/comment.actions';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
	try {
		// Parse the JSON body
		const body = await request.json();

		const { userId, commentId } = body;

		const response = await toggleCommentDislike(userId, commentId);

		return NextResponse.json(
			{ message: response.message, dislikesCount: response.dislikesCount },
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
