import { useTranslations } from 'next-intl';
import TemplatesOptions from '@/components/templates/templates-options';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

interface TemplatesDashboardProps {
	allTemplates: Template[];
	latestTemplates: Template[];
	popularTemplates: Template[];
	searchParams: { [key: string]: string | string[] | undefined };
}

const TemplatesDashboard = ({
	allTemplates,
	latestTemplates,
	popularTemplates,
	searchParams,
}: TemplatesDashboardProps) => {
	const t = useTranslations('HomePage');

	const keyString = `${searchParams.ownership}-${searchParams.sort}`;
	return (
		<>
			<div className='w-full flex justify-end pt-4'>
				<Button className='flex items-center gap-1' asChild>
					<Link href='/templates/new'>
						<Plus size={16} />
						{t('createButton')}
					</Link>
				</Button>
			</div>
			<div className='mt-4 flex flex-col gap-9 md:overflow-hidden pb-8'>
				<TemplatesOptions
					templates={popularTemplates}
					type='popular'
					subtitle={t('subTitlePopular')}
					description={t('descriptionPopular')}
				/>
				<TemplatesOptions
					templates={latestTemplates}
					type='latest'
					subtitle={t('subTitleLatest')}
					description={t('descriptionLatest')}
				/>

				<Suspense key={keyString} fallback={<p>Loading...</p>}>
					<TemplatesOptions
						templates={allTemplates}
						type='all'
						subtitle={t('subTitleAll')}
						description={t('descriptionAll')}
					/>
				</Suspense>
			</div>
		</>
	);
};
export default TemplatesDashboard;
