import {
	getTemplateById,
	hasUserAnsweredTemplateForms,
} from '@/actions/template.actions';
import { auth } from '@/auth';
import CommentsSection from '@/components/comments/comments-section';
import TemplateForm from '@/components/forms/template-form';
import HelpModal from '@/components/help-modal';
import TemplateEngagementMetrics from '@/components/templates/template-engagement-metrics';
import { Button } from '@/components/ui/button';
import { Crown } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const ViewTemplatePage = async ({ params }: { params: { id: string } }) => {
	const t = await getTranslations('TemplatesViewPage');

	const template = await getTemplateById(params.id as string);

	if (!template) {
		notFound();
	}

	const { title, description, questions, tags } = template;

	// filter questions by isVisible
	const visibleQuestions = questions.filter(question => question.isVisible);

	const session = await auth();

	const hasUserAnswered = await hasUserAnsweredTemplateForms(
		session?.user?.id,
		params.id as string
	);

	return (
		<section className='mt-8 mb-8'>
			<div className='w-full flex justify-between mb-6'>
				<HelpModal
					title={t('helpTitle')}
					description={t('helpDescription')}
					content={<p>{t('helpMessage')}</p>}
				/>

				<div className='flex gap-2'>
					{hasUserAnswered && (
						<Button asChild variant='secondary'>
							<Link href={`/templates/answered/${params.id}`}>
								{t('myFormsButton')}
							</Link>
						</Button>
					)}

					{session?.user?.id === template.author.id && (
						<Button asChild variant='outline'>
							<Link
								href={`/templates/manage/${params.id}`}
								className='flex gap-2 items-center'>
								<Crown className='w-5 text-gray-500' />
								{t('mangeButton')}
							</Link>
						</Button>
					)}
					<Button asChild>
						<Link href={`/forms/new?templateId=${params.id}`}>
							{t('fillFormButton')}
						</Link>
					</Button>
				</div>
			</div>
			<div className='flex flex-col gap-2 mb-4'>
				<h1 className='text-2xl font-barlow font-bold'>{t('heading')}</h1>
				<p>{t('description')}</p>
			</div>
			<div className='flex flex-col-reverse gap-4 lg:flex-row items-start'>
				<TemplateForm
					title={title}
					description={description as string}
					questions={visibleQuestions as unknown as Question[]}
					templateId={template.id}
					isPreview
				/>

				<div className='flex lg:flex-col gap-3  w-full lg:w-min'>
					<div className='flex gap-2 flex-col border border-gray-400 rounded-md p-2 w-full'>
						<h2 className='text-2xl font-barlow font-bold'>{t('tagsTitle')}</h2>
						<div className='flex items-center gap-2 flex-wrap'>
							{tags.length > 0 ? (
								tags.map(tag => (
									<span
										key={tag.id}
										className='text-xs bg-blue-500 text-white rounded-full px-2 py-1'>
										{tag.name}
									</span>
								))
							) : (
								<p className='text-sm text-gray-500'>{t('noTags')}</p>
							)}
						</div>
					</div>
					<div className='flex gap-2 flex-col border  border-gray-400 rounded-md p-2  w-full'>
						<h2 className='text-2xl font-barlow font-bold'>
							{t('engagementTitle')}
						</h2>
						<TemplateEngagementMetrics templateId={template.id} />
					</div>
				</div>
			</div>

			<CommentsSection templateId={template.id} />
		</section>
	);
};
export default ViewTemplatePage;
