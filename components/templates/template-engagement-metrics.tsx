import { FaRegCommentDots } from 'react-icons/fa';
import LikeTemplate from './like-template';
import { IoDocumentTextOutline } from 'react-icons/io5';

import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { getTranslations } from 'next-intl/server';

interface TemplateEngagementMetricsProps {
	likesCount: number;
	formsCount: number;
	commentsCount: number;
	templateId: string;
}

const TemplateEngagementMetrics = async ({
	likesCount,
	formsCount,
	commentsCount,
	templateId,
}: TemplateEngagementMetricsProps) => {

	const t = await getTranslations('EngagementMetrics');

	return (
		<div className='flex items-center justify-between text-gray-500 dark:text-white p-4'>
			<LikeTemplate templateId={templateId} initialLikes={likesCount} />
			<div className='flex justify-center items-center gap-2 dark:hover:bg-gray-50/20 hover:bg-gray-50 rounded-md py-1 px-3'>
				<FaRegCommentDots />
				<span>{commentsCount}</span>
			</div>
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<div className='flex justify-center items-center gap-2 dark:hover:bg-gray-50/20 hover:bg-gray-50 rounded-md py-1 px-3'>
							<IoDocumentTextOutline />
							<span>{formsCount}</span>
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
