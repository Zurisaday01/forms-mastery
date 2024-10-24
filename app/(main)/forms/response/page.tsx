import { getTemplateById } from '@/actions/template.actions';
import ContentCard from '@/components/content-card';
import { Button } from '@/components/ui/button';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const ResponsePage = async ({
	searchParams,
}: {
	searchParams: { [key: string]: string | string[] | undefined };
}) => {
	const template = await getTemplateById(searchParams.templateId as string);
	const t = await getTranslations('ResponsePage');

	if (!template) {
		notFound();
	}

	return (
		<section className='lg:w-[800px] mx-auto space-y-4 mt-8'>
			<ContentCard type='info'>
				<h1 className='text-2xl font-barlow font-bold'>{template.title}</h1>
				<p className='text-gray-600'>{t('description')}</p>

				<div className='mt-4'>
					<Button asChild variant='outline'>
						<Link href={`/templates/view/${searchParams.templateId}`}>
							{t('goToButton')}
						</Link>
					</Button>
				</div>
			</ContentCard>
		</section>
	);
};
export default ResponsePage;
