"use client";

import { useState } from "react";
import Link from "next/link";
import { ChatCaseStudyData, ChatMessage } from "@/lib/chat-data";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Clock, Users, Calendar, Tag, ArrowLeft, Quote, Brain, Lightbulb, Target, ChevronDown, ChevronUp, Copy, ExternalLink, TrendingUp, MessageSquare, Share2, Bookmark, Download, BarChart3 } from "lucide-react";

interface ChatCaseStudyProps {
	caseStudy: ChatCaseStudyData;
}

export function ChatCaseStudy({ caseStudy }: ChatCaseStudyProps) {
	const [selectedTab, setSelectedTab] = useState("overview");
	const [expandedMessages, setExpandedMessages] = useState<Set<string>>(new Set());
	const [quotedMessage, setQuotedMessage] = useState<string | null>(null);

	const toggleMessageExpansion = (messageId: string) => {
		const newExpanded = new Set(expandedMessages);
		if (newExpanded.has(messageId)) {
			newExpanded.delete(messageId);
		} else {
			newExpanded.add(messageId);
		}
		setExpandedMessages(newExpanded);
	};

	const copyMessage = (content: string) => {
		navigator.clipboard.writeText(content);
	};

	const quoteMessage = (messageId: string) => {
		setQuotedMessage(messageId);
	};

	const formatDate = (date: Date) => {
		return date.toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	const formatTime = (date: Date) => {
		return date.toLocaleTimeString("en-US", {
			hour: "2-digit",
			minute: "2-digit",
			hour12: false,
		});
	};

	const getDifficultyColor = (difficulty: string) => {
		switch (difficulty) {
			case "beginner":
				return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
			case "intermediate":
				return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
			case "advanced":
				return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
			default:
				return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
		}
	};

	const getCategoryIcon = (category: string) => {
		switch (category) {
			case "reasoning":
				return <Brain className="h-4 w-4" />;
			case "strategy":
				return <Target className="h-4 w-4" />;
			case "insight":
				return <Lightbulb className="h-4 w-4" />;
			case "collaboration":
				return <Users className="h-4 w-4" />;
			case "ethics":
				return <BarChart3 className="h-4 w-4" />;
			default:
				return <MessageSquare className="h-4 w-4" />;
		}
	};

	const getParticipantById = (id: string) => {
		return caseStudy.participants.find((p) => p.id === id);
	};

	const MessageBubble = ({ message, showAnalysis = false }: { message: ChatMessage; showAnalysis?: boolean }) => {
		const participant = getParticipantById(message.senderId);
		const isExpanded = expandedMessages.has(message.id);
		const isQuoted = quotedMessage === message.id;
		const analysisPoint = caseStudy.analysisPoints.find((a) => a.messageId === message.id);

		return (
			<div className={`group ${isQuoted ? "ring-2 ring-primary ring-opacity-50 rounded-lg p-2" : ""}`}>
				<div className="flex gap-4">
					<Avatar className="h-10 w-10 flex-shrink-0 ring-2 ring-border/50">
						<AvatarImage src={participant?.avatar} alt={participant?.name} />
						<AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">{participant?.name?.charAt(0)}</AvatarFallback>
					</Avatar>

					<div className="flex-1 space-y-3">
						{/* Message Header */}
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<span className="font-medium">{participant?.name}</span>
								<Badge variant="outline" className="text-xs">
									{participant?.model}
								</Badge>
								<span className="text-xs text-muted-foreground">{formatTime(message.timestamp)}</span>
								{message.confidence && (
									<Badge variant="secondary" className="text-xs">
										{Math.round(message.confidence * 100)}% confidence
									</Badge>
								)}
							</div>
							<div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
								<Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => copyMessage(message.content)}>
									<Copy className="h-3 w-3" />
								</Button>
								<Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => quoteMessage(message.id)}>
									<Quote className="h-3 w-3" />
								</Button>
								<Button variant="ghost" size="sm" className="h-7 w-7 p-0">
									<Share2 className="h-3 w-3" />
								</Button>
							</div>
						</div>

						{/* Message Content */}
						<Card className="bg-background/50 border-border/50">
							<CardContent className="p-4">
								<p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>

								{/* Message Metadata */}
								{(message.thinking || message.keyInsights || message.sources) && (
									<Collapsible open={isExpanded} onOpenChange={() => toggleMessageExpansion(message.id)}>
										<CollapsibleTrigger asChild>
											<Button variant="ghost" size="sm" className="mt-3 text-xs h-6 px-2">
												{isExpanded ? (
													<>
														<ChevronUp className="h-3 w-3 mr-1" /> Hide Details
													</>
												) : (
													<>
														<ChevronDown className="h-3 w-3 mr-1" /> Show Details
													</>
												)}
											</Button>
										</CollapsibleTrigger>
										<CollapsibleContent className="mt-3 space-y-3">
											{message.thinking && (
												<div className="text-xs space-y-1">
													<div className="font-medium text-muted-foreground">Thinking Process:</div>
													<ul className="list-disc list-inside space-y-1 text-muted-foreground">
														{message.thinking.map((thought, index) => (
															<li key={index}>{thought}</li>
														))}
													</ul>
												</div>
											)}

											{message.keyInsights && (
												<div className="text-xs space-y-1">
													<div className="font-medium text-muted-foreground">Key Insights:</div>
													<ul className="list-disc list-inside space-y-1 text-muted-foreground">
														{message.keyInsights.map((insight, index) => (
															<li key={index}>{insight}</li>
														))}
													</ul>
												</div>
											)}

											{message.sources && (
												<div className="text-xs space-y-1">
													<div className="font-medium text-muted-foreground">Sources:</div>
													<div className="space-y-1">
														{message.sources.map((source, index) => (
															<div key={index} className="flex items-center gap-2 text-muted-foreground">
																<ExternalLink className="h-3 w-3" />
																<span>{source.title}</span>
																<Badge variant="outline" className="text-xs">
																	{Math.round(source.relevance * 100)}% relevant
																</Badge>
															</div>
														))}
													</div>
												</div>
											)}
										</CollapsibleContent>
									</Collapsible>
								)}
							</CardContent>
						</Card>

						{/* Analysis Point */}
						{showAnalysis && analysisPoint && (
							<Card className="bg-accent/20 border-accent/50">
								<CardHeader className="pb-2">
									<div className="flex items-center gap-2">
										{getCategoryIcon(analysisPoint.category)}
										<span className="font-medium text-sm">{analysisPoint.title}</span>
										<Badge variant="secondary" className="text-xs">
											{analysisPoint.category}
										</Badge>
									</div>
								</CardHeader>
								<CardContent className="pt-0">
									<p className="text-sm text-muted-foreground">{analysisPoint.analysis}</p>
								</CardContent>
							</Card>
						)}
					</div>
				</div>
			</div>
		);
	};

	return (
		<div className="min-h-screen bg-background">
			{/* Header */}
			<div className="border-b bg-background/95 backdrop-blur-sm sticky top-0 z-40">
				<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
					<div className="flex items-center gap-4 mb-4">
						<Link href="/blog">
							<Button variant="ghost" size="sm">
								<ArrowLeft className="h-4 w-4 mr-2" />
								Back to Case Studies
							</Button>
						</Link>
						<div className="flex items-center gap-2 ml-auto">
							<Button variant="outline" size="sm">
								<Bookmark className="h-4 w-4 mr-2" />
								Bookmark
							</Button>
							<Button variant="outline" size="sm">
								<Share2 className="h-4 w-4 mr-2" />
								Share
							</Button>
							<Button variant="outline" size="sm">
								<Download className="h-4 w-4 mr-2" />
								Export
							</Button>
						</div>
					</div>

					<div className="space-y-4">
						<div className="flex items-center gap-2">
							<Badge className={getDifficultyColor(caseStudy.difficulty)}>{caseStudy.difficulty}</Badge>
							<div className="flex items-center gap-1 text-sm text-muted-foreground">
								<Clock className="h-4 w-4" />
								<span>{caseStudy.readTime} min read</span>
							</div>
							<div className="flex items-center gap-1 text-sm text-muted-foreground">
								<Calendar className="h-4 w-4" />
								<span>{formatDate(caseStudy.publishedAt)}</span>
							</div>
						</div>

						<h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{caseStudy.title}</h1>

						<p className="text-xl text-muted-foreground">{caseStudy.summary}</p>

						{/* Participants */}
						<div className="flex items-center gap-4">
							<div className="flex items-center gap-2">
								<Users className="h-5 w-5 text-muted-foreground" />
								<span className="text-sm font-medium">Participants:</span>
							</div>
							<div className="flex -space-x-2">
								{caseStudy.participants.map((participant) => (
									<Avatar key={participant.id} className="h-8 w-8 border-2 border-background">
										<AvatarImage src={participant.avatar} alt={participant.name} />
										<AvatarFallback className="text-sm">{participant.name.charAt(0)}</AvatarFallback>
									</Avatar>
								))}
							</div>
							<div className="flex flex-wrap gap-1">
								{caseStudy.participants.map((participant) => (
									<Badge key={participant.id} variant="outline" className="text-xs">
										{participant.name}
									</Badge>
								))}
							</div>
						</div>

						{/* Topics */}
						<div className="flex items-center gap-2">
							<Tag className="h-4 w-4 text-muted-foreground" />
							<div className="flex flex-wrap gap-1">
								{caseStudy.topics.map((topic) => (
									<Badge key={topic} variant="secondary" className="text-xs">
										{topic}
									</Badge>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Content */}
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
					<TabsList className="grid w-full grid-cols-4">
						<TabsTrigger value="overview">Overview</TabsTrigger>
						<TabsTrigger value="conversation">Conversation</TabsTrigger>
						<TabsTrigger value="analysis">Analysis</TabsTrigger>
						<TabsTrigger value="insights">Insights</TabsTrigger>
					</TabsList>

					{/* Overview Tab */}
					<TabsContent value="overview" className="space-y-6">
						<Card>
							<CardHeader>
								<h2 className="text-xl font-semibold">Case Study Overview</h2>
							</CardHeader>
							<CardContent className="space-y-4">
								<p className="text-muted-foreground">{caseStudy.description}</p>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div>
										<h3 className="font-medium mb-2">Key Takeaways</h3>
										<ul className="space-y-2">
											{caseStudy.keyTakeaways.map((takeaway, index) => (
												<li key={index} className="flex items-start gap-2 text-sm">
													<TrendingUp className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
													<span>{takeaway}</span>
												</li>
											))}
										</ul>
									</div>

									<div>
										<h3 className="font-medium mb-2">Participants</h3>
										<div className="space-y-3">
											{caseStudy.participants.map((participant) => (
												<div key={participant.id} className="flex items-start gap-3 text-sm">
													<Avatar className="h-8 w-8">
														<AvatarImage src={participant.avatar} alt={participant.name} />
														<AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
													</Avatar>
													<div className="flex-1">
														<div className="font-medium">{participant.name}</div>
														<div className="text-muted-foreground">{participant.description}</div>
														<Badge variant="outline" className="text-xs mt-1">
															{participant.model}
														</Badge>
													</div>
												</div>
											))}
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					{/* Conversation Tab */}
					<TabsContent value="conversation" className="space-y-6">
						<Card>
							<CardHeader>
								<h2 className="text-xl font-semibold">Full Conversation</h2>
								<p className="text-sm text-muted-foreground">Click on any message to quote it or view detailed analysis</p>
							</CardHeader>
							<CardContent>
								<ScrollArea className="h-[600px] pr-4">
									<div className="space-y-6">
										{caseStudy.messages.map((message, index) => (
											<div key={message.id}>
												<MessageBubble message={message} showAnalysis={false} />
												{index < caseStudy.messages.length - 1 && <Separator className="my-4" />}
											</div>
										))}
									</div>
								</ScrollArea>
							</CardContent>
						</Card>
					</TabsContent>

					{/* Analysis Tab */}
					<TabsContent value="analysis" className="space-y-6">
						<Card>
							<CardHeader>
								<h2 className="text-xl font-semibold">Detailed Analysis</h2>
								<p className="text-sm text-muted-foreground">Each message analyzed for learning opportunities</p>
							</CardHeader>
							<CardContent>
								<div className="space-y-6">
									{caseStudy.messages.map((message) => {
										const analysisPoint = caseStudy.analysisPoints.find((a) => a.messageId === message.id);
										if (!analysisPoint) return null;

										return (
											<div key={message.id}>
												<MessageBubble message={message} showAnalysis={true} />
												<Separator className="my-4" />
											</div>
										);
									})}
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					{/* Insights Tab */}
					<TabsContent value="insights" className="space-y-6">
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
							<Card>
								<CardHeader>
									<h2 className="text-xl font-semibold flex items-center gap-2">
										<Lightbulb className="h-5 w-5" />
										Key Insights
									</h2>
								</CardHeader>
								<CardContent>
									<div className="space-y-3">
										{caseStudy.analysisPoints.map((point, index) => (
											<div key={index} className="space-y-2">
												<div className="flex items-center gap-2">
													{getCategoryIcon(point.category)}
													<span className="font-medium text-sm">{point.title}</span>
													<Badge variant="outline" className="text-xs">
														{point.category}
													</Badge>
												</div>
												<p className="text-sm text-muted-foreground pl-6">{point.analysis}</p>
											</div>
										))}
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<h2 className="text-xl font-semibold flex items-center gap-2">
										<TrendingUp className="h-5 w-5" />
										Related Topics
									</h2>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										<div>
											<h3 className="font-medium text-sm mb-2">Explore Related:</h3>
											<div className="flex flex-wrap gap-2">
												{caseStudy.relatedTopics.map((topic) => (
													<Badge key={topic} variant="outline" className="text-xs cursor-pointer hover:bg-accent">
														{topic}
													</Badge>
												))}
											</div>
										</div>

										<div>
											<h3 className="font-medium text-sm mb-2">Tags:</h3>
											<div className="flex flex-wrap gap-2">
												{caseStudy.tags.map((tag) => (
													<Badge key={tag} variant="secondary" className="text-xs">
														#{tag}
													</Badge>
												))}
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						</div>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
