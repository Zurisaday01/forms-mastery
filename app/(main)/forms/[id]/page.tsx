import { getFormById } from '@/actions/form.actions';
import TemplateForm from '@/components/forms/template-form';
import { User } from '@prisma/client';

const mapObjectToAnswersShape = (input: InputObject) => {
	// Create a mapping of questionId to answer
	const answerMap = new Map<string, Response>();

	// Populate the answer map
	for (const response of input.Response) {
		answerMap.set(response.questionId, response);
	}

	// Map the template questions to the desired answer structure
	const mappedAnswers = input.template.questions.map(question => {
		const response = answerMap.get(question.id);
		return {
			questionId: question.id,
			answerType: question.answerType,
			answers: response ? response.answers : [], // Get answers if exists, else empty array
		};
	});

	return mappedAnswers;
};

const FormAnswersPage = async ({
	params,
	searchParams,
}: {
	params: { [key: string]: string | string[] | undefined };
	searchParams: { [key: string]: string | string[] | undefined };
}) => {
	const form = await getFormById(params.id as string);
	const modifiedBy = searchParams.modifiedBy as string;

	return (
		<section className='mt-8'>
			<TemplateForm
				templateId={form?.template?.id as string}
				title={form?.template?.title as string}
				description={form?.template?.description as string}
				questions={form?.template?.questions as unknown as Question[]}
				answers={mapObjectToAnswersShape(form as unknown as InputObject)}
				author={form?.user as User}
				formId={form?.id as string}
				responses={form?.Response as Response[]}
				isOwner
				updateForm
				isPreview={modifiedBy === 'creator'}
				modifiedBy={modifiedBy}
			/>
		</section>
	);
};
export default FormAnswersPage;
