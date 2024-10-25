import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';
import CommentAuthorOptions from './comment-author-options';
import CommentInteractions from './comment-interactions';
import {
	getDislikesByCommentId,
	getLikesByCommentId,
} from '@/actions/comment.actions';
import { es, enUS } from 'date-fns/locale';
import { getLocale, getTranslations } from 'next-intl/server';

const CommentCard = async ({
	comment,
	userSessionId,
}: {
	comment: Comment;
	userSessionId: string;
}) => {
	const currentLocale = await getLocale();
	const t = await getTranslations('CommentCard');
	const likes = await getLikesByCommentId(comment.id);
	const dislikes = await getDislikesByCommentId(comment.id);

	return (
		<div
			key={comment.id}
			className='flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all '>
			<div className='flex w-full flex-col gap-1'>
				<div className='flex items-center'>
					<div className='flex items-center gap-2'>
						<div className='font-semibold'>
							{comment.author.firstName} {''} {comment.author.lastName}
						</div>
						{comment.author.id === userSessionId && (
							<CommentAuthorOptions commentId={comment.id} />
						)}
					</div>
					<div className='ml-auto text-sm text-muted-foreground'>
						{t('createdTime', {
							message: formatDistanceToNow(new Date(comment.createdAt), {
								addSuffix: true,
								locale: currentLocale === 'es' ? es : enUS,
							}),
						})}
					</div>
				</div>
			</div>
			<div className='line-clamp-2 text-xs text-muted-foreground'>
				{comment.content}
			</div>

			<CommentInteractions
				commentId={comment.id}
				userId={userSessionId}
				initialLikes={likes.length}
				initialDislikes={dislikes.length}
			/>
		</div>
	);
};
export default CommentCard;
