'use client';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import WordCloud from '@/components/tags/word-cloud';
import { Button } from '@/components/ui/button';
import { createWordDataFromTags } from '@/lib/utils';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { DialogTitle } from '@radix-ui/react-dialog';
import useWindowDimensions from '@/hooks/use-window-dimensions';

type TagsUsage = {
	name: string;
	_count: {
		templates: number;
	};
};

const WordCloudDialog = ({ tags }: { tags: TagsUsage[] }) => {
	const { height, width } = useWindowDimensions();
	const [isOpen, setIsOpen] = useState(false);
	const t = useTranslations('WordCloudDialog');

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button onClick={() => setIsOpen(true)}>{t('triggerButton')}</Button>
			</DialogTrigger>
			<DialogContent className='w-full max-w-[1200px] flex items-center justify-center overflow-hidden'>
				<DialogTitle></DialogTitle>
				<WordCloud
					width={width}
					height={height - 100}
					tags={createWordDataFromTags(tags)}
					setIsOpen={setIsOpen}
				/>
			</DialogContent>
		</Dialog>
	);
};
export default WordCloudDialog;
