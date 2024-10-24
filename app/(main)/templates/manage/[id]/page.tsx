import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SetTags from '@/components/templates/set-tags';
import HelpModal from '@/components/help-modal';
import { TemplateProvider } from '@/context/template-context';
import { auth } from '@/auth';
import { User } from 'next-auth';
import PublishTemplateButton from '@/components/templates/publish-template-button';
import { getAllAvailableTags } from '@/actions/tag.actions';
import FormPreviewContent from '@/components/templates/form-preview-content';
import { Badge } from '@/components/ui/badge';
import { notFound } from 'next/navigation';
import { getTemplateById } from '@/actions/template.actions';
import UpdateQuestionsContent from '@/components/templates/update-questions-content';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import ResponsesContent from '@/components/templates/responses-content';
import { getFormsByTemplateId } from '@/actions/form.actions';
import SubmittedFormsList from '@/components/forms/submitted-forms-list';
import { getTranslations } from 'next-intl/server';
import DeleteTemplate from '@/components/templates/delete-template';

const ManageTemplatePage = async ({ params }: { params: { id: string } }) => {
	const session = await auth();
	const tags = await getAllAvailableTags();

	const template = await getTemplateById(params.id as string);
	const forms = await getFormsByTemplateId(params.id as string);

	const tCreate = await getTranslations('CreateTemplatePage');
	const tManage = await getTranslations('ManageTemplatePage');

	if (!template) {
		notFound();
	}

	return (
		<TemplateProvider>
			<section className='mt-8 mb-8 relative'>
				<div className='w-full flex justify-between mb-6'>
					<div className='flex gap-2'>
						<HelpModal
							title={tCreate('helpTitle')}
							description={tCreate('helpDescription')}
							content={
								<ul>
									<li>{tCreate('helpMessageli1')}</li>
									<li>{tCreate('helpMessageli2')}</li>
									<li>{tCreate('helpMessageli3')}</li>
									<li>{tCreate('helpMessageli4')}</li>
									<li>{tCreate('helpMessageli5')}</li>
								</ul>
							}
						/>
						<DeleteTemplate templateId={params.id} />
					</div>

					<div className='flex gap-2'>
						<Button variant='outline' asChild>
							<Link href={`/templates/view/${params.id}`}>
								{tManage('publicButton')}
							</Link>
						</Button>

						<PublishTemplateButton
							user={session?.user as User}
							type='update'
							templateId={template.id}
						/>
					</div>
				</div>
				<Tabs defaultValue='questions' className='w-full'>
					<TabsList className='flex flex-wrap mb-14 sm:mb-0 justify-center bg-transparent gap-4'>
						<TabsTrigger
							value='questions'
							className='data-[state=active]:border-blue-500 border-b-2 data-[state=active]:text-blue-500 data-[state=active]:shadow-none rounded-none'>
							{tCreate('tabQuestions')}
						</TabsTrigger>
						<TabsTrigger
							value='tags'
							className='data-[state=active]:border-blue-500 border-b-2 data-[state=active]:text-blue-500 data-[state=active]:shadow-none rounded-none'>
							{tCreate('tabTags')}
						</TabsTrigger>
						<TabsTrigger
							value='preview'
							className='data-[state=active]:border-blue-500 border-b-2 data-[state=active]:text-blue-500 data-[state=active]:shadow-none rounded-none'>
							{tCreate('tabPreview')}
						</TabsTrigger>
						<TabsTrigger
							value='responses'
							className='data-[state=active]:border-blue-500 border-b-2 data-[state=active]:text-blue-500 data-[state=active]:shadow-none rounded-none flex gap-1'>
							<span>{tManage('tabResponses')}</span>
							<Badge className='bg-blue-500 p-1'>
								{forms ? forms.length : '0'}
							</Badge>
						</TabsTrigger>
						<TabsTrigger
							value='submitted'
							className='data-[state=active]:border-blue-500 border-b-2 data-[state=active]:text-blue-500 data-[state=active]:shadow-none rounded-none'>
							{tManage('tabSubmitted')}
						</TabsTrigger>
					</TabsList>

					<TabsContent value='questions'>
						<UpdateQuestionsContent
							template={template as unknown as Template}
						/>
					</TabsContent>
					<TabsContent value='tags'>
						<SetTags tagsData={tags} />
					</TabsContent>
					<TabsContent value='preview'>
						<FormPreviewContent />
					</TabsContent>
					<TabsContent value='responses'>
						<ResponsesContent templateId={template.id} />
					</TabsContent>
					<TabsContent value='submitted'>
						<SubmittedFormsList templateId={template.id} />
					</TabsContent>
				</Tabs>
			</section>
		</TemplateProvider>
	);
};
export default ManageTemplatePage;
