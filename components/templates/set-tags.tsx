'use client';
import { Button } from '@/components/ui/button';
import { MultipleCombox } from '@/components/ui/multiple-combox-responsive';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { useTemplateContext } from '@/context/template-context';
import { createTagOptions, formatTagsToStringArray } from '@/lib/utils';
import { CreateTagForm } from '../forms/create-tag-form';
import { useLocale, useTranslations } from 'next-intl';

// Ensure each tag is unique and normalized (lowercase) to avoid duplicates.
const SetTags = ({ tagsData }: { tagsData: Tag[] }) => {
	const { tags, setTags } = useTemplateContext();
	const t = useTranslations('SetTags');
	const currentLocale = useLocale();

	return (
		<div className='flex flex-col gap-8 lg:gap-3  lg:flex-row lg:items-center lg:justify-between'>
			<div>
				<h2 className='font-bold font-barlow text-xl mb-2'>{t('title')}</h2>
				<MultipleCombox
					options={createTagOptions(formatTagsToStringArray(tagsData))}
					data={tags}
					onAdd={setTags}
					searchFor={currentLocale === 'es' ? 'etiquetas' : 'tags'}
				/>
			</div>

			<div className='w-min'>
				<Dialog>
					<DialogTrigger asChild>
						<Button>{t('createTagButton')}</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle className='font-barlow text-2xl'>
								{t('createTagButton')}
							</DialogTitle>
							<DialogDescription>{t('createTagDescription')}</DialogDescription>
						</DialogHeader>
						<CreateTagForm />
					</DialogContent>
				</Dialog>
			</div>
		</div>
	);
};
export default SetTags;
