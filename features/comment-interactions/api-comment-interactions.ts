export const toggleCommentLike = async (commentId: string) => {
	const response = await fetch('/api/toggle-comment-like', {
		method: 'POST',
		body: JSON.stringify({
			commentId,
		}),
	});

	if (!response.ok) {
		throw new Error('Failed to toggle like');
	}

	return response.json();
};

export const toggleCommentDislike = async (commentId: string) => {
	console.log('commentId', commentId);
	const response = await fetch('/api/toggle-comment-dislike', {
		method: 'POST',
		body: JSON.stringify({
			commentId,
		}),
	});

	if (!response.ok) {
		throw new Error('Failed to toggle dislike');
	}

	return response.json();
};

export const getLikesCountByCommentId = async (commentId: string) => {
	try {
		const response = await fetch(`/api/get-likes-by-comment-id/${commentId}`, {
			method: 'GET',
		});
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

export const getDislikesCountByCommentId = async (commentId: string) => {
	try {
		const response = await fetch(
			`/api/get-dislikes-by-comment-id/${commentId}`,
			{
				method: 'GET',
			}
		);
		const data = await response.json();

		return {
			dislikesCount: data.dislikes.length,
			isDislikedByCurrentUser: data.isDislikedByCurrentUser,
		};
	} catch (error) {
		console.error('Error fetching likes by template ID:', error);
		throw error;
	}
};
