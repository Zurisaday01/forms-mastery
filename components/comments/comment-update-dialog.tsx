import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import CreateUpdateComment from '../forms/create-update-comment';
import { getCommentById } from '@/actions/comment.actions';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

interface CommentUpdateDialogProps {
	commentId: string;
}

const CommentUpdateDialog = async ({ commentId }: CommentUpdateDialogProps) => {
	const comment = await getCommentById(commentId);
	const t = await getTranslations('CommentUpdateDialog');

	if (!comment) {
		return notFound();
	}

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant='ghost' className='p-1 h-min'>
					<Pencil className='text-muted-foreground w-3 h-3' />
				</Button>
			</DialogTrigger>
			<DialogContent className='sm:max-w-md'>
				<DialogHeader>
					<DialogTitle>{t('heading')}</DialogTitle>
					<DialogDescription>{t('description')}</DialogDescription>
				</DialogHeader>
				<CreateUpdateComment
					templateId={comment.templateId}
					commentId={commentId}
					authorId={comment.author.id}
					content={comment.content}
					type='update'
				/>
			</DialogContent>
		</Dialog>
	);
};
export default CommentUpdateDialog;
