import { getAllUsers } from '@/actions/auth.actions';
import { auth } from '@/auth';
import HelpModal from '@/components/help-modal';
import { UserClient } from '@/components/tables/users/client';
import { User } from '@prisma/client';
import { getTranslations } from 'next-intl/server';

//Admin-page allow user management—view; block; unblock; delete; add to admins; remove from admins. ADMIN IS ABLE TO REMOVE ADMIN ACCESS FROM ITSELF; it’s important.
const UsersPage = async () => {
	const session = await auth();
	const users = await getAllUsers();
	const t = await getTranslations('UsersPage');

	return (
		<section className='mt-8 relative'>
			<div className='w-full flex justify-between mb-6'>
				<HelpModal
					title={t('helpTitle')}
					description={t('helpDescription')}
					content={<p>{t('helpMessage')}</p>}
				/>
			</div>

			<div className='mt-4 flex flex-col gap-9 md:overflow-hidden'>
				<h1 className='text-3xl font-bold font-barlow'>{t('title')}</h1>
				{/* <UsersTable /> */}
				<UserClient
					data={users as User[]}
					currentUser={session?.user as unknown as User}
				/>
			</div>
		</section>
	);
};
export default UsersPage;
