import { getLikesByTemplateId } from '@/actions/template.actions';
import { NextResponse } from 'next/server';

export async function GET(
	request: Request,
	{ params }: { params: { templateId: string } }
) {
	const { templateId } = params;

	if (!templateId) {
		return NextResponse.json(
			{ error: 'Template ID is required' },
			{ status: 400 }
		);
	}

	try {
		// Fetch likes for the given template ID
		const likes = await getLikesByTemplateId(templateId);

		// If likes is null or undefined, handle it
		if (!likes) {
			return NextResponse.json(
				{ error: 'No likes found for this template' },
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
