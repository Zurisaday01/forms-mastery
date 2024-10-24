'use client';

import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { BookUser, Crown, UserMinus, UserPlus, UserX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { AlertModal } from '../modal/alert-modal';
import { User } from '@prisma/client';
import {
	deleteUsers,
	updateRoleUsers,
	updateStatusUsers,
} from '@/actions/auth.actions';
import { useLocale, useTranslations } from 'next-intl';

interface ToolbarProps {
	currentUser: User;
	selectedRowsIds: string[];
	onClearRowSelection: () => void;
}

const ToolbarUserActions = ({
	currentUser,
	selectedRowsIds,
	onClearRowSelection,
}: ToolbarProps) => {
	const { toast } = useToast();
	const router = useRouter();
	const [blocking, setBlocking] = useState(false);
	const [unblocking, setUnblocking] = useState(false);
	const [deleting, setDeleting] = useState(false);
	const [openBlock, setOpenBlock] = useState(false);
	const [openUnBlock, setOpenUnblock] = useState(false);
	const [openDelete, setOpenDelete] = useState(false);
	const [openRoleAdmin, setOpenRoleAdmin] = useState(false);
	const [roleAdmin, setRoleAdmin] = useState(false);
	const [openRoleUser, setOpenRoleUser] = useState(false);
	const [roleUser, setRoleUser] = useState(false);

	const t = useTranslations('ToolbarUserActions');
	const tToast = useTranslations('Toast');
	const currentLocale = useLocale();

	const articleByLocale =
		currentLocale === 'en' ? 'the' : selectedRowsIds.length > 1 ? 'los' : 'el';

	const actionBlockByLocale =
		currentLocale === 'en' ? 'blocking' : 'bloqueando';

	const actionUnblockByLocale =
		currentLocale === 'en' ? 'unblocking' : 'desbloqueando';

	const actionUpdateByLocale =
		currentLocale === 'en' ? 'updating' : 'actualizando';

	const actionDeleteByLocale =
		currentLocale === 'en' ? 'deleting' : 'eliminando';

	const handleBlock = async () => {
		setBlocking(true);
		try {
			await updateStatusUsers(selectedRowsIds, 'BLOCKED');

			toast({
				title: tToast('genericSuccessTitle'),
				description: tToast('toolbarUserActionDescription', {
					action: actionBlockByLocale,
					article: articleByLocale,
					plural: selectedRowsIds.length > 1 ? 's' : '',
				}),
			});

			// `Success {action: 'blocking'} the user{plural: selectedRowsIds.length > 1 ? 's' : ''}.`
			onClearRowSelection();

			// if the user is blocking themselves, take them to the home page
			if (selectedRowsIds.includes(currentUser.id)) {
				router.push('/');
			}

			router.refresh();
		} catch (error: unknown) {
			console.log('error', error);
			toast({
				variant: 'destructive',
				title: tToast('errorTitle'),
				description: tToast('toolbarUserActionDescriptionError', {
					action: actionBlockByLocale,
					article: articleByLocale,
					plural: selectedRowsIds.length > 1 ? 's' : '',
				}),
			});
		} finally {
			setOpenBlock(false);
			setBlocking(false);
		}
	};

	const handleUnblock = async () => {
		setUnblocking(true);
		try {
			await updateStatusUsers(selectedRowsIds, 'ACTIVE');

			onClearRowSelection();

			toast({
				title: tToast('genericSuccessTitle'),
				description: tToast('toolbarUserActionDescription', {
					action: actionUnblockByLocale,
					article: articleByLocale,
					plural: selectedRowsIds.length > 1 ? 's' : '',
				}),
			});

			router.refresh();
		} catch (error: unknown) {
			console.log('error', error);
			toast({
				variant: 'destructive',
				title: tToast('errorTitle'),
				description: tToast('toolbarUserActionDescriptionError', {
					action: actionUnblockByLocale,
					article: articleByLocale,
					plural: selectedRowsIds.length > 1 ? 's' : '',
				}),
			});
		} finally {
			setOpenUnblock(false);
			setUnblocking(false);
		}
	};

	const handleRoleAdmin = async () => {
		setRoleAdmin(true);
		try {
			await updateRoleUsers(selectedRowsIds, 'ADMIN');

			onClearRowSelection();

			toast({
				title: tToast('genericSuccessTitle'),
				description: tToast('toolbarUserActionDescription', {
					action: actionUpdateByLocale,
					article: articleByLocale,
					plural: selectedRowsIds.length > 1 ? 's' : '',
				}),
			});

			router.refresh();
		} catch (error: unknown) {
			console.log('error', error);
			toast({
				variant: 'destructive',
				title: tToast('errorTitle'),
				description: tToast('toolbarUserActionDescriptionError', {
					action: actionUpdateByLocale,
					article: articleByLocale,
					plural: selectedRowsIds.length > 1 ? 's' : '',
				}),
			});
		} finally {
			setOpenRoleAdmin(false);
			setRoleAdmin(false);
		}
	};

	const handleRoleUser = async () => {
		setRoleUser(true);
		try {
			await updateRoleUsers(selectedRowsIds, 'USER');

			onClearRowSelection();

			toast({
				title: tToast('genericSuccessTitle'),
				description: tToast('toolbarUserActionDescription', {
					action: actionUpdateByLocale,
					article: articleByLocale,
					plural: selectedRowsIds.length > 1 ? 's' : '',
				}),
			});

			router.refresh();
		} catch (error: unknown) {
			console.log('error', error);
			toast({
				variant: 'destructive',
				title: tToast('errorTitle'),
				description: tToast('toolbarUserActionDescriptionError', {
					action: actionUpdateByLocale,
					article: articleByLocale,
					plural: selectedRowsIds.length > 1 ? 's' : '',
				}),
			});
		} finally {
			setOpenRoleUser(false);
			setRoleUser(false);
		}
	};

	const handleDelete = async () => {
		setDeleting(true);
		try {
			await deleteUsers(selectedRowsIds);

			toast({
				title: tToast('genericSuccessTitle'),
				description: tToast('toolbarUserActionDescription', {
					action: actionDeleteByLocale,
					article: articleByLocale,
					plural: selectedRowsIds.length > 1 ? 's' : '',
				}),
			});

			if (selectedRowsIds.includes(currentUser.id)) {
				router.push('/');
			}

			router.refresh();
		} catch (error: unknown) {
			console.log('error', error);
			toast({
				variant: 'destructive',
				title: tToast('errorTitle'),
				description: tToast('toolbarUserActionDescriptionError', {
					action: actionDeleteByLocale,
					article: articleByLocale,
					plural: selectedRowsIds.length > 1 ? 's' : '',
				}),
			});
		} finally {
			setOpenDelete(false);
			setDeleting(false);
		}
	};
	return (
		<div>
			<AlertModal
				isOpen={openBlock}
				description={t('alertMessage', {
					action: currentLocale === 'en' ? 'block' : 'bloqueará',
					article: articleByLocale,
					plural: selectedRowsIds.length > 1 ? 's' : '',
				})}
				containsCurrentUser={selectedRowsIds.includes(currentUser?.id)}
				onClose={() => setOpenBlock(false)}
				onConfirm={handleBlock}
				loading={blocking}
				isBlockingOrDeleting
			/>

			<AlertModal
				isOpen={openUnBlock}
				description={t('alertMessage', {
					action: currentLocale === 'en' ? 'unblock' : 'desbloqueará',
					article: articleByLocale,
					plural: selectedRowsIds.length > 1 ? 's' : '',
				})}
				onClose={() => setOpenUnblock(false)}
				onConfirm={handleUnblock}
				loading={unblocking}
			/>

			<AlertModal
				isOpen={openDelete}
				description={t('alertMessage', {
					action: currentLocale === 'en' ? 'delete' : 'eliminará',
					article: articleByLocale,
					plural: selectedRowsIds.length > 1 ? 's' : '',
				})}
				containsCurrentUser={selectedRowsIds.includes(currentUser?.id)}
				onClose={() => setOpenDelete(false)}
				onConfirm={handleDelete}
				loading={deleting}
				isBlockingOrDeleting
			/>

			<AlertModal
				isOpen={openRoleAdmin}
				description={t('alertMessage', {
					action: currentLocale === 'en' ? 'update' : 'actualizará',
					article: articleByLocale,
					plural: selectedRowsIds.length > 1 ? 's' : '',
				})}
				onClose={() => setOpenRoleAdmin(false)}
				onConfirm={handleRoleAdmin}
				loading={deleting}
			/>

			<AlertModal
				isOpen={openRoleUser}
				description={t('alertMessage', {
					action: currentLocale === 'en' ? 'update' : 'actualizará',
					article: articleByLocale,
					plural: selectedRowsIds.length > 1 ? 's' : '',
				})}
				containsCurrentUser={selectedRowsIds.includes(currentUser?.id)}
				onClose={() => setOpenRoleUser(false)}
				onConfirm={handleRoleUser}
				loading={deleting}
				isAdmin={currentUser?.role === 'ADMIN'}
			/>
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant='ghost'
							onClick={() => setOpenBlock(true)}
							disabled={blocking || selectedRowsIds?.length === 0}>
							<UserMinus className='text-gray-500' />
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<p>{t('block')}</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>

			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant='ghost'
							onClick={() => setOpenUnblock(true)}
							disabled={unblocking || selectedRowsIds?.length === 0}>
							<UserPlus className='text-gray-500' />
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<p>{t('unblock')}</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>

			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant='ghost'
							onClick={() => setOpenRoleAdmin(true)}
							disabled={roleAdmin || selectedRowsIds?.length === 0}>
							<Crown className='text-gray-500' />
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<p>{t('changeAdmin')}</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>

			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant='ghost'
							onClick={() => setOpenRoleUser(true)}
							disabled={roleUser || selectedRowsIds?.length === 0}>
							<BookUser className='text-gray-500' />
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<p>{t('changeNormalUser')}</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>

			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant='ghost'
							onClick={() => setOpenDelete(true)}
							disabled={deleting || selectedRowsIds?.length === 0}>
							<UserX className='text-gray-500' />
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<p>{t('delete')}</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		</div>
	);
};
export default ToolbarUserActions;
