import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { toggleCommentLike as toggleCommentLikeApi } from '../api-comment-interactions';

export function useCommentToggleLike() {
	const queryClient = useQueryClient();

	const { isPending: isLoadingToggle, mutate: toggleCommentLike } = useMutation(
		{
			mutationFn: async ({
				userId,
				commentId,
			}: {
				userId: string;
				commentId: string;
			}) => toggleCommentLikeApi(userId, commentId),
			onSuccess: (data, variables) => {
				// STEP 1 : send message
				toast({
					title: data.message, // Use the message from the response
				});

				// Invalidate queries to refetch if necessary
				queryClient.invalidateQueries({
					queryKey: ['comment-likes', variables.commentId],
					exact: true,
				});
				queryClient.invalidateQueries({
					queryKey: ['comment-dislikes', variables.commentId],
					exact: true,
				});
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
