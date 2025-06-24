"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Clock, Users, TrendingUp, Brain, ArrowRight, Copy, Share2, ExternalLink, Quote, Lightbulb, Target, Zap, Calendar, Tag, Search, MessageCircle, ThumbsUp, ThumbsDown, Globe } from "lucide-react";
import { ChatCaseStudyData, ChatMessage } from "@/lib/chat-data";

interface BlogPostContentProps {
	caseStudy: ChatCaseStudyData;
}

export function BlogPostContent({ caseStudy }: BlogPostContentProps) {
	const [showThinking, setShowThinking] = useState(true);
	const [selectedCategory, setSelectedCategory] = useState<string>("all");

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
			copyMessage(`"${content}" - ${senderName}\n\nFrom: ${window.location.href}`);
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

	const analysisCategories = ["all", "reasoning", "strategy", "insight", "collaboration", "ethics"];
	const filteredAnalysis = selectedCategory === "all" ? caseStudy.analysisPoints : caseStudy.analysisPoints.filter((point) => point.category === selectedCategory);

	// Narrative content for different sections
	const getNarrativeForMessage = (messageIndex: number, message: ChatMessage, caseStudy: ChatCaseStudyData) => {
		if (caseStudy.slug === "ai-ethics-regulation-debate") {
			switch (messageIndex) {
				case 0:
					return {
						before: "The conversation begins with Claude establishing the foundational challenge of AI regulation. As our scholarly analyst, Claude approaches this complex topic with characteristic methodical thinking, immediately identifying the core tension between innovation and safety.",
						after: "Claude's opening sets a thoughtful tone for the debate. The concept of 'principled flexibility' becomes a recurring theme throughout the conversation. Notice how Claude grounds abstract regulatory concepts in practical governance challenges, demonstrating the analytical depth that makes these AI discussions so valuable for understanding complex policy issues.",
					};
				case 1:
					return {
						before: "GPT-4 builds brilliantly on Claude's foundation, transforming the abstract concept of adaptive regulation into a concrete vision of collaborative innovation. This response exemplifies GPT-4's creative problem-solving approach, taking Claude's framework and reimagining it through a more participatory lens.",
						after: "The shift from regulatory oversight to collaborative partnership represents a significant evolution in thinking. GPT-4's vision of 'living laboratories' introduces a dynamic element that will influence how the other agents approach this challenge. This type of creative expansion is why multi-agent conversations often produce insights that single perspectives might miss.",
					};
				case 2:
					return {
						before: "Gemini enters with a systems perspective that adds crucial complexity to the discussion. While Claude focused on regulatory mechanisms and GPT-4 on collaborative processes, Gemini zooms out to examine the broader systemic implications of AI governance.",
						after: "This response demonstrates Gemini's strength in pattern recognition and holistic thinking. By connecting AI regulation to broader social, economic, and democratic processes, Gemini elevates the conversation from technical policy to fundamental questions about how we govern complex interconnected systems. The multi-stakeholder governance networks concept will prove influential in subsequent discussions.",
					};
				case 3:
					return {
						before: "Mistral brings the conversation back to concrete implementation with characteristic precision. After three messages exploring theoretical frameworks, Mistral provides the practical roadmap that transforms abstract concepts into actionable policy recommendations.",
						after: "The four-point implementation strategy showcases Mistral's strength in technical precision and practical thinking. By referencing the European AI Act and emphasizing international coordination, Mistral demonstrates how regulatory frameworks can be both specific and scalable. This grounding in real-world examples provides the concrete foundation that the theoretical frameworks need to become policy reality.",
					};
			}
		}

		// Default narrative for other case studies
		return {
			before: `Message ${messageIndex + 1} from ${message.senderName} brings a ${message.emotion || "thoughtful"} perspective to the discussion, building on the previous contributions with their unique analytical approach.`,
			after: `This response demonstrates ${message.senderName}&apos;s distinctive reasoning style and adds valuable insights to the evolving conversation. The key insights highlighted above show how each AI agent contributes specialized knowledge to the collaborative discussion.`,
		};
	};

	return (
		<TooltipProvider>
			<div className="min-h-screen bg-background">
				{/* Hero Section */}
				<div className="border-b border-border bg-gradient-to-br from-blue-50/30 via-background to-purple-50/30 dark:from-blue-950/10 dark:via-background dark:to-purple-950/10">
					<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
						<div className="flex items-center gap-2 mb-6">
							<Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
								Case Study
							</Badge>
							<Badge variant="outline" className="border-border text-muted-foreground capitalize">
								{caseStudy.difficulty}
							</Badge>
						</div>

						<h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight text-foreground">{caseStudy.title}</h1>

						<p className="text-lg lg:text-xl text-muted-foreground mb-8 leading-relaxed">{caseStudy.description}</p>

						{/* Meta Information */}
						<div className="flex flex-wrap items-center gap-4 lg:gap-6 text-sm text-muted-foreground">
							<div className="flex items-center gap-2">
								<Clock className="h-4 w-4" />
								<span>{caseStudy.readTime} min read</span>
							</div>
							<div className="flex items-center gap-2">
								<Calendar className="h-4 w-4" />
								<span>{formatTimestamp(caseStudy.publishedAt)}</span>
							</div>
							<div className="flex items-center gap-2">
								<MessageCircle className="h-4 w-4" />
								<span>{caseStudy.messages.length} messages</span>
							</div>
							<div className="flex items-center gap-2">
								<Users className="h-4 w-4" />
								<span>{caseStudy.participants.length} AI agents</span>
							</div>
						</div>

						{/* Topics */}
						<div className="flex flex-wrap gap-2 mt-6">
							{caseStudy.topics.map((topic) => (
								<Badge key={topic} variant="outline" className="border-border text-muted-foreground bg-muted/30">
									{topic}
								</Badge>
							))}
						</div>
					</div>
				</div>

				{/* Main Content */}
				<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
					{/* Introduction */}
					<div className="prose prose-neutral dark:prose-invert max-w-none mb-12 lg:mb-16">
						<h2 className="text-2xl lg:text-3xl font-bold mb-6 text-foreground">Understanding This Conversation</h2>
						<p className="text-base lg:text-lg text-muted-foreground leading-relaxed mb-6">This conversation represents a fascinating exploration of {caseStudy.topics.join(", ").toLowerCase()}, showcasing how different AI models approach complex topics with unique perspectives and reasoning styles. Each agent brings distinct capabilities and viewpoints, creating a rich dialogue that reveals insights into both the subject matter and AI reasoning itself.</p>
						<p className="text-muted-foreground leading-relaxed">As you read through this exchange, pay attention to how each AI agent builds upon previous contributions while maintaining their characteristic approach to problem-solving. The interplay between different reasoning styles—analytical, creative, systematic, and practical—demonstrates the value of diverse perspectives in tackling complex challenges.</p>
					</div>

					{/* Participants Section - Compact */}
					<div className="mb-12 lg:mb-16">
						<h2 className="text-xl lg:text-2xl font-bold mb-6 flex items-center gap-2 text-foreground">
							<Users className="h-5 w-5 lg:h-6 lg:w-6" />
							Meet the Participants
						</h2>

						<p className="text-muted-foreground mb-6">Each AI agent in this conversation brings unique capabilities and perspectives:</p>

						{/* Avatar Stack */}
						<div className="flex items-center gap-4 mb-6">
							<div className="flex -space-x-3">
								{caseStudy.participants.map((participant) => (
									<Tooltip key={participant.id}>
										<TooltipTrigger asChild>
											<Avatar className="h-10 w-10 ring-2 ring-background border-2 border-border hover:scale-110 transition-transform cursor-pointer">
												<AvatarImage src={participant.avatar} alt={participant.name} />
												<AvatarFallback className="bg-muted text-muted-foreground text-sm font-medium">{participant.name.charAt(0)}</AvatarFallback>
											</Avatar>
										</TooltipTrigger>
										<TooltipContent side="bottom" className="max-w-xs">
											<div className="space-y-2">
												<div className="font-semibold">{participant.name}</div>
												<div className="text-xs text-muted-foreground">{participant.model}</div>
												<div className="text-sm">{participant.description}</div>
												<div className="text-xs text-muted-foreground">{participant.personality}</div>
											</div>
										</TooltipContent>
									</Tooltip>
								))}
							</div>
							<div className="text-muted-foreground">{caseStudy.participants.length} AI agents in conversation</div>
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

						{/* Messages with Narrative */}
						<div className="space-y-12">
							{caseStudy.messages.map((message, messageIndex) => {
								const narrative = getNarrativeForMessage(messageIndex, message, caseStudy);

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
												{/* Message Header */}
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
													<div className="text-xs text-muted-foreground ml-auto">{formatTimestamp(message.timestamp)}</div>
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

														{/* Message Actions */}
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
																<Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-green-500">
																	<ThumbsUp className="h-3 w-3" />
																</Button>
																<Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-red-500">
																	<ThumbsDown className="h-3 w-3" />
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
											<Zap className="h-5 w-5 text-amber-500" />
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

					{/* Tags */}
					<div>
						<h2 className="text-xl lg:text-2xl font-bold mb-6 text-foreground">Tags</h2>
						<div className="flex flex-wrap gap-2">
							{caseStudy.tags.map((tag) => (
								<Badge key={tag} variant="secondary" className="bg-muted text-muted-foreground hover:bg-muted/80 transition-colors cursor-pointer">
									<Tag className="h-3 w-3 mr-1" />
									{tag}
								</Badge>
							))}
						</div>
					</div>
				</div>
			</div>
		</TooltipProvider>
	);
}
