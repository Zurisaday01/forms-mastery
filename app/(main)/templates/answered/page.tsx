import { getAnsweredTemplatesByUserId } from '@/actions/form.actions';
import { auth } from '@/auth';
import TemplateCard from '@/components/templates/template-card';
import { User } from '@prisma/client';
import { getTranslations } from 'next-intl/server';

const AnsweredPage = async () => {
	const session = await auth();

	const t = await getTranslations('AnsweredPage');

	const templates = await getAnsweredTemplatesByUserId(
		session?.user?.id as string
	);

	return (
		<section className='mt-8 mb-8 flex flex-col gap-5'>
			<h1 className='text-2xl font-barlow font-bold'>{t('title')}</h1>
			<div className='cards_grid'>
				{templates.map(template => (
					<TemplateCard
						likesCount={template._count?.likes}
						commentsCount={template._count?.comments}
						formsCount={template._count?.forms}
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
			{templates.length === 0 && <p>{t('noAnswers')}</p>}
		</section>
	);
};
export default AnsweredPage;
