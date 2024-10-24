'use client';
import { useRouter } from 'next/navigation';
import { useState, ChangeEvent, KeyboardEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';

const FullTextSearch = () => {
	const t = useTranslations('FullTextSearch');

	// initiate the router from next/navigation

	const router = useRouter();

	// We need to grab the current search parameters and use it as default value for the search input

	const [inputValue, setValue] = useState('');

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		const inputValue = event.target.value;

		setValue(inputValue);
	};

	const handleSearch = () => {
		if (inputValue) return router.push(`/search/?q=${inputValue}`);

		if (!inputValue) return router.push('/');
	};

	const handleKeyPress = (event: KeyboardEvent) => {
		if (event.key === 'Enter') return handleSearch();
	};

	return (
		<div className='flex w-full max-w-lg relative '>
			<Search size={20} className='absolute top-[8px] left-2.5' />
			<Input
				type='search'
				value={inputValue ?? ''}
				onChange={handleChange}
				onKeyDown={handleKeyPress}
				placeholder={t('placeholder')}
				className='rounded-full pl-10'
			/>
		</div>
	);
};
export default FullTextSearch;
