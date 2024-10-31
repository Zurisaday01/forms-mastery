import { useQuery } from '@tanstack/react-query';
import { getDislikesCountByCommentId } from '../api-comment-interactions';

export function useCommentDislikes({
	initialDislikesCount,
	commentId,
}: {
	initialDislikesCount: number;
	commentId: string;
}) {
	const {
		data: {
			dislikesCount = initialDislikesCount,
			isDislikedByCurrentUser = false,
		},
		isLoading,
		error,
	} = useQuery({
		queryKey: ['comment-dislikes', commentId],
		queryFn: () => getDislikesCountByCommentId(commentId),
		initialData: {
			dislikesCount: initialDislikesCount,
			isDislikedByCurrentUser: false,
		},
	});

	return { isLoading, error, data: { dislikesCount, isDislikedByCurrentUser } };
}
