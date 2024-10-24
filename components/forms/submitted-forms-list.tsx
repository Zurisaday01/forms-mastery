import { getFormsByTemplateId } from '@/actions/form.actions';
import SubmittedFormCard from './submitted-form-card';
import { getTranslations } from 'next-intl/server';
import { auth } from '@/auth';

interface SubmittedFormsListProps {
	templateId: string;
}

const SubmittedFormsList = async ({ templateId }: SubmittedFormsListProps) => {
	const forms = await getFormsByTemplateId(templateId);
	const session = await auth();
	const t = await getTranslations('SubmittedFormsList');

	if (forms.length === 0) return <p>{t('noForms')}</p>;

	return (
		<div className='flex flex-col gap-3'>
			{forms.map(form => (
				<SubmittedFormCard
					key={form.id}
					formId={form.id}
					user={form.user}
					createdAt={form.createdAt}
					modifiedBy={session?.user?.role === 'ADMIN' ? 'user' : 'creator'}
				/>
			))}
		</div>
	);
};
export default SubmittedFormsList;
