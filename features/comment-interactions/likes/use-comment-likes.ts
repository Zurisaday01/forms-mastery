import { useQuery } from '@tanstack/react-query';
import { getLikesCountByCommentId } from '../api-comment-interactions';

export function useCommentLikes({
	initialLikesCount,
	commentId,
}: {
	initialLikesCount: number;
	commentId: string;
}) {
	const {
		data: { likesCount = initialLikesCount, isLikedByCurrentUser = false },
		isLoading,
		error,
	} = useQuery({
		queryKey: ['comment-likes', commentId],
		queryFn: () => getLikesCountByCommentId(commentId),
		initialData: { likesCount: initialLikesCount, isLikedByCurrentUser: false },
	});

	return { isLoading, error, data: { likesCount, isLikedByCurrentUser } };
}
