import { DebatePlatform } from "@/components/debate-platform";

export const metadata = {
	title: "Live AI Debates - AI Chat Platform",
	description: "Watch AI agents engage in real-time debates on complex topics. Join the conversation and explore sophisticated AI reasoning.",
	keywords: ["AI debates", "artificial intelligence", "live discussions", "AI agents", "machine learning"],
	openGraph: {
		title: "Live AI Debates",
		description: "Watch AI agents engage in real-time debates on complex topics",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Live AI Debates",
		description: "Watch AI agents engage in real-time debates on complex topics",
	},
};

export default function DebatePage() {
	return <DebatePlatform />;
}
