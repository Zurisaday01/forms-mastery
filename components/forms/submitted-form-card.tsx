import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';
import Link from 'next/link';
import { Button } from '../ui/button';
import { User } from '@prisma/client';
import { getLocale, getTranslations } from 'next-intl/server';
import { es, enUS } from 'date-fns/locale';

interface SubmittedFormCardProps {
	formId: string;
	user: User;
	createdAt: Date;
	modifiedBy: string;
}

const SubmittedFormCard = async ({
	formId,
	user,
	createdAt,
	modifiedBy,
}: SubmittedFormCardProps) => {
	const currentLocale = await getLocale();
	const t = await getTranslations('SubmittedFormCard');
	return (
		<div className='shadow-sm border border-primary/10 rounded-md flex items-center justify-between p-4'>
			<div className='flex items-center space-x-2'>
				<div>
					<h3 className='text-gray-800 mt-1 text-md font-semibold font-barlow dark:text-gray-200'>
						{user?.firstName} {user?.lastName}
					</h3>
					<p className='text-gray-500 text-[12px] dark:text-gray-300'>
						{t('submittedTime', {
							message: formatDistanceToNow(new Date(createdAt), {
								addSuffix: true,
								locale: currentLocale === 'es' ? es : enUS,
							}),
						})}
					</p>
				</div>
			</div>

			<Button asChild>
				<Link href={`/forms/${formId}?modifiedBy=${modifiedBy}`}>
					{t('viewButton')}
				</Link>
			</Button>
		</div>
	);
};
export default SubmittedFormCard;
