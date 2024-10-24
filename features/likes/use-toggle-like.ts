import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { toggleTemplateLike } from './api-likes';

export function useToggleLike() {
	const queryClient = useQueryClient();

	const { isPending: isLoadingToggle, mutate: toggleLike } = useMutation({
		mutationFn: async ({
			userId,
			templateId,
		}: {
			userId: string | undefined;
			templateId: string;
		}) => toggleTemplateLike(userId, templateId),
		onSuccess: (data, variables) => {
			// STEP 1 : send message
			toast({
				title: data.message, // Use the message from the response
			});
			// STEP 2: Update the likes count in the cache
			// queryClient.setQueryData(['likes', variables.templateId], likesCount);

			queryClient.invalidateQueries({
				queryKey: ['likes', variables.templateId],
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
	});

	return { isLoadingToggle, toggleLike };
}
