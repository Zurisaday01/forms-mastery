export const toggleTemplateLike = async (templateId: string) => {
	const response = await fetch('/api/toggle-template-like', {
		method: 'POST',
		body: JSON.stringify({
			templateId,
		}),
	});

	if (!response.ok) {
		throw new Error('Failed to toggle like');
	}

	return response.json();
};

export const getLikesCountByTemplateId = async (templateId: string) => {
	try {
		const response = await fetch(
			`/api/get-likes-by-template-id/${templateId}`,
			{
				method: 'GET',
			}
		);
		const data = await response.json();

		return {
			likesCount: data.likes.length,
			isLikedByCurrentUser: data.isLikedByCurrentUser,
		};
	} catch (error) {
		console.error('Error fetching likes by template ID:', error);
		throw error;
	}
};
