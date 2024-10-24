import { getResponsesByTemplateId } from '@/actions/template.actions';
import { convertToKebabCase, getAnswerCounts } from '@/lib/utils';
import SimpleBar from '../simple-bar';
import SimplePieChart from '../simple-pie-chart';
import VerticalBarChart from '../vertical-bar-chart';
import DisplayShortAnswers from '../display-short-answers';
import { getTranslations } from 'next-intl/server';

interface ResponsesContentProps {
	templateId: string;
}

const ResponsesContent = async ({ templateId }: ResponsesContentProps) => {
	const responses = await getResponsesByTemplateId(templateId);
	const t = await getTranslations('ResponsesContent');

	return (
		<div className='flex flex-col gap-6'>
			{responses.map(response => {
				console.log('rs', response.answers.length);
				return (
					<div key={response.id}>
						<div className='flex flex-col gap-1 mb-3'>
							<h2 className='font-bold font-barlow text-xl'>
								{response.title}
							</h2>
							<p className='text-sm text-gray-500'>
								{response.answers.length} {t('responseLabel')}
								{(response.answers.length > 2 ||
									response.answers.length === 0) &&
									's'}
							</p>
						</div>

						<div>
							{response.answerType === 'number' &&
								response.answers.length !== 0 && (
									<div className='h-[400px]'>
										<SimpleBar data={getAnswerCounts(response.answers)} />
									</div>
								)}
						</div>

						<div>
							{response.answerType === 'long' && (
								<ul className='flex gap-2 flex-col'>
									{response.answers.map((answer: Answer) => {
										return (
											<li
												key={answer.id}
												className='flex flex-col gap-3 bg-blue-100 rounded-sm p-2'>
												{answer.answers.map((item, index) => {
													return <p key={`${answer.id}${index}`}>{item}</p>;
												})}
											</li>
										);
									})}
								</ul>
							)}
						</div>

						<div>
							{response.answerType === 'short' && (
								<DisplayShortAnswers answers={response.answers} />
							)}
						</div>

						<div>
							{convertToKebabCase(response.answerType) === 'multiple-choice' &&
								response.answers.length !== 0 && (
									<div className='h-[400px]'>
										<SimplePieChart data={getAnswerCounts(response.answers)} />
									</div>
								)}
						</div>

						<div>
							{convertToKebabCase(response.answerType) === 'checkbox' &&
								response.answers.length !== 0 && (
									<div className='h-[400px] w-full'>
										<VerticalBarChart
											data={getAnswerCounts(response.answers)}
										/>
									</div>
								)}
						</div>

						{response.answers.length === 0 && (
							<p>{t('noResponsesToQuestion')}</p>
						)}
					</div>
				);
			})}
		</div>
	);
};
export default ResponsesContent;
