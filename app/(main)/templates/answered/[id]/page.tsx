import { getFormsByUserIdAndTemplateId } from '@/actions/form.actions';
import { auth } from '@/auth';
import SubmittedFormCard from '@/components/forms/submitted-form-card';
import { getTranslations } from 'next-intl/server';

const AnswersPage = async ({
	params,
}: {
	params: { id: string };
}) => {
	const session = await auth();

	const t = await getTranslations('AnswersPage');

	const forms = await getFormsByUserIdAndTemplateId(
		session?.user?.id as string,
		params.id as string
	);
	return (
		<section className='mt-8 mb-8 flex flex-col gap-5'>
			<h1 className='text-2xl font-barlow font-bold'>{t('title')}</h1>
			<div className='flex flex-col gap-3'>
				{forms.map(form => (
					<SubmittedFormCard
						key={form.id}
						formId={form.id}
						user={form.user}
						createdAt={form.createdAt}
						modifiedBy='user'
					/>
				))}
			</div>
		</section>
	);
};
export default AnswersPage;
