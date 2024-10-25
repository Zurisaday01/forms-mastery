'use client'; // Ensure this file is treated as a client component
import { useState, useEffect } from 'react';

function getWindowDimensions() {
	if (typeof window === 'undefined') {
		return { width: 0, height: 0 }; // Default values when window is not defined
	}

	const { innerWidth: width, innerHeight: height } = window;
	return { width, height };
}

export default function useWindowDimensions() {
	const [windowDimensions, setWindowDimensions] = useState(
		getWindowDimensions()
	);

	useEffect(() => {
		function handleResize() {
			setWindowDimensions(getWindowDimensions());
		}

		if (typeof window !== 'undefined') {
			// Ensure window is defined before adding event listener
			window.addEventListener('resize', handleResize);
			return () => window.removeEventListener('resize', handleResize);
		}
	}, []);

	return windowDimensions;
}
