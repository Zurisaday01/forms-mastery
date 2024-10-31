import { User } from '@prisma/client';
import Link from 'next/link';
import { ScrollArea } from '@/components/ui/scroll-area';
import TemplateEngagementMetrics from './template-engagement-metrics';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';
import { es, enUS } from 'date-fns/locale';
import { getLocale, getTranslations } from 'next-intl/server';

interface TemplateCardProps {
	id: string;
	title: string;
	description: string;
	createdAt: Date;
	tags: Tag[];
	user: User;
	likesCount?: number;
	formsCount?: number;
	commentsCount?: number;
}

const TemplateCard = async ({
	id,
	title,
	description,
	tags,
	user,
	createdAt,
	likesCount,
	formsCount,
	commentsCount,
}: TemplateCardProps) => {
	const currentLocale = await getLocale();
	const t = await getTranslations('TemplateCard');

	return (
		<div className='shadow-lg border border-primary/10 rounded-md w-full'>
			<div className='flex items-center justify-between'>
				<div className='flex items-center space-x-2 p-4'>
					<div>
						<h4 className='text-xl leading-5 font-semibold font-barlow bg-gradient-to-r from-blue-700 to-purple-950 bg-clip-text text-transparent dark:text-white line-clamp-2 w-full h-[42px]'>
							<Link href={`/templates/view/${id}`}>{title}</Link>{' '}
						</h4>
						<h3 className='text-gray-800 mt-1 text-sm font-semibold font-barlow dark:text-gray-200'>
							{user?.firstName} {user?.lastName}
						</h3>
						<p className='text-gray-500 text-[12px] dark:text-gray-300'>
							{t('createdTime', {
								message: formatDistanceToNow(new Date(createdAt), {
									addSuffix: true,
									locale: currentLocale === 'es' ? es : enUS,
								}),
							})}
						</p>
					</div>
				</div>
			</div>
			{/* tags */}

			<div className='px-4 flex flex-col gap-2'>
				<p className='line-clamp-3 text-gray-600 dark:text-gray-300 h-[70px]'>
					{description}
				</p>
				<ScrollArea>
					<div className='flex gap-2 flex-wrap h-16'>
						{tags?.map(tag => (
							<span
								key={tag.id}
								className='bg-blue-600 px-2 h-min py-[4px] text-white text-sm rounded-full'>
								{tag.name}
							</span>
						))}
					</div>
				</ScrollArea>
			</div>

			<TemplateEngagementMetrics
				templateId={id}
				likesCount={likesCount as number}
				formsCount={formsCount as number}
				commentsCount={commentsCount as number}
			/>
		</div>
	);
};
export default TemplateCard;
