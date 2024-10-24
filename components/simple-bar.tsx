'use client';
import { useTranslations } from 'next-intl';
import React from 'react';
import {
	BarChart,
	Bar,
	Rectangle,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from 'recharts';

interface SimpleBarProps {
	data: {
		name: string;
		count: number;
	}[];
}

const SimpleBar = ({ data }: SimpleBarProps) => {
	const t = useTranslations('BarChart');
	data.sort(function (a, b) {
		return b.count - a.count;
	});

	const tooltipFormatter = (value: number) => {
		return [value, t('legend')];
	};
	return (
		<ResponsiveContainer width='100%' height='100%'>
			<BarChart
				width={500}
				height={300}
				data={data}
				margin={{
					top: 5,
					right: 30,
					left: 20,
					bottom: 5,
				}}>
				<CartesianGrid strokeDasharray='3 3' />
				<XAxis dataKey='name' />
				<YAxis type='number' allowDecimals={false} />
				<Tooltip formatter={tooltipFormatter} />

				<Bar
					dataKey='count'
					fill='#3B81F6'
					activeBar={<Rectangle fill='#DBE9FE' />}
				/>
			</BarChart>
		</ResponsiveContainer>
	);
};
export default SimpleBar;
