import type { Metadata } from 'next';
import { Barlow, Heebo } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';

import './globals.css';
import ReactQueryProvider from '@/components/providers/react-query-provider';
import { auth } from '@/auth';
import { NextAuthProvider } from '@/components/providers/next-auth-provider';

const barlow = Barlow({
	weight: ['400', '500', '600'],
	variable: '--font-barlow',
	subsets: ['latin'],
});

const heebo = Heebo({
	weight: ['400', '500', '600'],
	variable: '--font-heebo',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'Forms Mastery',
	description: 'Generate forms with ease and share them with the world.',
};

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const locale = await getLocale();
	const messages = await getMessages();
	const session = await auth();

	console.log('session', session);

	return (
		<html lang={locale}>
			<body className={`${barlow.variable} ${heebo.variable} antialiased`}>
				<Toaster />
				<NextIntlClientProvider messages={messages}>
					<ThemeProvider
						attribute='class'
						defaultTheme='system'
						enableSystem
						disableTransitionOnChange>
						<NextAuthProvider session={session}>
							<ReactQueryProvider>
								<>{children}</>
							</ReactQueryProvider>
						</NextAuthProvider>
					</ThemeProvider>
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
