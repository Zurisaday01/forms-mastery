import CreateQuestionsContent from '@/components/templates/create-questions-content';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SetTags from '@/components/templates/set-tags';
import HelpModal from '@/components/help-modal';
import { TemplateProvider } from '@/context/template-context';
import { auth } from '@/auth';
import { User } from 'next-auth';
import PublishTemplateButton from '@/components/templates/publish-template-button';
import { getAllAvailableTags } from '@/actions/tag.actions';
import FormPreviewContent from '@/components/templates/form-preview-content';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

// PROTECTED PAGE
const CreateTemplatePage = async () => {
	const session = await auth();
	const tags = await getAllAvailableTags();
	const t = await getTranslations('CreateTemplatePage');

	if (!session) {
		redirect('/api/auth/signin?callbackUrl=/protected');
	}

	return (
		<TemplateProvider>
			<section className='mt-8  mb-8 relative'>
				<div className='w-full flex justify-between mb-6'>
					<HelpModal
						title={t('helpTitle')}
						description={t('helpDescription')}
						content={
							<ul>
								<li>{t('helpMessageli1')}</li>
								<li>{t('helpMessageli2')}</li>
								<li>{t('helpMessageli3')}</li>
								<li>{t('helpMessageli4')}</li>
								<li>{t('helpMessageli5')}</li>
							</ul>
						}
					/>
					<PublishTemplateButton user={session?.user as User} />
				</div>
				<Tabs defaultValue='questions' className='w-full'>
					<TabsList className='flex justify-center bg-transparent gap-4'>
						<TabsTrigger
							value='questions'
							className='data-[state=active]:border-blue-500 border-b-2 data-[state=active]:text-blue-500 data-[state=active]:shadow-none rounded-none'>
							{t('tabQuestions')}
						</TabsTrigger>
						<TabsTrigger
							value='tags'
							className='data-[state=active]:border-blue-500 border-b-2 data-[state=active]:text-blue-500 data-[state=active]:shadow-none rounded-none'>
							{t('tabTags')}
						</TabsTrigger>
						<TabsTrigger
							value='preview'
							className='data-[state=active]:border-blue-500 border-b-2 data-[state=active]:text-blue-500 data-[state=active]:shadow-none rounded-none'>
							{t('tabPreview')}
						</TabsTrigger>
					</TabsList>

					<TabsContent value='questions'>
						<CreateQuestionsContent />
					</TabsContent>
					<TabsContent value='tags'>
						<SetTags tagsData={tags} />
					</TabsContent>
					<TabsContent value='preview'>
						<FormPreviewContent />
					</TabsContent>
				</Tabs>
			</section>
		</TemplateProvider>
	);
};
export default CreateTemplatePage;
