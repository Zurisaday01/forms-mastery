import {
	Carousel,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from '@/components/ui/carousel';
import TemplateCard from './template-card';
import { User } from '@prisma/client';
import React from 'react';

//max-w-[1204px] sm:basis-1/2 md:basis-1/3 lg:basis-1/4

const TemplateCarousel = ({ templates }: { templates: Template[] }) => {
	return (
		<Carousel
			opts={{
				align: 'start',
			}}
			className='w-full'>
			<div className='w-full flex'>
				{templates.map(template => (
					<CarouselItem key={template.id} className='md:basis-1/2 lg:basis-1/4'>
						<TemplateCard
							likesCount={template._count?.likes}
							commentsCount={template._count?.comments}
							formsCount={template._count?.forms}
							id={template.id as string}
							key={template.id}
							title={template.title}
							description={template.description as string}
							createdAt={template.createdAt}
							tags={template.tags}
							user={template.author as User}
						/>
					</CarouselItem>
				))}
			</div>
			<CarouselPrevious />
			<CarouselNext />
		</Carousel>
	);
};
export default TemplateCarousel;
