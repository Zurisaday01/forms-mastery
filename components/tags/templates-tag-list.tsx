import { getTemplatesByTagName } from '@/actions/tag.actions';
import { ScrollArea } from '../ui/scroll-area';
import { User } from '@prisma/client';
import TemplateCard from '../templates/template-card';
import { getTranslations } from 'next-intl/server';

const TemplatesTagList = async ({
	selectedTag,
}: {
	selectedTag: string | undefined;
}) => {
	const templatesByTagName = await getTemplatesByTagName(selectedTag || '');
	const t = await getTranslations('TemplatesTagList');

	return (
		<ScrollArea className='h-full mt-5'>
			<div className='cards_grid'>
				{templatesByTagName?.map(template => (
					<TemplateCard
						id={template.id as string}
						key={template.id}
						title={template.title}
						description={template.description as string}
						createdAt={template.createdAt}
						tags={template.tags}
						user={template.author as User}
					/>
				))}
			</div>
			{templatesByTagName.length === 0 && selectedTag && (
				<p>{t('noTemplates')}</p>
			)}
			{templatesByTagName.length === 0 && !selectedTag && (
				<p className='w-full'>{t('instruction')}</p>
			)}
		</ScrollArea>
	);
};
export default TemplatesTagList;
