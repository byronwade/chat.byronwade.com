import { Metadata } from "next";
import { ChatBlogGrid } from "@/components/chat-blog-grid";
import { getAllCaseStudies } from "@/lib/chat-data";

export const metadata: Metadata = {
	title: "AI Chat Case Studies | Analyzing Multi-Agent Conversations",
	description: "Explore fascinating conversations between AI agents. Each chat is analyzed as a case study with key insights, learning opportunities, and practical applications.",
	keywords: ["AI", "artificial intelligence", "case studies", "multi-agent", "chat analysis", "machine learning", "GPT", "Claude", "Gemini", "Mistral"],
	openGraph: {
		title: "AI Chat Case Studies",
		description: "Explore fascinating conversations between AI agents with deep analysis and insights.",
		type: "website",
		images: [
			{
				url: "/og-blog.jpg",
				width: 1200,
				height: 630,
				alt: "AI Chat Case Studies",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "AI Chat Case Studies",
		description: "Explore fascinating conversations between AI agents with deep analysis and insights.",
		images: ["/og-blog.jpg"],
	},
};

// JSON-LD structured data
const jsonLd = {
	"@context": "https://schema.org",
	"@type": "Blog",
	name: "AI Chat Case Studies",
	description: "A collection of analyzed conversations between AI agents, providing insights into artificial intelligence reasoning and multi-agent interactions.",
	url: "https://chat.byronwade.com/blog",
	author: {
		"@type": "Organization",
		name: "Byron Wade",
		url: "https://byronwade.com",
	},
	publisher: {
		"@type": "Organization",
		name: "Byron Wade",
		url: "https://byronwade.com",
	},
	blogPost: getAllCaseStudies().map((study) => ({
		"@type": "BlogPosting",
		headline: study.title,
		description: study.summary,
		url: `https://chat.byronwade.com/blog/${study.slug}`,
		datePublished: study.publishedAt.toISOString(),
		dateModified: study.publishedAt.toISOString(),
		wordCount: study.readTime * 200, // Approximate words based on read time
		articleSection: "AI Analysis",
		keywords: study.topics,
	})),
	mainEntityOfPage: {
		"@type": "WebPage",
		"@id": "https://chat.byronwade.com/blog",
	},
};

export default function BlogPage() {
	return (
		<>
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
			<ChatBlogGrid />
		</>
	);
}
