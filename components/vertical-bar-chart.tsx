'use client';
import { useTranslations } from 'next-intl';
import React from 'react';
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Cell,
	ResponsiveContainer,
} from 'recharts';

interface VerticalBarChartProps {
	data: {
		name: string;
		count: number;
	}[];
}

const VerticalBarChart = ({ data }: VerticalBarChartProps) => {
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
				height={500}
				data={data}
				layout='vertical'
				margin={{
					top: 5,
					right: 30,
					left: 0,
					bottom: 5,
				}}>
				<CartesianGrid strokeDasharray='3 3' />
				<XAxis type='number' allowDecimals={false} />
				<YAxis type='category' width={250} dataKey='name' />
				<Tooltip formatter={tooltipFormatter} />
			
				<Bar fill='#3B81F6' dataKey='count'>
					{data.map((entry, index) => (
						<Cell key={`cell-${index}`} />
					))}
				</Bar>
			</BarChart>
		</ResponsiveContainer>
	);
};

export default VerticalBarChart;
