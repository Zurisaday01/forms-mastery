import { useQuery } from '@tanstack/react-query';
import { getLikesCountByTemplateId } from './api-likes';

export function useLikes({
	initialLikesCount,
	templateId,
}: {
	initialLikesCount: number;
	templateId: string;
}) {
	const {
		data: { likesCount = initialLikesCount, isLikedByCurrentUser = false },
		isLoading,
		error,
	} = useQuery({
		queryKey: ['likes', templateId],
		queryFn: () => getLikesCountByTemplateId(templateId),
		initialData: { likesCount: initialLikesCount, isLikedByCurrentUser: false },
		// NOTE: queryKey needs to be an array
		//       queryFn needs to return the data that we'll store in cache
	});

	return { isLoading, error, data: { likesCount, isLikedByCurrentUser } };
}
