'use client';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { Button } from '../ui/button';
import { useLikes } from '@/features/likes/use-likes';
import { useToggleLike } from '@/features/likes/use-toggle-like';
import { Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useLocale, useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';

interface LikeTemplateProps {
	templateId: string;
	initialLikes: number;
}

const LikeTemplate = ({ templateId, initialLikes }: LikeTemplateProps) => {
	const { status } = useSession();

	// get the current user session
	const tToast = useTranslations('Toast');
	const currentLocale = useLocale();

	// Fetch likes count using react-query
	const {
		data: { likesCount, isLikedByCurrentUser },
		isLoading: isLikesLoading,
	} = useLikes({
		initialLikesCount: initialLikes,
		templateId,
	});

	// Handle like toggling
	const { isLoadingToggle: isToggling, toggleLike } = useToggleLike();

	const handleToggle = () => {
		const featureLocale =
			currentLocale === 'en'
				? 'like this template'
				: 'darle like a esta plantilla';
		// If user is not logged in, send feedback to sign in
		if (status === 'unauthenticated') {
			toast({
				variant: 'destructive',
				title: tToast('signInTitle'),
				description: tToast('signInTitle', { feature: featureLocale }),
				duration: 1000,
			});

			return;
		}

		// Optimistically update likes count
		toggleLike({
			templateId,
		});
	};

	return (
		<Button
			onClick={handleToggle}
			variant='ghost'
			disabled={isToggling || isLikesLoading || status === 'loading'} // Disable button while toggling or loading likes
			className={`${
				isLikedByCurrentUser ? 'bg-red-100/50 hover:bg-red-100/30' : ''
			} flex justify-center items-center gap-2 py-1 px-3`}>
			{isToggling || isLikesLoading || status === 'loading' ? (
				// Show loader if toggling or loading likes
				<Loader2 size={20} className='animate-spin' />
			) : (
				<>
					{/* Render heart icon based on the like state */}
					{isLikedByCurrentUser ? <FaHeart color='red' /> : <FaRegHeart />}
					{/* Show the likes count only when not loading */}
					<span>{likesCount}</span>
				</>
			)}
		</Button>
	);
};
export default LikeTemplate;
