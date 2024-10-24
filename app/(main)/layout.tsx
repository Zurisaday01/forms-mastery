import LeftSidebar from '@/components/left-sidebar';
import Navbar from '@/components/navbar';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className='relative flex flex-col'>
			<main className='relative flex'>
				<LeftSidebar />
				<section className='flex min-h-screen flex-1 flex-col'>
					<Navbar />
					<div className='mx-auto flex w-full max-w-[1204px] flex-col max-lg:px-4 px-8 overflow-y-auto'>
						<div className='flex flex-col md:pb-14 '>{children}</div>
					</div>
				</section>
			</main>
		</div>
	);
};
export default MainLayout;
