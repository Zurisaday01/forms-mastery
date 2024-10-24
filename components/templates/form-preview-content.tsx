'use client';
import { useTemplateContext } from '@/context/template-context';
import TemplateForm from '../forms/template-form';
import { useTranslations } from 'next-intl';

const FormPreviewContent = () => {
	const t = useTranslations('FormPreviewContent');
	const { title, description, questions } = useTemplateContext();

	return (
		<TemplateForm
			title={!title ? t('untitled') : title}
			description={!description ? t('noDescription') : description}
			questions={questions}
			isPreview
		/>
	);
};
export default FormPreviewContent;
