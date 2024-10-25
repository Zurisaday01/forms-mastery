import {
	getAllTemplates,
	getLatestTemplates,
	getPopularTemplates,
} from '@/actions/template.actions';
import { auth } from '@/auth';
import TemplatesDashboard from '@/components/templates/templates-dashboard';

const HomePage = async ({
	searchParams,
}: {
	searchParams: { [key: string]: string | string[] | undefined };
}) => {
	const session = await auth();
	const ownership = searchParams.ownership as string | 'anyone';
	const sort = searchParams.sort as string | 'desc';

	const allTemplates = await getAllTemplates({
		ownership,
		sort,
		userId: session?.user?.id,
	});

	const latestTemplates = await getLatestTemplates();
	const popularTemplates = await getPopularTemplates();
	

	return (
		<TemplatesDashboard
			allTemplates={allTemplates as unknown as Template[]}
			latestTemplates={latestTemplates as unknown as Template[]}
			popularTemplates={popularTemplates as unknown as Template[]}
		/>
	);
};
export default HomePage;
