import { getTranslations } from 'next-intl/server';
import TemplateCard from './templates/template-card';
import { User } from '@prisma/client';

interface TemplatesListProps {
	templates: Template[];
}

const TemplatesList = async ({ templates }: TemplatesListProps) => {
	const t = await getTranslations('TemplatesList');
	return (
		<div className='cards_grid'>
			{templates.map(template => (
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

			{templates.length === 0 && <p>{t('noTemplates')}</p>}
		</div>
	);
};
export default TemplatesList;
