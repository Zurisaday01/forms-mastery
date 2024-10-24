import { getMyTemplates } from '@/actions/template.actions';
import { auth } from '@/auth';
import TemplateCard from '@/components/templates/template-card';
import { User } from '@prisma/client';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';

const MyTemplatesPage = async () => {
	const session = await auth();

	const templates = await getMyTemplates(session?.user?.id as string);

	const t = await getTranslations('MyTemplatesPage');

	if (!templates) {
		return notFound();
	}

	return (
		<section className='mt-8 mb-8 flex flex-col gap-5'>
			<h1 className='text-2xl font-barlow font-bold'>{t('title')}</h1>
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
			</div>
			{templates.length === 0 && <p>{t('noTemplates')}</p>}
		</section>
	);
};
export default MyTemplatesPage;
