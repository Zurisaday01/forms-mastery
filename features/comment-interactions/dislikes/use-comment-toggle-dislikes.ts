import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { toggleCommentDislike as toggleCommentDislikeApi } from '../api-comment-interactions';

export function useCommentToggleDislike() {
	const queryClient = useQueryClient();

	const { isPending: isLoadingToggle, mutate: toggleCommentDislike } =
		useMutation({
			mutationFn: async ({ commentId }: { commentId: string }) =>
				toggleCommentDislikeApi(commentId),
			onSuccess: (data, variables) => {
				// STEP 1 : send message
				toast({
					title: data.message, // Use the message from the response
				});

				queryClient.setQueryData(
					['comment-dislikes', variables.commentId],
					(oldData: {
						dislikesCount: number;
						isDislikedByCurrentUser: boolean;
					}) => {
						return {
							dislikesCount: data.dislikesCount,
							isDislikedByCurrentUser: !oldData?.isDislikedByCurrentUser,
						};
					}
				);

				queryClient.setQueryData(
					['comment-likes', variables.commentId],
					(oldData: { likesCount: number; isLikedByCurrentUser: boolean }) => {
						return {
							likesCount: oldData?.isLikedByCurrentUser
								? oldData?.likesCount - 1
								: oldData?.likesCount,
							isLikedByCurrentUser: false,
						};
					}
				);
			},
			onError: err => {
				console.error('Error toggling dislike:', err);
				toast({
					variant: 'destructive',
					title: 'Something went wrong',
				});
			},
		});

	return { isLoadingToggle, toggleCommentDislike };
}
