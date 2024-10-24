import TemplatesList from '../templates-list';
import TemplatesFilter from './templates-filter';

interface TemplatesOptionsProps {
	templates: Template[];
	type: 'popular' | 'latest' | 'all';
	subtitle: string;
	description: string;
}

const TemplatesOptions = ({
	templates,
	type,
	subtitle,
	description,
}: TemplatesOptionsProps) => {
	return (
		<section className='flex flex-col gap-5'>
			<div className='flex flex-col items-start gap-3 lg:items-center lg:flex-row justify-between pr-1'>
				<div>
					<h2 className='font-bold font-barlow text-2xl'>{subtitle}</h2>
					<p className='text-muted-foreground'>{description}</p>
				</div>
				{type === 'all' && <TemplatesFilter />}
			</div>
			<TemplatesList templates={templates} />
		</section>
	);
};
export default TemplatesOptions;
