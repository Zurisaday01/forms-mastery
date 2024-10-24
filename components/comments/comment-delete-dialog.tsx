'use client';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Trash2 } from 'lucide-react';
import { useTransition } from 'react';
import Spinner from '../spinner';
import { deleteComment } from '@/actions/comment.actions';

interface CommentDeleteDialogProps {
	commentId: string;
}

const CommentDeleteDialog = ({ commentId }: CommentDeleteDialogProps) => {
	const [isPending, startTransition] = useTransition();

	const handleDelete = () => {
		startTransition(async () => {
			try {
				// delete comment
				await deleteComment(commentId);

				toast({
					title: 'Comment deleted',
					description: 'Your comment has been deleted.',
				});
			} catch (error: unknown) {
				toast({
					title: 'Something went wrong',
					description: (error as Error).message,
				});
			}
		});
	};

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button variant='ghost' className='p-1 h-min'>
					<Trash2 className='text-gray-500 w-3 h-3' />
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently delete your
						comment.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction disabled={isPending} onClick={handleDelete}>
						{isPending ? <Spinner className='h-5 w-5' /> : 'Continue'}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};
export default CommentDeleteDialog;
