import CommentUpdateDialog from './comment-update-dialog';
import CommentDeleteDialog from './comment-delete-dialog';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';

import { getTranslations } from 'next-intl/server';

interface CommentAuthorOptionsProps {
	commentId: string;
}
const CommentAuthorOptions = async ({
	commentId,
}: CommentAuthorOptionsProps) => {
	const t = await getTranslations('CommentAuthorOptions');

	return (
		<div className='flex gap-1'>
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger>
						<CommentUpdateDialog commentId={commentId} />
					</TooltipTrigger>
					<TooltipContent>
						<p>{t('update')}</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>

			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger>
						<CommentDeleteDialog commentId={commentId} />
					</TooltipTrigger>
					<TooltipContent>
						<p>{t('delete')}</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		</div>
	);
};
export default CommentAuthorOptions;
