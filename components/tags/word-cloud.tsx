'use client';

// https://codesandbox.io/p/sandbox/adoring-fermi-j7fhrs?file=%2Findex.tsx%3A11%2C48-11%2C77
import React, { useEffect, useState } from 'react';
import { Text } from '@visx/text';
import { scaleLog } from '@visx/scale';
import Wordcloud from '@visx/wordcloud/lib/Wordcloud';
import { ScaleLogarithmic } from '@visx/vendor/d3-scale';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTheme } from 'next-themes';

interface ExampleProps {
	width: number;
	height: number;
	showControls?: boolean;
	tags: WordData[];
	setIsOpen: (isOpen: boolean) => void;
}

function getRotationDegree() {
	const rand = Math.random();
	const degree = rand > 0.5 ? 60 : -60;
	return rand * degree;
}

const fontSizeSetter =
	(fontScale: ScaleLogarithmic<number, number, never>) => (datum: WordData) => {
		const size = fontScale(datum.value);
		return size;
	};

const fixedValueGenerator = () => 0.5;

type SpiralType = 'archimedean' | 'rectangular';

export default function WordCloud({
	width,
	height,
	showControls,
	tags,
	setIsOpen,
}: ExampleProps) {
	const [spiralType, setSpiralType] = useState<SpiralType>('archimedean');
	const [withRotation, setWithRotation] = useState(false);
	const [systemTheme, setSystemTheme] = useState<'dark' | 'light'>('light'); // Default to light
	const router = useRouter();
	const searchParams = useSearchParams();
	const { theme } = useTheme();

	const [selectedTag, setSelectedTag] = useState(
		searchParams.get('tag') || null
	);

	useEffect(() => {
		setSelectedTag(searchParams.get('tag'));
	}, [searchParams, selectedTag]);

	// know the system theme
	useEffect(() => {
		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

		const updateSystemTheme = (e: MediaQueryList | MediaQueryListEvent) => {
			setSystemTheme(e.matches ? 'dark' : 'light');
		};

		// Set initial theme on mount
		updateSystemTheme(mediaQuery);

		// Add event listener
		mediaQuery.addEventListener('change', updateSystemTheme);

		// Cleanup listener on unmount
		return () => mediaQuery.removeEventListener('change', updateSystemTheme);
	}, []);

	const minTagValue = Math.min(
		...tags
			.map(tag => tag.value)
			.filter(v => typeof v === 'number' && isFinite(v))
	);
	const maxTagValue = Math.max(
		...tags
			.map(tag => tag.value)
			.filter(v => typeof v === 'number' && isFinite(v))
	);

	// Set defaults if tags is empty or all values are invalid
	const safeMin = minTagValue > 0 ? minTagValue : 1; // Avoid log(0) or log(negative)
	const safeMax = maxTagValue > 0 ? maxTagValue : 1;

	const fontScale = scaleLog({
		domain: [safeMin, safeMax],
		range: [10, 100],
	});

	console.log('theme', theme, 'systemTheme', systemTheme);

	const handleSelectTag = (tag: string) => {
		setSelectedTag(tag);
		setIsOpen(false);
		router.push(`/tag-search/?tag=${tag}`);
	};

	return (
		<div className=''>
			<Wordcloud
				words={tags}
				width={width}
				height={height}
				fontSize={fontSizeSetter(fontScale)}
				font={'Impact'}
				padding={2}
				spiral={spiralType}
				rotate={withRotation ? getRotationDegree : 0}
				random={fixedValueGenerator}>
				{cloudWords =>
					cloudWords.map(w => (
						<Text
							className='cursor-pointer'
							onClick={() => handleSelectTag(w.text as string)}
							key={w.text}
							fill={
								selectedTag === w.text
									? '#50A1FF'
									: theme === 'dark' ||
									  (theme === 'system' && systemTheme === 'dark')
									? '#fff'
									: '#343434'
							}
							textAnchor={'middle'}
							transform={`translate(${w.x}, ${w.y}) rotate(${w.rotate})`}
							fontSize={w.size}
							fontFamily={w.font}>
							{w.text}
						</Text>
					))
				}
			</Wordcloud>
			{showControls && (
				<div>
					<label>
						Spiral type &nbsp;
						<select
							onChange={e => setSpiralType(e.target.value as SpiralType)}
							value={spiralType}>
							<option key={'archimedean'} value={'archimedean'}>
								archimedean
							</option>
							<option key={'rectangular'} value={'rectangular'}>
								rectangular
							</option>
						</select>
					</label>
					<label>
						With rotation &nbsp;
						<input
							type='checkbox'
							checked={withRotation}
							onChange={() => setWithRotation(!withRotation)}
						/>
					</label>
					<br />
				</div>
			)}
			<style jsx>{`
				.wordcloud {
					display: flex;
					flex-direction: column;
					user-select: none;
				}
				.wordcloud svg {
					margin: 1rem 0;
					cursor: pointer;
				}

				.wordcloud label {
					display: inline-flex;
					align-items: center;
					font-size: 14px;
					margin-right: 8px;
				}
				.wordcloud textarea {
					min-height: 100px;
				}
			`}</style>
		</div>
	);
}
