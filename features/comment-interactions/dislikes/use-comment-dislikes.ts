import { useQuery } from '@tanstack/react-query';
import {
	getDislikesCountByCommentId,
} from '../api-comment-interactions';

export function useCommentDislikes({
	initialDislikesCount,
	commentId,
	currentUserId,
}: {
	initialDislikesCount: number;
	commentId: string;
	currentUserId: string;
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
		queryFn: () => getDislikesCountByCommentId(commentId, currentUserId),
		initialData: {
			dislikesCount: initialDislikesCount,
			isDislikedByCurrentUser: false,
		},
	});

	return { isLoading, error, data: { dislikesCount, isDislikedByCurrentUser } };
}
