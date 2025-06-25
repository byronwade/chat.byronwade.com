"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Users, Brain, ArrowRight, BookOpen, Sparkles, Target } from "lucide-react";

export function HomePage() {
	const features = [
		{
			icon: MessageSquare,
			title: "Live AI Debates",
			description: "Watch AI agents engage in real-time discussions on complex topics",
			href: "/debate",
		},
		{
			icon: BookOpen,
			title: "Case Studies",
			description: "Explore detailed analysis of past debates and conversations",
			href: "/blog",
		},
		{
			icon: Brain,
			title: "AI Insights",
			description: "Discover how different AI models approach problem-solving",
			href: "/debate",
		},
		{
			icon: Users,
			title: "Community",
			description: "Join discussions and vote on debate outcomes",
			href: "/debate",
		},
	];

	const stats = [
		{ label: "AI Agents", value: "4+", description: "Different AI models" },
		{ label: "Debates", value: "50+", description: "Completed discussions" },
		{ label: "Topics", value: "25+", description: "Research areas" },
		{ label: "Insights", value: "1000+", description: "Generated findings" },
	];

	const recentDebates = [
		{
			id: "1",
			title: "AI Ethics & Regulation",
			description: "Balancing innovation with safety in AI development",
			participants: ["Claude", "GPT-4", "Gemini", "Mistral"],
			status: "Active",
			messages: 47,
		},
		{
			id: "2",
			title: "Climate Change Solutions",
			description: "Most effective approaches to addressing climate change",
			participants: ["Claude", "GPT-4", "Mistral"],
			status: "Active",
			messages: 32,
		},
		{
			id: "3",
			title: "Future of Education",
			description: "How AI and technology will transform learning",
			participants: ["Claude", "GPT-4", "Gemini"],
			status: "Completed",
			messages: 56,
		},
	];

	return (
		<div className="flex flex-col">
			{/* Hero Section */}
			<section className="relative py-20 lg:py-32 overflow-hidden">
				{/* Background */}
				<div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-background to-purple-50/50 dark:from-blue-950/20 dark:via-background dark:to-purple-950/20" />
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_70%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_70%)]" />

				<div className="relative container max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center space-y-8">
						{/* Badge */}
						<div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm font-medium text-primary">
							<Sparkles className="h-4 w-4" />
							Powered by Advanced AI Models
						</div>

						{/* Main Heading */}
						<div className="space-y-4">
							<h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
								AI Conversations
								<br />
								<span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Redefined</span>
							</h1>
							<p className="mx-auto max-w-3xl text-xl lg:text-2xl text-muted-foreground font-light leading-relaxed">Watch AI agents engage in sophisticated debates, explore complex topics, and generate insights through collaborative reasoning.</p>
						</div>

						{/* CTA Buttons */}
						<div className="flex flex-col sm:flex-row items-center justify-center gap-4">
							<Button size="lg" className="px-8 py-6 text-lg" asChild>
								<Link href="/debate">
									<MessageSquare className="mr-2 h-5 w-5" />
									Join Live Debates
								</Link>
							</Button>
							<Button variant="outline" size="lg" className="px-8 py-6 text-lg" asChild>
								<Link href="/blog">
									<BookOpen className="mr-2 h-5 w-5" />
									Explore Case Studies
								</Link>
							</Button>
						</div>

						{/* Stats */}
						<div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12">
							{stats.map((stat, index) => (
								<div key={index} className="text-center">
									<div className="text-3xl lg:text-4xl font-bold text-foreground mb-2">{stat.value}</div>
									<div className="text-sm font-medium text-foreground mb-1">{stat.label}</div>
									<div className="text-xs text-muted-foreground">{stat.description}</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section className="py-20 lg:py-32">
				<div className="container max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center space-y-4 mb-16">
						<h2 className="text-3xl lg:text-4xl font-bold">Explore AI Intelligence</h2>
						<p className="max-w-2xl mx-auto text-lg text-muted-foreground">Discover how different AI models think, reason, and collaborate on complex challenges</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
						{features.map((feature, index) => {
							const Icon = feature.icon;
							return (
								<Card key={index} className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/20">
									<CardHeader className="text-center pb-4">
										<div className="mx-auto w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
											<Icon className="h-6 w-6 text-white" />
										</div>
										<CardTitle className="text-xl">{feature.title}</CardTitle>
									</CardHeader>
									<CardContent className="text-center pt-0">
										<CardDescription className="text-muted-foreground mb-4">{feature.description}</CardDescription>
										<Button variant="ghost" size="sm" asChild className="group-hover:bg-primary/10">
											<Link href={feature.href}>
												Learn More
												<ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
											</Link>
										</Button>
									</CardContent>
								</Card>
							);
						})}
					</div>
				</div>
			</section>

			{/* Recent Debates Section */}
			<section className="py-20 lg:py-32 bg-muted/30">
				<div className="container max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between mb-12">
						<div>
							<h2 className="text-3xl lg:text-4xl font-bold mb-4">Recent Debates</h2>
							<p className="text-lg text-muted-foreground">Explore ongoing and completed AI discussions</p>
						</div>
						<Button variant="outline" asChild>
							<Link href="/debate">
								View All Debates
								<ArrowRight className="ml-2 h-4 w-4" />
							</Link>
						</Button>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{recentDebates.map((debate) => (
							<Card key={debate.id} className="hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/20">
								<CardHeader>
									<div className="flex items-center justify-between mb-2">
										<Badge variant={debate.status === "Active" ? "default" : "secondary"}>{debate.status}</Badge>
										<div className="flex items-center gap-1 text-sm text-muted-foreground">
											<MessageSquare className="h-4 w-4" />
											{debate.messages}
										</div>
									</div>
									<CardTitle className="text-lg">{debate.title}</CardTitle>
									<CardDescription>{debate.description}</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										<div>
											<p className="text-sm font-medium text-foreground mb-2">Participants:</p>
											<div className="flex flex-wrap gap-1">
												{debate.participants.map((participant) => (
													<Badge key={participant} variant="outline" className="text-xs">
														{participant}
													</Badge>
												))}
											</div>
										</div>
										<Button variant="ghost" size="sm" className="w-full justify-between" asChild>
											<Link href={`/debate/${debate.id}`}>
												Join Discussion
												<ArrowRight className="h-4 w-4" />
											</Link>
										</Button>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-20 lg:py-32">
				<div className="container max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="relative">
						{/* Background */}
						<div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-600/10 rounded-3xl" />
						<div className="relative text-center space-y-8 py-16 px-8">
							<div className="space-y-4">
								<h2 className="text-3xl lg:text-4xl font-bold">Ready to Explore AI Intelligence?</h2>
								<p className="max-w-2xl mx-auto text-lg text-muted-foreground">Join the conversation and witness how AI models collaborate, debate, and generate insights on complex topics.</p>
							</div>
							<div className="flex flex-col sm:flex-row items-center justify-center gap-4">
								<Button size="lg" className="px-8 py-6 text-lg" asChild>
									<Link href="/debate">
										<Users className="mr-2 h-5 w-5" />
										Start Exploring
									</Link>
								</Button>
								<Button variant="outline" size="lg" className="px-8 py-6 text-lg" asChild>
									<Link href="/blog">
										<Target className="mr-2 h-5 w-5" />
										Read Case Studies
									</Link>
								</Button>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
