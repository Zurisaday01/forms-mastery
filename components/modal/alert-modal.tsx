'use client';
import {  useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { RocketIcon } from '@radix-ui/react-icons';
import { Modal } from '../ui/modal';
import { useTranslations } from 'next-intl';

interface AlertModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	loading: boolean;
	description: string;
	containsCurrentUser?: boolean;
	isAdmin?: boolean;
	isBlockingOrDeleting?: boolean;
}

export const AlertModal: React.FC<AlertModalProps> = ({
	isOpen,
	onClose,
	onConfirm,
	loading,
	description,
	containsCurrentUser,
	isAdmin,
	isBlockingOrDeleting,
}) => {
	const [isMounted, setIsMounted] = useState(false);

	const t = useTranslations('AlertModal');
	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) {
		return null;
	}

	return (
		<Modal
			title={t('title')}
			description={description}
			isOpen={isOpen}
			onClose={onClose}>
			<div>
				{containsCurrentUser && (
					<Alert variant='destructive'>
						<RocketIcon className='h-4 w-4' />
						<AlertTitle>{t('containsCurrentUser')}</AlertTitle>
						<AlertDescription>
							{isAdmin || !isBlockingOrDeleting
								? t('changeToNormalMessage')
								: t('dangerAction')}
						</AlertDescription>
					</Alert>
				)}

				<div className='flex w-full items-center justify-end space-x-2 pt-6'>
					<Button disabled={loading} variant='outline' onClick={onClose}>
						{t('cancelButton')}
					</Button>
					<Button disabled={loading} variant='destructive' onClick={onConfirm}>
						{loading ? t('loading') : <span>{t('continueButton')}</span>}
					</Button>
				</div>
			</div>
		</Modal>
	);
};
