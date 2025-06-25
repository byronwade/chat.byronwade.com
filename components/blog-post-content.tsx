"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, ThumbsUp, ThumbsDown, Share2, Copy, Quote, Target, Brain, Lightbulb, Search, Globe, ExternalLink, ArrowRight, TrendingUp, Users, BarChart3, MessageSquare, Vote, Eye, Bookmark, Clock } from "lucide-react";
import { ChatCaseStudyData } from "@/lib/chat-data";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";

interface BlogPostContentProps {
	caseStudy: ChatCaseStudyData;
}

interface PollOption {
	id: string;
	text: string;
	votes: number;
	percentage: number;
}

interface DebatePoll {
	id: string;
	question: string;
	options: PollOption[];
	totalVotes: number;
	isActive: boolean;
	category: "argument_strength" | "winner" | "topic_opinion" | "clarity";
}

interface UserComment {
	id: string;
	author: string;
	avatar?: string;
	content: string;
	timestamp: Date;
	likes: number;
	replies: UserComment[];
	messageId?: string;
	isHighlighted: boolean;
}

interface DebateStats {
	totalViews: number;
	avgReadTime: string;
	engagementRate: number;
	topArguments: { messageId: string; score: number; reason: string }[];
	sentimentAnalysis: {
		positive: number;
		neutral: number;
		negative: number;
	};
}

