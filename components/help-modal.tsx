import { Info } from 'lucide-react';
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { getTranslations } from 'next-intl/server';

interface HelpModalProps {
	title: string;
	description: string;
	content: React.ReactNode;
}

const HelpModal = async ({ title, description, content }: HelpModalProps) => {
	const t = await getTranslations('HelpModal');
	return (
		<AlertDialog>
			<AlertDialogTrigger>
				<Info className='text-blue-800 dark:text-white' />
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{title}</AlertDialogTitle>
					<AlertDialogDescription>{description}</AlertDialogDescription>
					<div>{content}</div>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>{t('closeButton')}</AlertDialogCancel>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};
export default HelpModal;
