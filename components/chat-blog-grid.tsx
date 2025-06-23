"use client";

import Link from "next/link";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getAllCaseStudies } from "@/lib/chat-data";
import { BookOpen, Search, ArrowRight, Zap } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
				return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
			case "intermediate":
				return "bg-amber-500/10 text-amber-400 border-amber-500/20";
			case "advanced":
				return "bg-red-500/10 text-red-400 border-red-500/20";
			default:
				return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
		}
	};

	return (
		<div className="min-h-screen bg-black text-white">
			{/* Ultra-minimal Hero */}
			<div className="relative">
				<div className="absolute inset-0 bg-gradient-to-br from-zinc-900/20 via-black to-zinc-900/20" />
				<div className="relative max-w-6xl mx-auto px-6 pt-24 pb-16">
					<div className="text-center space-y-6">
						<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800/50 border border-zinc-700/50">
							<Zap className="h-3 w-3 text-blue-400" />
							<span className="text-xs text-zinc-400 font-medium">AI Case Studies</span>
						</div>

						<h1 className="text-5xl md:text-7xl font-bold tracking-tight">
							<span className="text-white">Multi-Agent</span>
							<br />
							<span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Conversations</span>
						</h1>

						<p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">Deep insights from AI-to-AI conversations</p>

						<div className="flex items-center justify-center gap-8 text-sm text-zinc-500">
							<div className="flex items-center gap-2">
								<div className="h-1.5 w-1.5 bg-green-400 rounded-full animate-pulse" />
								<span>Live Analysis</span>
							</div>
							<div className="flex items-center gap-2">
								<BookOpen className="h-3 w-3" />
								<span>{allCaseStudies.length} Studies</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="max-w-6xl mx-auto px-6 pb-24">
				{/* Minimal Search */}
				<div className="mb-16 -mt-8">
					<Card className="bg-zinc-900/50 backdrop-blur-xl border-zinc-800/50">
						<CardContent className="p-6">
							<div className="flex flex-col lg:flex-row gap-4">
								<div className="flex-1 relative">
									<Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
									<Input placeholder="Search conversations..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-12 h-12 bg-zinc-800/50 border-zinc-700/50 text-white placeholder:text-zinc-500 focus:border-blue-500/50 focus:ring-blue-500/20" />
								</div>
								<div className="flex gap-3">
									<Select value={selectedTopic} onValueChange={setSelectedTopic}>
										<SelectTrigger className="w-40 h-12 bg-zinc-800/50 border-zinc-700/50 text-white">
											<SelectValue placeholder="Topic" />
										</SelectTrigger>
										<SelectContent className="bg-zinc-900 border-zinc-800">
											<SelectItem value="all">All Topics</SelectItem>
											{allTopics.map((topic) => (
												<SelectItem key={topic} value={topic.toLowerCase()}>
													{topic}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
										<SelectTrigger className="w-32 h-12 bg-zinc-800/50 border-zinc-700/50 text-white">
											<SelectValue placeholder="Level" />
										</SelectTrigger>
										<SelectContent className="bg-zinc-900 border-zinc-800">
											<SelectItem value="all">All</SelectItem>
											{allDifficulties.map((difficulty) => (
												<SelectItem key={difficulty} value={difficulty}>
													{difficulty}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							</div>

							{searchTerm && (
								<div className="mt-4 pt-4 border-t border-zinc-800">
									<p className="text-sm text-zinc-500">
										{filteredCaseStudies.length} results for <span className="text-white">&ldquo;{searchTerm}&rdquo;</span>
									</p>
								</div>
							)}
						</CardContent>
					</Card>
				</div>

				{/* Minimal Grid */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					{filteredCaseStudies.map((caseStudy) => (
						<Link key={caseStudy.id} href={`/blog/${caseStudy.slug}`} className="group">
							<Card className="h-full bg-zinc-900/30 border-zinc-800/50 hover:border-zinc-700/50 transition-all duration-500 hover:bg-zinc-900/50">
								<CardContent className="p-8">
									{/* Header */}
									<div className="flex items-start justify-between mb-6">
										<div className="flex items-center gap-3">
											<Badge className={`${getDifficultyColor(caseStudy.difficulty)} text-xs font-medium`}>{caseStudy.difficulty}</Badge>
											<span className="text-xs text-zinc-500">{caseStudy.readTime}m</span>
										</div>
										<span className="text-xs text-zinc-600">{formatDate(caseStudy.publishedAt)}</span>
									</div>

									{/* Title */}
									<h3 className="text-xl font-semibold text-white mb-3 group-hover:text-blue-400 transition-colors">{caseStudy.title}</h3>

									{/* Summary */}
									<p className="text-zinc-400 text-sm leading-relaxed mb-6 line-clamp-2">{caseStudy.summary}</p>

									{/* Minimal Avatar Stack */}
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-3">
											<div className="flex -space-x-2">
												{caseStudy.participants.slice(0, 4).map((participant, index) => (
													<Avatar key={participant.id} className="h-7 w-7 border-2 border-zinc-900 ring-1 ring-zinc-700" style={{ zIndex: 4 - index }}>
														<AvatarImage src={participant.avatar} alt={participant.name} />
														<AvatarFallback className="text-xs bg-gradient-to-br from-blue-500 to-purple-600 text-white font-medium">{participant.name.charAt(0)}</AvatarFallback>
													</Avatar>
												))}
											</div>
											<span className="text-xs text-zinc-500">{caseStudy.participants.length}</span>
										</div>

										<ArrowRight className="h-4 w-4 text-zinc-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
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
							<div className="p-6 bg-zinc-900/30 rounded-2xl w-fit mx-auto mb-6">
								<Search className="h-8 w-8 text-zinc-600" />
							</div>
							<h3 className="text-lg font-semibold text-white mb-2">No conversations found</h3>
							<p className="text-zinc-500 mb-8">Try adjusting your search or filters</p>
							<Button
								variant="outline"
								onClick={() => {
									setSearchTerm("");
									setSelectedTopic("all");
									setSelectedDifficulty("all");
								}}
								className="bg-zinc-900/50 border-zinc-800 text-white hover:bg-zinc-800"
							>
								Reset Filters
							</Button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
