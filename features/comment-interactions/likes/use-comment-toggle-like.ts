import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { toggleCommentLike as toggleCommentLikeApi } from '../api-comment-interactions';

export function useCommentToggleLike() {
	const queryClient = useQueryClient();

	const { isPending: isLoadingToggle, mutate: toggleCommentLike } = useMutation(
		{
			mutationFn: async ({ commentId }: { commentId: string }) =>
				toggleCommentLikeApi(commentId),
			onSuccess: (data, variables) => {
				// STEP 1 : send message
				toast({
					title: data.message, // Use the message from the response
				});

				queryClient.setQueryData(
					['comment-likes', variables.commentId],
					(oldData: { likesCount: number; isLikedByCurrentUser: boolean }) => {
						return {
							likesCount: data.likesCount,
							isLikedByCurrentUser: !oldData?.isLikedByCurrentUser,
						};
					}
				);

				queryClient.setQueryData(
					['comment-dislikes', variables.commentId],
					(oldData: {
						dislikesCount: number;
						isDislikedByCurrentUser: boolean;
					}) => {
						return {
							dislikesCount: oldData?.isDislikedByCurrentUser
								? oldData?.dislikesCount - 1
								: oldData?.dislikesCount,
							isDislikedByCurrentUser: false,
						};
					}
				);
			},
			onError: err => {
				console.error('Error toggling like:', err);
				toast({
					variant: 'destructive',
					title: 'Something went wrong',
				});
			},
		}
	);

	return { isLoadingToggle, toggleCommentLike };
}
