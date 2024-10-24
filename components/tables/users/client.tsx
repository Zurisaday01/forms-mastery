'use client';
import { UserDataTable } from '@/components/users/users-data-table';
import { columns } from './columns';
import { User } from '@prisma/client';
import { useLocale } from 'next-intl';

interface ProductsClientProps {
	data: User[];
	currentUser: User;
}

export const UserClient: React.FC<ProductsClientProps> = ({
	data,
	currentUser,
}) => {
	const currentLocale = useLocale();

	const label = currentLocale === 'en' ? 'First Name' : 'Nombre';

	return (
		<>
			<UserDataTable
				searchKey='firstName'
				searchKeyLabel={label}
				columns={columns}
				data={data}
				currentUser={currentUser}
			/>
		</>
	);
};