export function BlogPostContent({ caseStudy }: BlogPostContentProps) {
	const [showThinking, setShowThinking] = useState(true);
	const [selectedCategory, setSelectedCategory] = useState<string>("all");
	const [userVotes, setUserVotes] = useState<Record<string, string>>({});
	const [comments, setComments] = useState<UserComment[]>([]);
	const [newComment, setNewComment] = useState("");
	const [bookmarkedMessages, setBookmarkedMessages] = useState<Set<string>>(new Set());
	const [messageRatings, setMessageRatings] = useState<Record<string, { up: number; down: number }>>({});

	// Mock data for interactive features
	const debatePolls: DebatePoll[] = [
		{
			id: "winner",
			question: "Which AI agent presented the strongest overall argument?",
			options: [
				{ id: "claude", text: "Claude", votes: 142, percentage: 35 },
				{ id: "gpt4", text: "GPT-4", votes: 128, percentage: 32 },
				{ id: "gemini", text: "Gemini", votes: 89, percentage: 22 },
				{ id: "mistral", text: "Mistral", votes: 45, percentage: 11 },
			],
			totalVotes: 404,
			isActive: true,
			category: "winner",
		},
		{
			id: "topic_stance",
			question: "What's your stance on the main debate topic?",
			options: [
				{ id: "strongly_agree", text: "Strongly Agree", votes: 89, percentage: 28 },
				{ id: "agree", text: "Agree", votes: 112, percentage: 35 },
				{ id: "neutral", text: "Neutral", votes: 67, percentage: 21 },
				{ id: "disagree", text: "Disagree", votes: 51, percentage: 16 },
			],
			totalVotes: 319,
			isActive: true,
			category: "topic_opinion",
		},
	];

	const debateStats: DebateStats = {
		totalViews: 2847,
		avgReadTime: "12 min",
		engagementRate: 78,
		topArguments: [
			{ messageId: "1", score: 94, reason: "Clear logical structure" },
			{ messageId: "3", score: 87, reason: "Strong evidence provided" },
			{ messageId: "2", score: 82, reason: "Compelling counterpoint" },
		],
		sentimentAnalysis: {
			positive: 65,
			neutral: 25,
			negative: 10,
		},
	};

	const copyMessage = (content: string) => {
		navigator.clipboard.writeText(content);
	};

	const shareMessage = (content: string, senderName: string) => {
		if (navigator.share) {
			navigator.share({
				title: `Message from ${senderName}`,
				text: content,
				url: window.location.href,
			});
		} else {
			copyMessage(`${senderName}: ${content}\n\nFrom: ${window.location.href}`);
		}
	};

	const processContent = (content: string) => {
		return content
			.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
			.replace(/\*(.*?)\*/g, "<em>$1</em>")
			.replace(/`(.*?)`/g, '<code class="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')
			.replace(/\n/g, "<br />");
	};

	const formatTimestamp = (timestamp: Date) => {
		return timestamp.toLocaleString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const getNarrativeForMessage = (messageIndex: number) => {
		if (caseStudy.slug === "ai-ethics-regulation-debate") {
			switch (messageIndex) {
				case 0:
					return {
						before: "The conversation begins with Claude establishing the foundational challenge of AI regulation. As our scholarly analyst, Claude approaches this complex topic with characteristic methodical thinking, immediately identifying the core tension between innovation and safety.",
						after: "Claude's opening sets a thoughtful tone for the debate. The concept of 'principled flexibility' becomes a recurring theme throughout the conversation. Notice how Claude grounds abstract regulatory concepts in practical governance challenges, demonstrating the analytical depth that makes these AI discussions so valuable for understanding complex policy issues.",
					};
				case 1:
					return {
						before: "GPT-4 builds brilliantly on Claude&apos;s foundation, transforming the abstract concept of adaptive regulation into a concrete vision of collaborative innovation. This response exemplifies GPT-4&apos;s creative problem-solving approach, taking Claude&apos;s framework and reimagining it through a more participatory lens.",
						after: "The shift from regulatory oversight to collaborative partnership represents a significant evolution in thinking. GPT-4&apos;s vision of &apos;living laboratories&apos; introduces a dynamic element that will influence how the other agents approach this challenge. This type of creative expansion is why multi-agent conversations often produce insights that single perspectives might miss.",
					};
				case 2:
					return {
						before: "Gemini enters with a systems perspective that adds crucial complexity to the discussion. While Claude focused on regulatory mechanisms and GPT-4 on collaborative processes, Gemini zooms out to examine the broader systemic implications of AI governance.",
						after: "This response demonstrates Gemini&apos;s strength in pattern recognition and holistic thinking. By connecting AI regulation to broader social, economic, and democratic processes, Gemini elevates the conversation from technical policy to fundamental questions about how we govern complex interconnected systems. The multi-stakeholder governance networks concept will prove influential in subsequent discussions.",
					};
				case 3:
					return {
						before: "Mistral brings the conversation back to concrete implementation with characteristic precision. After three messages exploring theoretical frameworks, Mistral provides the practical roadmap that transforms abstract concepts into actionable policy recommendations.",
						after: "The four-point implementation strategy showcases Mistral&apos;s strength in technical precision and practical thinking. By referencing the European AI Act and emphasizing international coordination, Mistral demonstrates how regulatory frameworks can be both specific and scalable. This grounding in real-world examples provides the concrete foundation that the theoretical frameworks need to become policy reality.",
					};
			}
		}

		// Default narrative for other case studies
		return {
			before: "",
			after: "",
		};
	};

	const handleVote = (pollId: string, optionId: string) => {
		setUserVotes((prev) => ({ ...prev, [pollId]: optionId }));
	};

	const handleMessageRating = (messageId: string, type: "up" | "down") => {
		setMessageRatings((prev) => ({
			...prev,
			[messageId]: {
				up: (prev[messageId]?.up || 0) + (type === "up" ? 1 : 0),
				down: (prev[messageId]?.down || 0) + (type === "down" ? 1 : 0),
			},
		}));
	};

	const toggleBookmark = (messageId: string) => {
		setBookmarkedMessages((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(messageId)) {
				newSet.delete(messageId);
			} else {
				newSet.add(messageId);
			}
			return newSet;
		});
	};

	const addComment = () => {
		if (!newComment.trim()) return;

		const comment: UserComment = {
			id: Date.now().toString(),
			author: "Anonymous Reader",
			content: newComment,
			timestamp: new Date(),
			likes: 0,
			replies: [],
			isHighlighted: false,
		};

		setComments((prev) => [comment, ...prev]);
		setNewComment("");
	};

	const analysisCategories = ["all", "reasoning", "strategy", "insight", "collaboration", "ethics"];
	const filteredAnalysis = selectedCategory === "all" ? caseStudy.analysisPoints : caseStudy.analysisPoints.filter((point) => point.category === selectedCategory);

	return (
		<div className="min-h-screen bg-background">
			{/* Enhanced Hero Section */}
			<div className="relative border-b border-border">
				{/* Background Pattern */}
				<div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-background to-purple-50/50 dark:from-blue-950/20 dark:via-background dark:to-purple-950/20" />
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.05),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]" />

				<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
					<div className="max-w-4xl">
						{/* Header Meta */}
						<div className="flex items-center gap-3 mb-8">
							<Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 px-3 py-1">
								<Target className="h-3 w-3 mr-1" />
								AI Debate Case Study
							</Badge>
							<Badge variant="outline" className="border-border text-muted-foreground capitalize px-3 py-1">
								{caseStudy.difficulty} Level
							</Badge>
							<div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
								<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
								Live Debate Archive
							</div>
						</div>

						{/* Main Title */}
						<h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-8 leading-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">{caseStudy.title}</h1>

						{/* Description */}
						<p className="text-xl lg:text-2xl text-muted-foreground mb-10 leading-relaxed font-light">{caseStudy.description}</p>

						{/* Stats Bar */}
						<div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 p-6 bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl">
							<div className="text-center">
								<div className="flex items-center justify-center gap-2 mb-2">
									<Clock className="h-4 w-4 text-blue-500" />
									<span className="text-2xl font-bold text-foreground">{caseStudy.readTime}</span>
								</div>
								<p className="text-sm text-muted-foreground">min read</p>
							</div>
							<div className="text-center">
								<div className="flex items-center justify-center gap-2 mb-2">
									<Eye className="h-4 w-4 text-green-500" />
									<span className="text-2xl font-bold text-foreground">{debateStats.totalViews.toLocaleString()}</span>
								</div>
								<p className="text-sm text-muted-foreground">views</p>
							</div>
							<div className="text-center">
								<div className="flex items-center justify-center gap-2 mb-2">
									<MessageCircle className="h-4 w-4 text-purple-500" />
									<span className="text-2xl font-bold text-foreground">{caseStudy.messages.length}</span>
								</div>
								<p className="text-sm text-muted-foreground">messages</p>
							</div>
							<div className="text-center">
								<div className="flex items-center justify-center gap-2 mb-2">
									<Users className="h-4 w-4 text-orange-500" />
									<span className="text-2xl font-bold text-foreground">{caseStudy.participants.length}</span>
								</div>
								<p className="text-sm text-muted-foreground">AI agents</p>
							</div>
						</div>

						{/* Topics */}
						<div className="flex flex-wrap gap-2">
							{caseStudy.topics.map((topic) => (
								<Badge key={topic} variant="outline" className="border-border/50 text-muted-foreground bg-background/50 backdrop-blur-sm hover:bg-muted/50 transition-colors px-3 py-1">
									{topic}
								</Badge>
							))}
						</div>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
				<div className="flex gap-8 lg:gap-12">
					{/* Main Content Column */}
					<div className="flex-1 min-w-0">
						{/* Introduction */}
						<div className="prose prose-neutral dark:prose-invert max-w-none mb-12 lg:mb-16">
							<h2 className="text-2xl lg:text-3xl font-bold mb-6 text-foreground">Understanding This Conversation</h2>
							<p className="text-base lg:text-lg text-muted-foreground leading-relaxed mb-6">This conversation represents a fascinating exploration of {caseStudy.topics.join(", ").toLowerCase()}, showcasing how different AI models approach complex topics with unique perspectives and reasoning styles. Each agent brings distinct capabilities and viewpoints, creating a rich dialogue that reveals insights into both the subject matter and AI reasoning itself.</p>
							<p className="text-muted-foreground leading-relaxed">As you read through this exchange, pay attention to how each AI agent builds upon previous contributions while maintaining their characteristic approach to problem-solving. The interplay between different reasoning styles—analytical, creative, systematic, and practical—demonstrates the value of diverse perspectives in tackling complex challenges.</p>
						</div>

						{/* Participants Section */}
						<div className="mb-12 lg:mb-16">
							<h2 className="text-xl lg:text-2xl font-bold mb-6 flex items-center gap-2 text-foreground">
								<Users className="h-5 w-5 lg:h-6 lg:w-6" />
								Meet the Participants
							</h2>

							<p className="text-muted-foreground mb-6">Each AI agent in this conversation brings unique capabilities and perspectives:</p>

							{/* Participants Grid */}
							<div className="grid gap-4 sm:grid-cols-2">
								{caseStudy.participants.map((participant) => (
									<Card key={participant.id} className="bg-card border-border hover:border-primary/20 transition-colors">
										<CardContent className="p-4">
											<div className="flex items-start gap-3">
												<Avatar className="h-10 w-10 ring-2 ring-border">
													<AvatarImage src={participant.avatar} alt={participant.name} />
													<AvatarFallback className="bg-muted text-muted-foreground font-medium">{participant.name.charAt(0)}</AvatarFallback>
												</Avatar>
												<div className="flex-1 min-w-0">
													<div className="flex items-center gap-2 mb-1">
														<h3 className="font-semibold text-foreground">{participant.name}</h3>
														<Badge variant="outline" className="text-xs border-border text-muted-foreground">
															{participant.model}
														</Badge>
													</div>
													<p className="text-sm text-muted-foreground mb-2">{participant.description}</p>
													<p className="text-xs text-muted-foreground italic">{participant.personality}</p>
												</div>
											</div>
										</CardContent>
									</Card>
								))}
							</div>
						</div>

						{/* Conversation */}
						<div className="mb-12 lg:mb-16">
							<div className="flex items-center justify-between mb-6">
								<h2 className="text-2xl lg:text-3xl font-bold flex items-center gap-2 text-foreground">
									<MessageCircle className="h-6 w-6 lg:h-7 lg:w-7" />
									The Conversation Unfolds
								</h2>
								<div className="flex items-center gap-2">
									<Button variant={showThinking ? "default" : "outline"} size="sm" onClick={() => setShowThinking(!showThinking)} className="text-xs">
										<Brain className="h-3 w-3 mr-1" />
										{showThinking ? "Hide" : "Show"} Thinking
									</Button>
								</div>
							</div>

							<p className="text-muted-foreground mb-8 leading-relaxed">What follows is the complete conversation between our AI agents, enhanced with analysis and commentary. Each message showcases different reasoning approaches, expertise areas, and collaborative dynamics. The narrative between messages provides context and highlights the unique contributions each agent makes to the discussion.</p>

							{/* Enhanced Messages with Interactive Features */}
							<div className="space-y-12">
								{caseStudy.messages.map((message, messageIndex) => {
									const narrative = getNarrativeForMessage(messageIndex);
									const isBookmarked = bookmarkedMessages.has(message.id);
									const ratings = messageRatings[message.id] || { up: 0, down: 0 };

									return (
										<div key={message.id} className="group">
											{/* Before Message Narrative */}
											{narrative.before && (
												<div className="mb-8 p-6 bg-blue-50/50 dark:bg-blue-950/10 border border-blue-200/50 dark:border-blue-800/30 rounded-xl">
													<div className="flex items-center gap-2 mb-3">
														<Target className="h-4 w-4 text-blue-600 dark:text-blue-400" />
														<span className="text-sm font-medium text-blue-700 dark:text-blue-300">Context & Analysis</span>
													</div>
													<p className="text-blue-800 dark:text-blue-200 leading-relaxed italic">{narrative.before}</p>
												</div>
											)}

											{/* Message */}
											<div className="flex gap-4">
												<Avatar className="h-12 w-12 ring-2 ring-border shadow-sm flex-shrink-0">
													<AvatarImage src={message.senderAvatar} alt={message.senderName} />
													<AvatarFallback className="bg-muted text-muted-foreground font-medium">{message.senderName.charAt(0)}</AvatarFallback>
												</Avatar>

												<div className="flex-1 min-w-0">
													{/* Enhanced Message Header with Bookmark */}
													<div className="flex items-center gap-3 mb-3">
														<div className="font-semibold text-foreground">{message.senderName}</div>
														{message.confidence && (
															<Badge variant="outline" className="text-xs px-2 py-0.5 bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20">
																{Math.round(message.confidence * 100)}% confidence
															</Badge>
														)}
														{message.emotion && (
															<Badge variant="secondary" className="text-xs px-2 py-0.5 bg-muted text-muted-foreground">
																{message.emotion}
															</Badge>
														)}
														<Button variant="ghost" size="sm" className={`h-6 w-6 p-0 ml-auto ${isBookmarked ? "text-yellow-500" : "text-muted-foreground hover:text-yellow-500"}`} onClick={() => toggleBookmark(message.id)}>
															<Bookmark className={`h-3 w-3 ${isBookmarked ? "fill-current" : ""}`} />
														</Button>
														<div className="text-xs text-muted-foreground">{formatTimestamp(message.timestamp)}</div>
													</div>

													{/* Thinking Process */}
													{showThinking && message.thinking && message.thinking.length > 0 && (
														<div className="mb-4 p-4 bg-blue-50/30 dark:bg-blue-950/5 border border-blue-200/30 dark:border-blue-800/20 rounded-xl">
															<div className="flex items-center gap-2 mb-3 text-blue-600 dark:text-blue-400">
																<Brain className="h-4 w-4" />
																<span className="font-medium text-sm">Thinking Process</span>
															</div>
															<div className="space-y-2">
																{message.thinking.map((thought, thoughtIndex) => (
																	<div key={thoughtIndex} className="flex items-start gap-2">
																		<ArrowRight className="h-3 w-3 text-blue-500 dark:text-blue-400 mt-1 flex-shrink-0" />
																		<span className="text-sm text-blue-700 dark:text-blue-300">{thought}</span>
																	</div>
																))}
															</div>
														</div>
													)}

													{/* Message Content */}
													<Card className="bg-card border-border hover:border-primary/20 transition-colors">
														<CardContent className="p-6">
															<div className="text-foreground leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: processContent(message.content) }} />

															{/* Key Insights */}
															{message.keyInsights && message.keyInsights.length > 0 && (
																<div className="mb-4">
																	<div className="flex items-center gap-2 mb-2">
																		<Lightbulb className="h-4 w-4 text-amber-500" />
																		<span className="text-sm font-medium text-amber-600 dark:text-amber-400">Key Insights</span>
																	</div>
																	<div className="space-y-1">
																		{message.keyInsights.map((insight, insightIndex) => (
																			<div key={insightIndex} className="text-sm text-muted-foreground flex items-start gap-2">
																				<div className="w-1 h-1 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
																				{insight}
																			</div>
																		))}
																	</div>
																</div>
															)}

															{/* Sources */}
															{message.sources && message.sources.length > 0 && (
																<div className="mb-4">
																	<div className="flex items-center gap-2 mb-2">
																		<Search className="h-4 w-4 text-muted-foreground" />
																		<span className="text-sm font-medium text-muted-foreground">Sources Referenced</span>
																	</div>
																	<div className="space-y-2">
																		{message.sources.map((source, sourceIndex) => (
																			<div key={sourceIndex} className="flex items-center gap-2 text-sm">
																				<Globe className="h-3 w-3 text-muted-foreground" />
																				<span className="text-muted-foreground">{source.title}</span>
																				<Badge variant="outline" className="text-xs border-border text-muted-foreground">
																					{Math.round(source.relevance * 100)}% relevant
																				</Badge>
																				{source.url && (
																					<Button variant="ghost" size="sm" className="h-5 w-5 p-0 text-muted-foreground hover:text-foreground" onClick={() => window.open(source.url, "_blank")}>
																						<ExternalLink className="h-3 w-3" />
																					</Button>
																				)}
																			</div>
																		))}
																	</div>
																</div>
															)}

															{/* Enhanced Message Actions with Ratings */}
															<div className="flex items-center justify-between pt-4 border-t border-border">
																<div className="flex items-center gap-2">
																	<Button variant="ghost" size="sm" className="h-8 px-3 text-muted-foreground hover:text-foreground" onClick={() => copyMessage(message.content)}>
																		<Copy className="h-3 w-3 mr-1" />
																		Copy
																	</Button>
																	<Button variant="ghost" size="sm" className="h-8 px-3 text-muted-foreground hover:text-foreground" onClick={() => shareMessage(message.content, message.senderName)}>
																		<Share2 className="h-3 w-3 mr-1" />
																		Share
																	</Button>
																	<Button variant="ghost" size="sm" className="h-8 px-3 text-muted-foreground hover:text-foreground">
																		<Quote className="h-3 w-3 mr-1" />
																		Quote
																	</Button>
																</div>
																<div className="flex items-center gap-1">
																	<Button variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground hover:text-green-500 flex items-center gap-1" onClick={() => handleMessageRating(message.id, "up")}>
																		<ThumbsUp className="h-3 w-3" />
																		<span className="text-xs">{ratings.up}</span>
																	</Button>
																	<Button variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground hover:text-red-500 flex items-center gap-1" onClick={() => handleMessageRating(message.id, "down")}>
																		<ThumbsDown className="h-3 w-3" />
																		<span className="text-xs">{ratings.down}</span>
																	</Button>
																</div>
															</div>
														</CardContent>
													</Card>
												</div>
											</div>

											{/* After Message Narrative */}
											{narrative.after && (
												<div className="mt-8 ml-16 p-6 bg-purple-50/50 dark:bg-purple-950/10 border border-purple-200/50 dark:border-purple-800/30 rounded-xl">
													<div className="flex items-center gap-2 mb-3">
														<Lightbulb className="h-4 w-4 text-purple-600 dark:text-purple-400" />
														<span className="text-sm font-medium text-purple-700 dark:text-purple-300">Reflection & Impact</span>
													</div>
													<p className="text-purple-800 dark:text-purple-200 leading-relaxed italic">{narrative.after}</p>
												</div>
											)}

											{/* Message Analysis (if available) */}
											{caseStudy.analysisPoints.find((point) => point.messageId === message.id) && (
												<div className="ml-16 mt-4">
													{caseStudy.analysisPoints
														.filter((point) => point.messageId === message.id)
														.map((analysis, analysisIndex) => (
															<Card key={analysisIndex} className="bg-emerald-50/50 dark:bg-emerald-950/10 border-emerald-200/50 dark:border-emerald-800/30">
																<CardContent className="p-4">
																	<div className="flex items-center gap-2 mb-2">
																		<Target className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
																		<span className="font-medium text-emerald-700 dark:text-emerald-300">{analysis.title}</span>
																		<Badge variant="outline" className="text-xs border-emerald-200 text-emerald-600 dark:border-emerald-800/30 dark:text-emerald-400">
																			{analysis.category}
																		</Badge>
																	</div>
																	<p className="text-sm text-emerald-800 dark:text-emerald-200">{analysis.analysis}</p>
																</CardContent>
															</Card>
														))}
												</div>
											)}
										</div>
									);
								})}
							</div>
						</div>

						{/* Community Sentiment Analysis */}
						<div className="mb-12 lg:mb-16">
							<h2 className="text-xl lg:text-2xl font-bold mb-6 flex items-center gap-2 text-foreground">
								<BarChart3 className="h-5 w-5 lg:h-6 lg:w-6" />
								Community Sentiment
							</h2>
							<p className="text-muted-foreground mb-6">Here&apos;s how the community has responded to this debate:</p>

							<Card className="bg-card border-border">
								<CardContent className="p-6">
									<div className="grid gap-6 md:grid-cols-2">
										<div className="space-y-4">
											<h3 className="font-semibold text-foreground">Overall Reaction</h3>
											<div className="space-y-3">
												<div className="space-y-2">
													<div className="flex justify-between text-sm">
														<span className="text-green-600 dark:text-green-400">Positive</span>
														<span>{debateStats.sentimentAnalysis.positive}%</span>
													</div>
													<Progress value={debateStats.sentimentAnalysis.positive} className="h-2" />
												</div>
												<div className="space-y-2">
													<div className="flex justify-between text-sm">
														<span className="text-blue-600 dark:text-blue-400">Neutral</span>
														<span>{debateStats.sentimentAnalysis.neutral}%</span>
													</div>
													<Progress value={debateStats.sentimentAnalysis.neutral} className="h-2" />
												</div>
												<div className="space-y-2">
													<div className="flex justify-between text-sm">
														<span className="text-red-600 dark:text-red-400">Critical</span>
														<span>{debateStats.sentimentAnalysis.negative}%</span>
													</div>
													<Progress value={debateStats.sentimentAnalysis.negative} className="h-2" />
												</div>
											</div>
										</div>

										<div className="space-y-4">
											<h3 className="font-semibold text-foreground">Top Rated Arguments</h3>
											<div className="space-y-3">
												{debateStats.topArguments.map((arg, index) => (
													<div key={arg.messageId} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
														<div className="flex items-center justify-center w-6 h-6 bg-primary text-primary-foreground rounded-full text-xs font-bold">{index + 1}</div>
														<div className="flex-1">
															<div className="font-medium text-sm text-foreground">Score: {arg.score}/100</div>
															<div className="text-xs text-muted-foreground">{arg.reason}</div>
														</div>
													</div>
												))}
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						</div>

						{/* Conversation Summary */}
						<div className="mb-12 lg:mb-16 p-8 bg-gradient-to-r from-muted/30 to-muted/20 border border-border rounded-xl">
							<h2 className="text-xl lg:text-2xl font-bold mb-4 flex items-center gap-2 text-foreground">
								<Brain className="h-6 w-6 text-primary" />
								Conversation Summary
							</h2>
							<p className="text-muted-foreground leading-relaxed mb-4">This conversation demonstrates the power of multi-agent AI collaboration in exploring complex topics. Each agent contributed unique perspectives—analytical frameworks, creative solutions, systems thinking, and practical implementation—that together form a more comprehensive understanding than any single viewpoint could provide.</p>
							<p className="text-muted-foreground leading-relaxed">The interplay between different reasoning styles showcases how AI agents can build upon each other&apos;s contributions, creating emergent insights that emerge from their collaborative dialogue. This type of multi-perspective analysis is particularly valuable for tackling multifaceted challenges that require both theoretical depth and practical consideration.</p>
						</div>

						{/* Analysis Section */}
						<div className="mb-12 lg:mb-16">
							<h2 className="text-2xl lg:text-3xl font-bold mb-6 flex items-center gap-2 text-foreground">
								<Target className="h-6 w-6 lg:h-7 lg:w-7" />
								Deeper Analysis
							</h2>

							{/* Category Filter */}
							<div className="flex flex-wrap gap-2 mb-6">
								{analysisCategories.map((category) => (
									<Button key={category} variant={selectedCategory === category ? "default" : "outline"} size="sm" onClick={() => setSelectedCategory(category)} className="capitalize">
										{category}
										{category !== "all" && (
											<Badge variant="secondary" className="ml-2 text-xs">
												{caseStudy.analysisPoints.filter((p) => p.category === category).length}
											</Badge>
										)}
									</Button>
								))}
							</div>

							<div className="grid gap-6">
								{filteredAnalysis.map((analysis, index) => (
									<Card key={index} className="bg-card border-border">
										<CardHeader>
											<CardTitle className="flex items-center gap-2">
												<Target className="h-5 w-5 text-amber-500" />
												{analysis.title}
												<Badge variant="outline" className="ml-auto border-border text-muted-foreground">
													{analysis.category}
												</Badge>
											</CardTitle>
										</CardHeader>
										<CardContent>
											<p className="text-muted-foreground leading-relaxed">{analysis.analysis}</p>
										</CardContent>
									</Card>
								))}
							</div>
						</div>

						{/* Community Discussion */}
						<div className="mb-12 lg:mb-16">
							<h2 className="text-xl lg:text-2xl font-bold mb-6 flex items-center gap-2 text-foreground">
								<MessageSquare className="h-5 w-5 lg:h-6 lg:w-6" />
								Join the Discussion
							</h2>
							<p className="text-muted-foreground mb-6">What are your thoughts on this AI debate? Share your perspective below:</p>

							{/* Comment Input */}
							<Card className="bg-card border-border mb-6">
								<CardContent className="p-4">
									<div className="space-y-3">
										<Textarea placeholder="Share your thoughts about this debate..." value={newComment} onChange={(e) => setNewComment(e.target.value)} className="min-h-[100px]" />
										<div className="flex justify-between items-center">
											<div className="text-xs text-muted-foreground">Be respectful and constructive in your comments</div>
											<Button onClick={addComment} disabled={!newComment.trim()}>
												<MessageSquare className="h-4 w-4 mr-2" />
												Post Comment
											</Button>
										</div>
									</div>
								</CardContent>
							</Card>

							{/* Comments List */}
							<div className="space-y-4">
								{comments.length === 0 ? (
									<Card className="bg-muted/20 border-dashed border-2 border-muted">
										<CardContent className="p-8 text-center">
											<MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
											<h3 className="font-medium text-foreground mb-2">No comments yet</h3>
											<p className="text-muted-foreground">Be the first to share your thoughts about this debate!</p>
										</CardContent>
									</Card>
								) : (
									comments.map((comment) => (
										<Card key={comment.id} className="bg-card border-border">
											<CardContent className="p-4">
												<div className="flex items-start gap-3">
													<Avatar className="h-8 w-8">
														<AvatarImage src={comment.avatar} alt={comment.author} />
														<AvatarFallback className="text-xs">{comment.author.charAt(0)}</AvatarFallback>
													</Avatar>
													<div className="flex-1">
														<div className="flex items-center gap-2 mb-2">
															<span className="font-medium text-sm text-foreground">{comment.author}</span>
															<span className="text-xs text-muted-foreground">{formatTimestamp(comment.timestamp)}</span>
														</div>
														<p className="text-sm text-foreground leading-relaxed">{comment.content}</p>
														<div className="flex items-center gap-2 mt-2">
															<Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground">
																<ThumbsUp className="h-3 w-3 mr-1" />
																{comment.likes}
															</Button>
															<Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground">
																Reply
															</Button>
														</div>
													</div>
												</div>
											</CardContent>
										</Card>
									))
								)}
							</div>
						</div>

						{/* Key Takeaways */}
						<div className="mb-12 lg:mb-16">
							<h2 className="text-2xl lg:text-3xl font-bold mb-6 flex items-center gap-2 text-foreground">
								<TrendingUp className="h-6 w-6 lg:h-7 lg:w-7" />
								Key Takeaways
							</h2>
							<div className="grid gap-4">
								{caseStudy.keyTakeaways.map((takeaway, index) => (
									<Card key={index} className="bg-green-50/50 dark:bg-green-950/10 border-green-200/50 dark:border-green-800/30">
										<CardContent className="p-6">
											<div className="flex items-start gap-3">
												<div className="w-6 h-6 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
													<div className="w-2 h-2 bg-green-500 rounded-full" />
												</div>
												<p className="text-green-800 dark:text-green-200 leading-relaxed">{takeaway}</p>
											</div>
										</CardContent>
									</Card>
								))}
							</div>
						</div>

						{/* Related Topics */}
						<div className="mb-12">
							<h2 className="text-xl lg:text-2xl font-bold mb-6 text-foreground">Related Topics</h2>
							<div className="flex flex-wrap gap-2">
								{caseStudy.relatedTopics.map((topic) => (
									<Badge key={topic} variant="outline" className="border-border text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors cursor-pointer">
										{topic}
									</Badge>
								))}
							</div>
						</div>
					</div>

					{/* Sidebar */}
					<div className="hidden lg:block w-80 flex-shrink-0">
						<div className="sticky top-8 max-h-[calc(100vh-4rem)] overflow-y-auto space-y-4">
							{/* Community Polls */}
							<Card className="bg-card border-border">
								<CardHeader className="pb-3">
									<CardTitle className="text-base flex items-center gap-2">
										<Vote className="h-4 w-4" />
										Community Polls
									</CardTitle>
								</CardHeader>
								<CardContent className="pt-0 space-y-4">
									{debatePolls.slice(0, 1).map((poll) => (
										<div key={poll.id} className="space-y-3">
											<div>
												<h4 className="font-medium text-sm mb-1">{poll.question}</h4>
												<p className="text-xs text-muted-foreground">{poll.totalVotes} votes</p>
											</div>
											<div className="space-y-2">
												{poll.options.map((option) => {
													const isSelected = userVotes[poll.id] === option.id;
													return (
														<div key={option.id} className="space-y-1">
															<Button variant={isSelected ? "default" : "outline"} className="w-full justify-between h-auto p-2 text-xs" onClick={() => handleVote(poll.id, option.id)}>
																<span className="truncate">{option.text}</span>
																<span className="ml-2">{option.votes}</span>
															</Button>
															<div className="w-full bg-muted rounded-full h-1">
																<div className="bg-primary rounded-full h-1 transition-all duration-300" style={{ width: `${option.percentage}%` }} />
															</div>
														</div>
													);
												})}
											</div>
										</div>
									))}
								</CardContent>
							</Card>

							{/* Live Chat Highlights */}
							<Card className="bg-card border-border">
								<CardHeader className="pb-3">
									<CardTitle className="text-base flex items-center gap-2">
										<MessageCircle className="h-4 w-4" />
										Live Chat Highlights
									</CardTitle>
								</CardHeader>
								<CardContent className="pt-0">
									<div className="space-y-2 max-h-64 overflow-y-auto">
										{[
											{ time: "14:32", user: "TechEnthusiast", message: "Claude&apos;s opening is so methodical! 🧠", reactions: 12 },
											{ time: "14:38", user: "PolicyWonk", message: "This regulation framework discussion is exactly what we need", reactions: 15 },
											{ time: "14:45", user: "EthicsFirst", message: "Mistral nailed the implementation details", reactions: 11 },
											{ time: "14:52", user: "InnovationHub", message: "The collaborative approach vs oversight tension is fascinating", reactions: 14 },
										].map((chat, index) => (
											<div key={index} className="p-2 bg-muted/20 rounded-lg">
												<div className="flex items-center gap-2 mb-1">
													<span className="text-xs font-medium text-primary truncate">{chat.user}</span>
													<span className="text-xs text-muted-foreground">{chat.time}</span>
												</div>
												<p className="text-xs text-foreground mb-1 line-clamp-2">{chat.message}</p>
												<div className="flex items-center gap-1">
													<ThumbsUp className="h-3 w-3 text-muted-foreground" />
													<span className="text-xs text-muted-foreground">{chat.reactions}</span>
												</div>
											</div>
										))}
									</div>
								</CardContent>
							</Card>

							{/* Live Stats */}
							<Card className="bg-card border-border">
								<CardHeader className="pb-3">
									<CardTitle className="text-base flex items-center gap-2">
										<BarChart3 className="h-4 w-4" />
										Live Stats
									</CardTitle>
								</CardHeader>
								<CardContent className="pt-0">
									<div className="grid grid-cols-2 gap-3 text-xs">
										<div className="text-center p-2 bg-muted/20 rounded-lg">
											<div className="font-bold text-lg text-foreground">1.2K</div>
											<div className="text-muted-foreground">Peak Viewers</div>
										</div>
										<div className="text-center p-2 bg-muted/20 rounded-lg">
											<div className="font-bold text-lg text-foreground">2.9K</div>
											<div className="text-muted-foreground">Chat Messages</div>
										</div>
										<div className="text-center p-2 bg-muted/20 rounded-lg">
											<div className="font-bold text-lg text-foreground">78%</div>
											<div className="text-muted-foreground">Engagement</div>
										</div>
										<div className="text-center p-2 bg-muted/20 rounded-lg">
											<div className="font-bold text-lg text-foreground">856</div>
											<div className="text-muted-foreground">Reactions</div>
										</div>
									</div>
									<div className="mt-3 p-2 bg-green-50/50 dark:bg-green-950/10 rounded-lg border border-green-200/50 dark:border-green-800/30">
										<div className="flex items-center gap-2">
											<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
											<span className="text-xs font-medium text-green-700 dark:text-green-300">Live Archive</span>
										</div>
									</div>
								</CardContent>
							</Card>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
