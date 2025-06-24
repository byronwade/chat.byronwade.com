"use client";

import Link from "next/link";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getAllCaseStudies } from "@/lib/chat-data";
import { BookOpen, Search, ArrowRight, Zap, Clock, Users } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ThemeToggle } from "@/components/theme-toggle";

export function ChatBlogGrid() {
	const allCaseStudies = getAllCaseStudies();
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedTopic, setSelectedTopic] = useState<string>("all");
	const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");

	// Get unique topics and difficulties for filters
	const allTopics = Array.from(new Set(allCaseStudies.flatMap((study) => study.topics)));
	const allDifficulties = Array.from(new Set(allCaseStudies.map((study) => study.difficulty)));

	// Filter case studies based on search and filters
	const filteredCaseStudies = allCaseStudies.filter((study) => {
		const matchesSearch = searchTerm === "" || study.title.toLowerCase().includes(searchTerm.toLowerCase()) || study.summary.toLowerCase().includes(searchTerm.toLowerCase()) || study.topics.some((topic) => topic.toLowerCase().includes(searchTerm.toLowerCase()));

		const matchesTopic = selectedTopic === "all" || study.topics.some((topic) => topic.toLowerCase() === selectedTopic.toLowerCase());

		const matchesDifficulty = selectedDifficulty === "all" || study.difficulty === selectedDifficulty;

		return matchesSearch && matchesTopic && matchesDifficulty;
	});

	const formatDate = (date: Date) => {
		return date.toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	};

	const getDifficultyColor = (difficulty: string) => {
		switch (difficulty) {
			case "beginner":
				return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20";
			case "intermediate":
				return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20";
			case "advanced":
				return "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20";
			default:
				return "bg-muted text-muted-foreground border-border";
		}
	};

	return (
		<div className="min-h-screen bg-background">
			{/* Hero Section - Vercel Style */}
			<div className="relative overflow-hidden">
				{/* Background Pattern */}
				<div className="absolute inset-0 bg-grid-pattern opacity-[0.02] dark:opacity-[0.05]" />
				<div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-background to-purple-50/50 dark:from-blue-950/10 dark:via-background dark:to-purple-950/10" />

				<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 sm:pt-24 sm:pb-28">
					{/* Theme Toggle */}
					<div className="absolute top-6 right-6">
						<ThemeToggle />
					</div>

					<div className="text-center">
						{/* Badge */}
						<div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-8">
							<Zap className="h-3.5 w-3.5 text-primary" />
							<span className="text-sm font-medium text-primary">AI Case Studies</span>
						</div>

						{/* Title */}
						<h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
							<span className="block">Multi-Agent</span>
							<span className="block bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">Conversations</span>
						</h1>

						{/* Description */}
						<p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-10">Explore fascinating conversations between AI agents. Each chat is analyzed as a case study with key insights, learning opportunities, and practical applications.</p>

						{/* Stats */}
						<div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
							<div className="flex items-center gap-2">
								<div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
								<span>Live Analysis</span>
							</div>
							<div className="flex items-center gap-2">
								<BookOpen className="h-4 w-4" />
								<span>{allCaseStudies.length} Studies</span>
							</div>
							<div className="flex items-center gap-2">
								<Users className="h-4 w-4" />
								<span>4 AI Agents</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
				{/* Search and Filters */}
				<div className="mb-16 -mt-8">
					<Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-lg">
						<CardContent className="p-6">
							<div className="flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:space-x-4">
								{/* Search Input */}
								<div className="flex-1 relative">
									<Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
									<Input placeholder="Search conversations, topics, or insights..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-12 h-11 bg-background/50 border-border focus:border-primary/50 focus:ring-primary/20" />
								</div>

								{/* Filters */}
								<div className="flex gap-3">
									<Select value={selectedTopic} onValueChange={setSelectedTopic}>
										<SelectTrigger className="w-full sm:w-40 h-11 bg-background/50 border-border">
											<SelectValue placeholder="All Topics" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="all">All Topics</SelectItem>
											{allTopics.map((topic) => (
												<SelectItem key={topic} value={topic.toLowerCase()}>
													{topic}
												</SelectItem>
											))}
										</SelectContent>
									</Select>

									<Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
										<SelectTrigger className="w-full sm:w-32 h-11 bg-background/50 border-border">
											<SelectValue placeholder="All Levels" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="all">All Levels</SelectItem>
											{allDifficulties.map((difficulty) => (
												<SelectItem key={difficulty} value={difficulty} className="capitalize">
													{difficulty}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							</div>

							{/* Search Results Info */}
							{searchTerm && (
								<div className="mt-4 pt-4 border-t border-border">
									<p className="text-sm text-muted-foreground">
										{filteredCaseStudies.length} result{filteredCaseStudies.length !== 1 ? "s" : ""} for <span className="font-medium text-foreground">&ldquo;{searchTerm}&rdquo;</span>
									</p>
								</div>
							)}
						</CardContent>
					</Card>
				</div>

				{/* Case Studies Grid */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
					{filteredCaseStudies.map((caseStudy) => (
						<Link key={caseStudy.id} href={`/blog/${caseStudy.slug}`} className="group">
							<Card className="h-full bg-card hover:bg-card/80 border-border hover:border-primary/20 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
								<CardContent className="p-6 lg:p-8">
									{/* Header */}
									<div className="flex items-start justify-between mb-6">
										<div className="flex items-center gap-3">
											<Badge className={`${getDifficultyColor(caseStudy.difficulty)} text-xs font-medium px-2.5 py-1`}>{caseStudy.difficulty}</Badge>
											<div className="flex items-center gap-1 text-xs text-muted-foreground">
												<Clock className="h-3 w-3" />
												<span>{caseStudy.readTime}m read</span>
											</div>
										</div>
										<span className="text-xs text-muted-foreground">{formatDate(caseStudy.publishedAt)}</span>
									</div>

									{/* Title */}
									<h3 className="text-xl lg:text-2xl font-semibold text-foreground mb-4 group-hover:text-primary transition-colors leading-tight">{caseStudy.title}</h3>

									{/* Summary */}
									<p className="text-muted-foreground text-sm lg:text-base leading-relaxed mb-6 line-clamp-3">{caseStudy.summary}</p>

									{/* Topics */}
									<div className="flex flex-wrap gap-2 mb-6">
										{caseStudy.topics.slice(0, 3).map((topic) => (
											<Badge key={topic} variant="secondary" className="text-xs bg-muted/50 text-muted-foreground hover:bg-muted">
												{topic}
											</Badge>
										))}
										{caseStudy.topics.length > 3 && (
											<Badge variant="secondary" className="text-xs bg-muted/50 text-muted-foreground">
												+{caseStudy.topics.length - 3} more
											</Badge>
										)}
									</div>

									{/* Footer */}
									<div className="flex items-center justify-between">
										{/* Avatar Stack */}
										<div className="flex items-center gap-3">
											<div className="flex -space-x-2">
												{caseStudy.participants.slice(0, 4).map((participant, index) => (
													<Avatar key={participant.id} className="h-8 w-8 border-2 border-background ring-1 ring-border" style={{ zIndex: 4 - index }}>
														<AvatarImage src={participant.avatar} alt={participant.name} />
														<AvatarFallback className="text-xs bg-gradient-to-br from-blue-500 to-purple-600 text-white font-medium">{participant.name.charAt(0)}</AvatarFallback>
													</Avatar>
												))}
											</div>
											<span className="text-xs text-muted-foreground">
												{caseStudy.participants.length} agent{caseStudy.participants.length !== 1 ? "s" : ""}
											</span>
										</div>

										{/* Arrow */}
										<ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
									</div>
								</CardContent>
							</Card>
						</Link>
					))}
				</div>

				{/* Empty State */}
				{filteredCaseStudies.length === 0 && (
					<div className="text-center py-24">
						<div className="max-w-md mx-auto">
							<div className="p-6 bg-muted/20 rounded-2xl w-fit mx-auto mb-6">
								<Search className="h-12 w-12 text-muted-foreground" />
							</div>
							<h3 className="text-xl font-semibold text-foreground mb-2">No conversations found</h3>
							<p className="text-muted-foreground mb-8">Try adjusting your search terms or filters to discover more AI conversations.</p>
							<Button
								variant="outline"
								onClick={() => {
									setSearchTerm("");
									setSelectedTopic("all");
									setSelectedDifficulty("all");
								}}
								className="bg-background hover:bg-muted"
							>
								Clear all filters
							</Button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
