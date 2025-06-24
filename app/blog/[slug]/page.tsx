import { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogPostContent } from "@/components/blog-post-content";
import { getCaseStudyBySlug, getAllCaseStudies } from "@/lib/chat-data";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

interface BlogPostPageProps {
	params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
	const caseStudies = getAllCaseStudies();
	return caseStudies.map((study) => ({
		slug: study.slug,
	}));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
	const { slug } = await params;
	const caseStudy = getCaseStudyBySlug(slug);

	if (!caseStudy) {
		return {
			title: "Case Study Not Found",
		};
	}

	const title = `${caseStudy.title} | AI Chat Case Study`;
	const description = caseStudy.summary || caseStudy.description;

	return {
		title,
		description,
		keywords: [...caseStudy.topics, "AI case study", "artificial intelligence", "multi-agent conversation", "AI analysis", caseStudy.difficulty],
		openGraph: {
			title,
			description,
			type: "article",
			publishedTime: caseStudy.publishedAt.toISOString(),
			modifiedTime: caseStudy.publishedAt.toISOString(),
			section: "AI Analysis",
			tags: caseStudy.topics,
			images: [
				{
					url: `/og-${caseStudy.slug}.jpg`,
					width: 1200,
					height: 630,
					alt: caseStudy.title,
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title,
			description,
			images: [`/og-${caseStudy.slug}.jpg`],
		},
		alternates: {
			canonical: `https://chat.byronwade.com/blog/${slug}`,
		},
	};
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
	const { slug } = await params;
	const caseStudy = getCaseStudyBySlug(slug);

	if (!caseStudy) {
		notFound();
	}

	// JSON-LD structured data for individual blog post
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "BlogPosting",
		headline: caseStudy.title,
		description: caseStudy.summary || caseStudy.description,
		image: [`https://chat.byronwade.com/og-${caseStudy.slug}.jpg`],
		datePublished: caseStudy.publishedAt.toISOString(),
		dateModified: caseStudy.publishedAt.toISOString(),
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
		mainEntityOfPage: {
			"@type": "WebPage",
			"@id": `https://chat.byronwade.com/blog/${slug}`,
		},
		articleSection: "AI Analysis",
		keywords: caseStudy.topics,
		wordCount: caseStudy.readTime * 200, // Approximate
		timeRequired: `PT${caseStudy.readTime}M`,
		articleBody: caseStudy.description,
		about: {
			"@type": "Thing",
			name: "Artificial Intelligence",
			description: "The simulation of human intelligence in machines",
		},
		mentions: caseStudy.participants.map((participant) => ({
			"@type": "SoftwareApplication",
			name: participant.name,
			description: participant.description,
			applicationCategory: "AI Assistant",
		})),
	};

	return (
		<>
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

			{/* Navigation Header */}
			<div className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-sm">
				<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<Link href="/blog">
								<Button variant="outline" size="sm" className="gap-2 bg-background/50 border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
									<ArrowLeft className="h-4 w-4" />
									<span className="hidden sm:inline">Back to Blog</span>
								</Button>
							</Link>
							<Link href="/">
								<Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground transition-colors">
									<Home className="h-4 w-4" />
									<span className="hidden sm:inline">Live Chat</span>
								</Button>
							</Link>
						</div>
						<div className="flex items-center gap-4">
							<div className="text-sm text-muted-foreground hidden md:block">{caseStudy.readTime}m read</div>
							<ThemeToggle />
						</div>
					</div>
				</div>
			</div>

			<BlogPostContent caseStudy={caseStudy} />
		</>
	);
}
