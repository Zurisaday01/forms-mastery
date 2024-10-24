import { getTemplateById } from '@/actions/template.actions';
import { auth } from '@/auth';
import TemplateForm from '@/components/forms/template-form';
import { notFound, redirect } from 'next/navigation';

// PROTECTED PAGE
const CreateFormPage = async ({
	searchParams,
}: {
	searchParams: { [key: string]: string | string[] | undefined };
}) => {
	const session = await auth();
	const template = await getTemplateById(searchParams.templateId as string);

	if (!session) {
		redirect('/api/auth/signin?callbackUrl=/protected');
	}

	if (!template) {
		notFound();
	}

	const { title, description, questions } = template;

	return (
		<section className='mt-8'>
			<TemplateForm
				templateId={searchParams.templateId as string}
				title={title}
				description={description as string}
				questions={questions as unknown as Question[]}
			/>
		</section>
	);
};

export default CreateFormPage;
