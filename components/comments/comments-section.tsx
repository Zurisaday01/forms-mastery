import CreateUpdateComment from '../forms/create-update-comment';

import { auth } from '@/auth';
import { getAllCommentsByTemplateId } from '@/actions/comment.actions';
import { notFound } from 'next/navigation';
import CommentCard from './comment-card';
import { getTranslations } from 'next-intl/server';

const CommentsSection = async ({ templateId }: { templateId: string }) => {
	const t = await getTranslations('CommentsSection');
	const session = await auth();
	const comments = await getAllCommentsByTemplateId(templateId);

	if (!comments) {
		notFound();
	}

	return (
		<section className='flex flex-col gap-3'>
			<h2 className='text-2xl font-barlow font-bold mt-8'>
				{t('heading')}{' '}
				<span className='text-gray-400 text-base'>({comments.length})</span>
			</h2>
			<CreateUpdateComment
				authorId={session?.user?.id}
				templateId={templateId}
			/>
			<div className='flex flex-col gap-2 pt-0'>
				{comments.length === 0 ? (
					<p className='text-muted-foreground text-sm'>{t('noComments')}</p>
				) : (
					comments.map(comment => (
						<CommentCard
							key={comment.id}
							userSessionId={session?.user?.id as string}
							comment={comment as Comment}
						/>
					))
				)}
			</div>
		</section>
	);
};
export default CommentsSection;
