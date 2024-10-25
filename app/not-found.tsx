import { Button } from '@/components/ui/button';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

export default async function NotFound() {
    const t = await getTranslations("NotFoundPage");
	return (
		<section className='flex flex-col justify-center items-center h-[100vh]'>
			<div className='flex flex-col text-center'>
				<h1 className='text-4xl font-barlow font-bold'>{t('title')}</h1>
				<p className='mt-2'>{t('description')}</p>
				<Button asChild>
					<Link href='/' className='mt-5'>
						{t('goHomeButton')}
					</Link>
				</Button>
			</div>
		</section>
	);
}
