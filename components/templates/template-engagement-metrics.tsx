import { FaRegCommentDots } from 'react-icons/fa';
import LikeTemplate from './like-template';
import { IoDocumentTextOutline } from 'react-icons/io5';
import { getLikesByTemplateId } from '@/actions/template.actions';
import { getFormsByTemplateId } from '@/actions/form.actions';
import { getAllCommentsByTemplateId } from '@/actions/comment.actions';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { getTranslations } from 'next-intl/server';

const TemplateEngagementMetrics = async ({
	templateId,
}: {
	templateId: string;
}) => {
	const likes = await getLikesByTemplateId(templateId);
	const forms = await getFormsByTemplateId(templateId);
	const comment = await getAllCommentsByTemplateId(templateId);

	const t = await getTranslations('EngagementMetrics');

	return (
		<div className='flex items-center justify-between text-gray-500 dark:text-white p-4'>
			<LikeTemplate templateId={templateId} initialLikes={likes.length} />
			<div className='flex justify-center items-center gap-2 dark:hover:bg-gray-50/20 hover:bg-gray-50 rounded-md py-1 px-3'>
				<FaRegCommentDots />
				<span>{comment.length}</span>
			</div>
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<div className='flex justify-center items-center gap-2 dark:hover:bg-gray-50/20 hover:bg-gray-50 rounded-md py-1 px-3'>
							<IoDocumentTextOutline />
							<span>{forms.length}</span>
						</div>
					</TooltipTrigger>
					<TooltipContent>
						<p>{t('totalForms')}</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		</div>
	);
};
export default TemplateEngagementMetrics;
