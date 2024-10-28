export const toggleCommentLike = async (userId: string, commentId: string) => {
	const response = await fetch('/api/toggle-comment-like', {
		method: 'POST',
		body: JSON.stringify({
			userId,
			commentId,
		}),
	});

	if (!response.ok) {
		throw new Error('Failed to toggle like');
	}

	return response.json();
};

export const toggleCommentDislike = async (
	userId: string,
	commentId: string
) => {
	const response = await fetch('/api/toggle-comment-dislike', {
		method: 'POST',
		body: JSON.stringify({
			userId,
			commentId,
		}),
	});

	if (!response.ok) {
		throw new Error('Failed to toggle dislike');
	}

	return response.json();
};

export const getLikesCountByCommentId = async (
	commentId: string,
	currentUserId: string
) => {
	try {
		const response = await fetch(`/api/get-likes-by-comment-id/${commentId}`, {
			method: 'GET',
		});
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

export const getDislikesCountByCommentId = async (
	commentId: string,
	currentUserId: string
) => {
	try {
		const response = await fetch(
			`/api/get-dislikes-by-comment-id/${commentId}`,
			{
				method: 'GET',
			}
		);
		const data = await response.json();


		// Check if the current user has liked the template
		const disliked = data?.dislikes.some(
			(dislike: Like) => dislike.userId === currentUserId
		);

		return {
			dislikesCount: data.dislikes.length,
			isDislikedByCurrentUser: disliked,
		};
	} catch (error) {
		console.error('Error fetching likes by template ID:', error);
		throw error;
	}
};
