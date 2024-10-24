'use client';
import { deleteTemplate } from '@/actions/template.actions';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import Spinner from '../spinner';

const DeleteTemplate = ({ templateId }: { templateId: string }) => {
	const t = useTranslations('DeleteTemplate');
	const tToast = useTranslations('Toast');
	const router = useRouter();
	const [isPending, startTransition] = useTransition();

	const handleDelete = () => {
		startTransition(async () => {
			try {
				const deletedTemplate = await deleteTemplate(templateId);

				if (deletedTemplate) {
					toast({
						title: tToast('templateDeletedSuccessTitle'),
					});

					router.push('/');
				}
			} catch (error) {
				toast({
					variant: 'destructive',
					title: tToast('errorTitle'),
					description: (error as Error).message,
				});
			}
		});
	};

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button variant='destructive'>{t('triggerButton')}</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle className='text-2xl font-barlow'>{t('title')}</AlertDialogTitle>
					<AlertDialogDescription>{t('description')}</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>{t('cancelButton')}</AlertDialogCancel>
					<AlertDialogAction disabled={isPending} onClick={handleDelete}>
						{isPending ? <Spinner className='h-5 w-5' /> : t('continueButton')}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};
export default DeleteTemplate;
