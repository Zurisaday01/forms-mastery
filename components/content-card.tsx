'use client';
import { generateUniqueId } from '@/lib/utils';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripHorizontal } from 'lucide-react';
import { memo } from 'react';

interface ContentCardProps {
	type?: 'info' | 'question';
	usage?: 'create' | 'edit' | 'view';
	id?: string;
	isSelected?: boolean;
	onClick?: () => void;
	children: React.ReactNode;
}

const ContentCard = memo(
	({
		type = 'question',
		usage = 'view',
		isSelected = false,
		id,
		onClick,
		children,
	}: ContentCardProps) => {
		const uniqueId = id ? id : generateUniqueId();
		const { attributes, listeners, setNodeRef, transform, transition } =
			useSortable({ id: uniqueId });

		const style = {
			transform: CSS.Translate.toString(transform),
			transition,
		};

		const isCursorGrabbing = attributes['aria-pressed'];
		return (
			<div
				ref={setNodeRef}
				// key={uniqueId} // this was causing the card to re-render at every type change of the children inputs
				style={style}
				onClick={onClick ? onClick : () => {}} // Add a default empty function
				className={`relative ${
					type === 'info'
						? 'border-t-8 border-blue-500 '
						: 'border-t border-t-primary/30'
				} rounded-md flex flex-col gap-3 p-4 border-b border-b-primary/30  shadow-sm transition-border duration-150 ${
					isSelected
						? 'border-l-4 border-l-blue-300 border-r border-r-primary/30'
						: 'border-x border-x-primary/30'
				}`}>
				{type === 'question' && (usage === 'create' || usage === 'edit') && (
					<button
						{...attributes}
						{...listeners}
						className={` ${
							isCursorGrabbing ? 'cursor-grabbing' : 'cursor-grab'
						} absolute  -translate-y-1/2 top-3 right-1/2`}
						aria-describedby={`DndContext-${uniqueId}`}>
						<GripHorizontal className='text-gray-400 w-5' />
					</button>
				)}
				<div>{children}</div>
			</div>
		);
	}
);

ContentCard.displayName = 'ContentCard';
export default ContentCard;
