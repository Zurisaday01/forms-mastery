import { useQuery } from '@tanstack/react-query';
import { getLikesCountByTemplateId } from './api-likes';

export function useLikes({
	initialLikesCount,
	templateId,
	currentUserId,
}: {
	initialLikesCount: number;
	templateId: string;
	currentUserId: string | undefined;
}) {
	const {
		data: { likesCount = initialLikesCount, isLikedByCurrentUser = false },
		isLoading,
		error,
	} = useQuery({
		queryKey: ['likes', templateId],
		queryFn: () => getLikesCountByTemplateId(templateId, currentUserId),
		initialData: { likesCount: initialLikesCount, isLikedByCurrentUser: false },
		// NOTE: queryKey needs to be an array
		//       queryFn needs to return the data that we'll store in cache
	});

	return { isLoading, error, data: { likesCount, isLikedByCurrentUser } };
}
