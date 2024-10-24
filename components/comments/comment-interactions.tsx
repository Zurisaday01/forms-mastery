'use client';
import { Loader2, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Button } from '../ui/button';
import { useCommentLikes } from '@/features/comment-interactions/likes/use-comment-likes';
import { useCommentDislikes } from '@/features/comment-interactions/dislikes/use-comment-dislikes';
import { useCommentToggleLike } from '@/features/comment-interactions/likes/use-comment-toggle-like';
import { useCommentToggleDislike } from '@/features/comment-interactions/dislikes/use-comment-toggle-dislikes';
import { useSession } from 'next-auth/react';
import { toast } from '@/hooks/use-toast';
import { useLocale, useTranslations } from 'next-intl';

interface CommentInteractionsProps {
	userId: string;
	commentId: string;
	initialLikes: number;
	initialDislikes: number;
}

const CommentInteractions = ({
	userId,
	commentId,
	initialLikes,
	initialDislikes,
}: CommentInteractionsProps) => {
	const { status } = useSession();
	const tToast = useTranslations('Toast');
	const currentLocale = useLocale();
	// fetch likes count using react-query
	const {
		data: { likesCount, isLikedByCurrentUser },
		isLoading: isLikesLoading,
	} = useCommentLikes({
		initialLikesCount: initialLikes,
		commentId,
		currentUserId: userId,
	});

	// fetch dislikes count using react-query
	const {
		data: { dislikesCount, isDislikedByCurrentUser },
		isLoading: isDislikesLoading,
	} = useCommentDislikes({
		initialDislikesCount: initialDislikes,
		commentId,
		currentUserId: userId,
	});

	// handle like toggling
	const { isLoadingToggle: isTogglingLike, toggleCommentLike } =
		useCommentToggleLike();

	// handle dislike toggling
	const { isLoadingToggle: isTogglingDislike, toggleCommentDislike } =
		useCommentToggleDislike();

	const handleLike = async () => {

		const featureLocale = currentLocale === 'en' ? 'like this comment' : 'darle like a este comentario';

		if (status === 'unauthenticated') {
			toast({
				variant: 'destructive',
				title: tToast('signInTitle'),
				description: tToast('signInTitle', {feature: featureLocale}),
				duration: 1000,
			});

			return;
		}
		// Optimistically update likes count
		toggleCommentLike({
			userId,
			commentId,
		});
	};

	const handleDislike = async () => {

		const featureLocale = currentLocale === 'en' ? 'dislike this comment' : 'darle dislike a este comentario';

		if (status === 'unauthenticated') {
			toast({
				variant: 'destructive',
				title: tToast('signInTitle'),
				description: tToast('signInTitle', {feature: featureLocale}),
				duration: 1000,
			});

			return;
		}
		// Optimistically update dislikes count
		toggleCommentDislike({
			userId,
			commentId,
		});
	};

	return (
		<div className='flex gap-3'>
			<Button
				variant='ghost'
				disabled={!userId || isTogglingLike || isLikesLoading}
				onClick={handleLike}
				className={`cursor-pointer flex justify-center items-center gap-1 px-2 p-1 ${
					isLikedByCurrentUser
						? 'text-blue-500 bg-blue-100/50 hover:bg-blue-100/30 hover:text-blue-400'
						: 'text-gray-500 hover:text-gray-400'
				}`}>
				{isTogglingLike || isLikesLoading ? (
					<Loader2 size={20} className='animate-spin' />
				) : (
					<>
						<ThumbsUp className='text-current w-5' />
						<span className='text-current'>{likesCount}</span>
					</>
				)}
			</Button>
			<Button
				variant='ghost'
				disabled={!userId || isTogglingDislike || isDislikesLoading}
				onClick={handleDislike}
				className={`cursor-pointer flex justify-center items-center gap-1 px-2 p-1 ${
					isDislikedByCurrentUser
						? 'text-blue-500 bg-blue-100/50 hover:bg-blue-100/30 hover:text-blue-400'
						: 'text-gray-500 hover:text-gray-400'
				}`}>
				{isTogglingDislike || isDislikesLoading ? (
					<Loader2 size={20} className='animate-spin' />
				) : (
					<>
						<ThumbsDown className='text-current w-5' />
						<span className='text-current'>{dislikesCount}</span>
					</>
				)}
			</Button>
		</div>
	);
};
export default CommentInteractions;
