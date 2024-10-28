export const toggleTemplateLike = async (
	userId: string | undefined,
	templateId: string
) => {
	if (!userId) {
		throw new Error('User not logged in');
	}

	const response = await fetch('/api/toggle-template-like', {
		method: 'POST',
		body: JSON.stringify({
			userId,
			templateId,
		}),
	});

	if (!response.ok) {
		throw new Error('Failed to toggle like');
	}

	return response.json();
};

export const getLikesCountByTemplateId = async (
	templateId: string,
	currentUserId: string | undefined
) => {
	try {
		const response = await fetch(
			`/api/get-likes-by-template-id/${templateId}`,
			{
				method: 'GET',
			}
		);
		const data = await response.json();

		// Check if the current user has liked the template
		const liked = data?.likes.some(
			(like: Like) => like.userId === currentUserId
		);

		return { likesCount: data.likes.length, isLikedByCurrentUser: liked };
	} catch (error) {
		console.error('Error fetching likes by template ID:', error);
		throw error;
	}
};
