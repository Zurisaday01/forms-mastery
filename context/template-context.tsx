'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface TemplateContextType {
	title: string;
	setTitle: React.Dispatch<React.SetStateAction<string>>;
	description: string;
	setDescription: React.Dispatch<React.SetStateAction<string>>;
	tags: string[];
	setTags: React.Dispatch<React.SetStateAction<string[]>>;
	questions: Question[];
	setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
	initialized: boolean;
	setInitialized: React.Dispatch<React.SetStateAction<boolean>>;
}
const TemplateContext = createContext<TemplateContextType | undefined>(
	undefined
);

interface TemplateProviderProps {
	children: ReactNode;
}

export const TemplateProvider: React.FC<TemplateProviderProps> = ({
	children,
}) => {
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [tags, setTags] = useState<string[]>([]);
	const [questions, setQuestions] = useState<Question[]>([]);
	// this is for the update template
	const [initialized, setInitialized] = useState(false);


	return (
		<TemplateContext.Provider
			value={{
				title,
				setTitle,
				description,
				setDescription,
				tags,
				setTags,
				questions,
				setQuestions,
				initialized,
				setInitialized,
			}}>
			{children}
		</TemplateContext.Provider>
	);
};

export const useTemplateContext = (): TemplateContextType => {
	const context = useContext(TemplateContext);
	if (context === undefined) {
		throw new Error(
			'useTemplateContext must be used within a TemplateProvider'
		);
	}
	return context;
};
