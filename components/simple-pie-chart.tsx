'use client';

import React from 'react';
import {
	PieChart,
	Pie,
	Legend,
	Tooltip,
	ResponsiveContainer,
	Cell,
} from 'recharts';

const RADIAN = Math.PI / 180;

interface CustomizedLabelProps {
	cx: number;
	cy: number;
	midAngle: number;
	innerRadius: number;
	outerRadius: number;
	percent: number;
	index: number;
}

const renderCustomizedLabel = ({
	cx,
	cy,
	midAngle,
	innerRadius,
	outerRadius,
	percent,
}: CustomizedLabelProps) => {
	const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
	const x = cx + radius * Math.cos(-midAngle * RADIAN);
	const y = cy + radius * Math.sin(-midAngle * RADIAN);

	return (
		<text
			x={x}
			y={y}
			fill='white'
			textAnchor={x > cx ? 'start' : 'end'}
			dominantBaseline='central'>
			{`${(percent * 100).toFixed(0)}%`}
		</text>
	);
};

interface SimplePieChartProps {
	data: {
		name: string;
		count: number;
	}[];
}

const SimplePieChart = ({ data }: SimplePieChartProps) => {
	return (
		<ResponsiveContainer width='100%' height='100%'>
			<PieChart width={500} height={500}>
				<Pie
					data={data}
					cx='50%'
					cy='50%'
					labelLine={false}
					label={renderCustomizedLabel}
					outerRadius={80}
					fill='#3B81F6'
					dataKey='count'>
					{data.map((entry, index) => (
						<Cell key={`cell-${index}`} />
					))}
				</Pie>
				<Tooltip />
				<Legend />
			</PieChart>
		</ResponsiveContainer>
	);
};
export default SimplePieChart;
