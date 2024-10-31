'use client';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';

const TemplatesFilter = () => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const { data: session } = useSession();

	const [query, setQuery] = useState('');
	const [initialized, setInitialized] = useState(false);
	const [ownership, setOwnership] = useState(
		searchParams.get('ownership') || 'anyone'
	);
	const [sort, setSort] = useState(searchParams.get('sort') || 'desc');

	const t = useTranslations('TemplatesFilter');

	useEffect(() => {
		const params = new URLSearchParams(searchParams.toString());

		params.set('ownership', ownership);
		params.set('sort', sort);

		setQuery(params.toString());
	}, [ownership, sort, searchParams]);

	useEffect(() => {
		if (initialized) {
			router.push(`${pathname}?${query}`, { scroll: false });
		} else {
			setInitialized(true);
		}
	}, [query, pathname, initialized, router]);

	const handleOwnershipChange = (value: string) => {
		setOwnership(value);
	};

	const handleSortChange = (value: string) => {
		setSort(value);
	};

	return (
		<div className='flex gap-2 items-center'>
			<Select
				value={ownership}
				onValueChange={handleOwnershipChange}
				disabled={!session?.user}>
				<SelectTrigger className='w-[180px]'>
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						<SelectItem value='anyone'>{t('anyone')}</SelectItem>
						<SelectItem value='me'>{t('me')}</SelectItem>
						<SelectItem value='not-me'>{t('notMe')}</SelectItem>
					</SelectGroup>
				</SelectContent>
			</Select>

			<Select value={sort} onValueChange={handleSortChange}>
				<SelectTrigger className='w-[180px]'>
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						<SelectItem value='desc'>{t('desc')}</SelectItem>
						<SelectItem value='asc'>{t('asc')}</SelectItem>
					</SelectGroup>
				</SelectContent>
			</Select>
		</div>
	);
};
export default TemplatesFilter;
