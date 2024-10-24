'use client';

import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	PaginationState,
	useReactTable,
} from '@tanstack/react-table';

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';
import { useState } from 'react';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../ui/select';
import { User } from '@prisma/client';
import ToolbarUserActions from './toolbar-user-actions';
import { useTranslations } from 'next-intl';

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	searchKey: string;
	searchKeyLabel: string;
	currentUser: User;
}

export function UserDataTable<TData, TValue>({
	columns,
	data,
	searchKey,
	searchKeyLabel,
	currentUser,
}: DataTableProps<TData, TValue>) {
	// Add pagination state
	const [pagination, setPagination] = useState<PaginationState>({
		pageIndex: 0,
		pageSize: 10,
	});
	const [rowSelection, setRowSelection] = useState({});

	const t = useTranslations('UserDataTable');

	const table = useReactTable({
		data,
		columns,
		state: {
			pagination,
			rowSelection,
		},
		enableRowSelection: true,
		onRowSelectionChange: setRowSelection,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onPaginationChange: setPagination,
		getRowId: row => (row as User).id,
	});

	// Compute the data for the current page
	const pageData = table
		.getRowModel()
		.rows.slice(
			pagination.pageIndex * pagination.pageSize,
			pagination.pageIndex * pagination.pageSize + pagination.pageSize
		);

	return (
		<>
			<div className='flex flex-col md:flex-row items-start gap-2 ml-1'>
				{/* TOOLBAR ACTIONS */}
				<Input
					placeholder={`${t('searchLabel')} ${searchKeyLabel}...`}
					value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ''}
					onChange={event =>
						table.getColumn(searchKey)?.setFilterValue(event.target.value)
					}
					className='w-full max-w-md'
				/>

				<ToolbarUserActions
					currentUser={currentUser}
					selectedRowsIds={Object.keys(rowSelection)}
					onClearRowSelection={() => {
						setRowSelection({});
					}}
				/>
			</div>

			<ScrollArea className='h-[calc(80vh-220px)]  min-[400px]:w-[400px] min-[500px]:w-[500px]  sm:w-full rounded-md border md:h-[calc(80dvh-300px)] mx-auto'>
				<Table className='relative'>
					<TableHeader>
						{table.getHeaderGroups().map(headerGroup => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map(header => {
									return (
										<TableHead key={header.id} colSpan={header.colSpan}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext()
												  )}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{pageData.length ? (
							pageData.map(row => (
								<TableRow
									key={row.id}
									style={{
										backgroundColor:
											(row.original as User)?.id === currentUser?.id
												? '#5fa4f983'
												: '',
									}}
									data-state={row.getIsSelected() && 'selected'}>
									{row.getVisibleCells().map(cell => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className='h-24 text-center'>
									{t('noResults')}
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
				<ScrollBar orientation='horizontal' />
			</ScrollArea>
			<div className='w-full flex justify-between space-x-2 py-4 flex-col sm:flex-row '>
				<div className='flex  gap-2 text-sm'>
					<div className='flex gap-2'>
						<p className='flex  items-center gap-1'>
							{t('page')}{' '}
							<span className='font-bold'>
								{table.getState().pagination.pageIndex + 1}
							</span>
							{t('of')}{' '}
							<span className='font-bold'>
								{table.getPageCount().toLocaleString()}
							</span>
						</p>
						<span className='flex w-max items-center gap-1'>
							<span className='text-gray-500'>|</span> {t('goTo')}{' '}
							<Input
								type='number'
								min='1'
								max={table.getPageCount()}
								defaultValue={table.getState().pagination.pageIndex + 1}
								disabled={
									!table.getCanPreviousPage() && !table.getCanNextPage()
								}
								onChange={e => {
									const page = e.target.value ? Number(e.target.value) - 1 : 0;
									table.setPageIndex(page);
								}}
								className='w-16 rounded border p-1'
							/>
						</span>
					</div>

					<Select
						value={table.getState().pagination.pageSize.toString()}
						onValueChange={value => {
							table.setPageSize(Number(value));
						}}>
						<SelectTrigger className='w-full'>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{[10, 15, 20].map(pageSize => (
								<SelectItem key={pageSize} value={pageSize.toString()}>
									{t('show')} {pageSize}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className='flex gap-2'>
					<Button
						variant='outline'
						size='sm'
						className='w-full'
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}>
						{t('previousButton')}
					</Button>
					<Button
						variant='outline'
						className='w-full'
						size='sm'
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}>
						{t('nextButton')}
					</Button>
				</div>
			</div>
		</>
	);
}
