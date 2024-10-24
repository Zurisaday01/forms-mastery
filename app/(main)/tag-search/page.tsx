import { getAllAvailableTags, getAllTagsUsages } from '@/actions/tag.actions';
import { notFound } from 'next/navigation';
import TemplatesTagList from '@/components/tags/templates-tag-list';

import WordCloudDialog from '@/components/tags/word-cloud-dialog';
import { getTranslations } from 'next-intl/server';

const TagSearchPage = async ({
	searchParams,
}: {
	searchParams: { [key: string]: string | string[] | undefined };
}) => {
	const tags = await getAllAvailableTags();
	const tagsUsages = await getAllTagsUsages();

	const selectedTag = searchParams.tag as string | undefined;
	const t = await getTranslations('TagSearchPage');

	if (!tags) return notFound();

	return (
		<section className='relative pb-8 h-full'>
			<header className='flex items-center mt-8 justify-between gap-4'>
				<h1 className='text-2xl font-barlow font-bold '>{t('title')}</h1>
				<WordCloudDialog tags={tagsUsages} />
			</header>

			<TemplatesTagList selectedTag={selectedTag} />

			
		</section>
	);
};
export default TagSearchPage;
