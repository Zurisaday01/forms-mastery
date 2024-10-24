'use client';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { User } from '@prisma/client';
import { useTranslations } from 'next-intl';

// Create a functional component for the each header to use the useTranslations hook
const FirstNameHeader = () => {
	const t = useTranslations('UserDataTable');
	return t('headerFirstName');
};

const LastNameHeader = () => {
	const t = useTranslations('UserDataTable');
	return t('headerLastName');
};

const EmailHeader = () => {
	const t = useTranslations('UserDataTable');
	return t('headerEmail');
};

const StatusHeader = () => {
	const t = useTranslations('UserDataTable');
	return t('headerStatus');
};

const RoleHeader = () => {
	const t = useTranslations('UserDataTable');
	return t('headerRole');
};

export const columns: ColumnDef<User>[] = [
	{
		id: 'select',
		header: ({ table }) => (
			<input
				type='checkbox'
				checked={table.getIsAllRowsSelected()}
				onChange={table.getToggleAllRowsSelectedHandler()}
			/>
		),
		cell: ({ row }) => (
			<input
				type='checkbox'
				checked={row.getIsSelected()}
				onChange={row.getToggleSelectedHandler()}
			/>
		),
	},
	{
		accessorKey: 'firstName',
		header: FirstNameHeader, // Use the functional component
	},
	{
		accessorKey: 'lastName',
		header: LastNameHeader, // Use the functional component
	},
	{
		accessorKey: 'email',
		header: EmailHeader, // Use the functional component
	},
	{
		accessorKey: 'status',
		header: StatusHeader, // Use the functional component
		cell: ({ row }) => {
			const status = row.original.status;
			return (
				<Badge
					className={`dark:text-white ${
						status === 'ACTIVE'
							? 'bg-green-600 hover:bg-green-600/85'
							: 'bg-red-600 hover:bg-red-600/85'
					}`}>
					{status.toUpperCase()}
				</Badge>
			);
		},
	},
	{
		accessorKey: 'role',
		header: RoleHeader, // Use the functional component
		cell: ({ row }) => {
			const role = row.original.role;
			return (
				<Badge
					className={`dark:text-white ${
						role === 'USER'
							? ' bg-blue-500 hover:bg-blue-500/85'
							: 'bg-cyan-500 hover:bg-cyan-500/85'
					}`}>
					{role.toUpperCase()}
				</Badge>
			);
		},
	},
];
