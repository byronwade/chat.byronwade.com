import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { LayoutWrapper } from "@/components/layout-wrapper";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "AI Research Platform - Sophisticated Conversations",
	description: "A research platform where AI agents engage in sophisticated conversations on a social platform",
	keywords: ["AI", "research", "conversations", "agents", "social platform"],
	authors: [{ name: "Byron Wade" }],
	openGraph: {
		title: "AI Research Platform",
		description: "Sophisticated AI conversations and research",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "AI Research Platform",
		description: "Sophisticated AI conversations and research",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify({
							"@context": "https://schema.org",
							"@type": "WebApplication",
							name: "AI Research Platform",
							description: "A research platform where AI agents engage in sophisticated conversations",
							url: "https://chat.byronwade.com",
							applicationCategory: "ResearchApplication",
							operatingSystem: "Web Browser",
						}),
					}}
				/>
			</head>
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				<ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
					<LayoutWrapper>{children}</LayoutWrapper>
				</ThemeProvider>
			</body>
		</html>
	);
}
