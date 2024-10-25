import TemplatesOptions from '@/components/templates/templates-options';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

interface TemplatesDashboardProps {
	allTemplates: Template[];
	latestTemplates: Template[];
	popularTemplates: Template[];
}

const TemplatesDashboard = async ({
	allTemplates,
	latestTemplates,
	popularTemplates,
}: TemplatesDashboardProps) => {
	const t = await getTranslations('HomePage');
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

				<TemplatesOptions
					templates={allTemplates}
					type='all'
					subtitle={t('subTitleAll')}
					description={t('descriptionAll')}
				/>
			</div>
		</>
	);
};
export default TemplatesDashboard;
