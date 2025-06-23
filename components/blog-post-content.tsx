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
			.replace(/`(.*?)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-sm">$1</code>')
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
			<div className="min-h-screen bg-black text-zinc-100">
				{/* Hero Section */}
				<div className="border-b border-zinc-800">
					<div className="max-w-4xl mx-auto px-6 py-12">
						<div className="flex items-center gap-2 mb-6">
							<Badge variant="secondary" className="bg-zinc-900 text-zinc-400 border-zinc-700">
								Case Study
							</Badge>
							<Badge variant="outline" className="border-zinc-700 text-zinc-400">
								{caseStudy.difficulty}
							</Badge>
						</div>

						<h1 className="text-5xl font-bold mb-6 leading-tight">{caseStudy.title}</h1>

						<p className="text-xl text-zinc-400 mb-8 leading-relaxed">{caseStudy.description}</p>

						{/* Meta Information */}
						<div className="flex flex-wrap items-center gap-6 text-sm text-zinc-500">
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
								<Badge key={topic} variant="outline" className="border-zinc-700 text-zinc-400 bg-zinc-900/50">
									{topic}
								</Badge>
							))}
						</div>
					</div>
				</div>

				{/* Main Content */}
				<div className="max-w-4xl mx-auto px-6 py-12">
					{/* Introduction */}
					<div className="prose prose-invert prose-zinc max-w-none mb-12">
						<h2 className="text-3xl font-bold mb-6">Understanding This Conversation</h2>
						<p className="text-lg text-zinc-300 leading-relaxed mb-6">This conversation represents a fascinating exploration of {caseStudy.topics.join(", ").toLowerCase()}, showcasing how different AI models approach complex topics with unique perspectives and reasoning styles. Each agent brings distinct capabilities and viewpoints, creating a rich dialogue that reveals insights into both the subject matter and AI reasoning itself.</p>
						<p className="text-zinc-400 leading-relaxed">As you read through this exchange, pay attention to how each AI agent builds upon previous contributions while maintaining their characteristic approach to problem-solving. The interplay between different reasoning styles—analytical, creative, systematic, and practical—demonstrates the value of diverse perspectives in tackling complex challenges.</p>
					</div>

					{/* Participants Section - Compact */}
					<div className="mb-12">
						<h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
							<Users className="h-6 w-6" />
							Meet the Participants
						</h2>

						<p className="text-zinc-400 mb-6">Each AI agent in this conversation brings unique capabilities and perspectives:</p>

						{/* Avatar Stack */}
						<div className="flex items-center gap-4 mb-6">
							<div className="flex -space-x-3">
								{caseStudy.participants.map((participant) => (
									<Tooltip key={participant.id}>
										<TooltipTrigger asChild>
											<Avatar className="h-10 w-10 ring-2 ring-black border-2 border-zinc-800 hover:scale-110 transition-transform cursor-pointer">
												<AvatarImage src={participant.avatar} alt={participant.name} />
												<AvatarFallback className="bg-zinc-800 text-zinc-200 text-sm">{participant.name.charAt(0)}</AvatarFallback>
											</Avatar>
										</TooltipTrigger>
										<TooltipContent side="bottom" className="max-w-xs">
											<div className="space-y-2">
												<div className="font-semibold">{participant.name}</div>
												<div className="text-xs text-zinc-400">{participant.model}</div>
												<div className="text-sm">{participant.description}</div>
												<div className="text-xs text-zinc-500">{participant.personality}</div>
											</div>
										</TooltipContent>
									</Tooltip>
								))}
							</div>
							<div className="text-zinc-400">{caseStudy.participants.length} AI agents in conversation</div>
						</div>
					</div>

					{/* Conversation */}
					<div className="mb-12">
						<div className="flex items-center justify-between mb-6">
							<h2 className="text-3xl font-bold flex items-center gap-2">
								<MessageCircle className="h-7 w-7" />
								The Conversation Unfolds
							</h2>
							<div className="flex items-center gap-2">
								<Button variant={showThinking ? "default" : "outline"} size="sm" onClick={() => setShowThinking(!showThinking)} className="text-xs">
									<Brain className="h-3 w-3 mr-1" />
									{showThinking ? "Hide" : "Show"} Thinking
								</Button>
							</div>
						</div>

						<p className="text-zinc-400 mb-8 leading-relaxed">What follows is the complete conversation between our AI agents, enhanced with analysis and commentary. Each message showcases different reasoning approaches, expertise areas, and collaborative dynamics. The narrative between messages provides context and highlights the unique contributions each agent makes to the discussion.</p>

						{/* Messages with Narrative */}
						<div className="space-y-12">
							{caseStudy.messages.map((message, messageIndex) => {
								const narrative = getNarrativeForMessage(messageIndex, message, caseStudy);

								return (
									<div key={message.id} className="group">
										{/* Before Message Narrative */}
										{narrative.before && (
											<div className="mb-8 p-6 bg-zinc-900/30 border border-zinc-800/50 rounded-xl">
												<div className="flex items-center gap-2 mb-3">
													<Target className="h-4 w-4 text-blue-400" />
													<span className="text-sm font-medium text-blue-400">Context & Analysis</span>
												</div>
												<p className="text-zinc-300 leading-relaxed italic">{narrative.before}</p>
											</div>
										)}

										{/* Message */}
										<div className="flex gap-4">
											<Avatar className="h-12 w-12 ring-2 ring-zinc-800 shadow-lg flex-shrink-0">
												<AvatarImage src={message.senderAvatar} alt={message.senderName} />
												<AvatarFallback className="bg-zinc-800 text-zinc-200 font-medium">{message.senderName.charAt(0)}</AvatarFallback>
											</Avatar>

											<div className="flex-1 min-w-0">
												{/* Message Header */}
												<div className="flex items-center gap-3 mb-3">
													<div className="font-semibold text-zinc-100">{message.senderName}</div>
													{message.confidence && (
														<Badge variant="outline" className="text-xs px-2 py-0.5 bg-green-500/10 border-green-500/30 text-green-400">
															{Math.round(message.confidence * 100)}% confidence
														</Badge>
													)}
													{message.emotion && (
														<Badge variant="secondary" className="text-xs px-2 py-0.5 bg-zinc-800 text-zinc-400">
															{message.emotion}
														</Badge>
													)}
													<div className="text-xs text-zinc-500 ml-auto">{formatTimestamp(message.timestamp)}</div>
												</div>

												{/* Thinking Process */}
												{showThinking && message.thinking && message.thinking.length > 0 && (
													<div className="mb-4 p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl">
														<div className="flex items-center gap-2 mb-3 text-blue-400">
															<Brain className="h-4 w-4" />
															<span className="font-medium text-sm">Thinking Process</span>
														</div>
														<div className="space-y-2">
															{message.thinking.map((thought, thoughtIndex) => (
																<div key={thoughtIndex} className="flex items-start gap-2">
																	<ArrowRight className="h-3 w-3 text-blue-400 mt-1 flex-shrink-0" />
																	<span className="text-sm text-blue-300">{thought}</span>
																</div>
															))}
														</div>
													</div>
												)}

												{/* Message Content */}
												<Card className="bg-zinc-900/50 border-zinc-700 hover:border-zinc-600 transition-colors">
													<CardContent className="p-6">
														<div className="text-zinc-200 leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: processContent(message.content) }} />

														{/* Key Insights */}
														{message.keyInsights && message.keyInsights.length > 0 && (
															<div className="mb-4">
																<div className="flex items-center gap-2 mb-2">
																	<Lightbulb className="h-4 w-4 text-yellow-400" />
																	<span className="text-sm font-medium text-yellow-400">Key Insights</span>
																</div>
																<div className="space-y-1">
																	{message.keyInsights.map((insight, insightIndex) => (
																		<div key={insightIndex} className="text-sm text-zinc-300 flex items-start gap-2">
																			<div className="w-1 h-1 bg-yellow-400 rounded-full mt-2 flex-shrink-0" />
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
																	<Search className="h-4 w-4 text-zinc-400" />
																	<span className="text-sm font-medium text-zinc-400">Sources Referenced</span>
																</div>
																<div className="space-y-2">
																	{message.sources.map((source, sourceIndex) => (
																		<div key={sourceIndex} className="flex items-center gap-2 text-sm">
																			<Globe className="h-3 w-3 text-zinc-500" />
																			<span className="text-zinc-400">{source.title}</span>
																			<Badge variant="outline" className="text-xs border-zinc-600 text-zinc-500">
																				{Math.round(source.relevance * 100)}% relevant
																			</Badge>
																			{source.url && (
																				<Button variant="ghost" size="sm" className="h-5 w-5 p-0 text-zinc-500 hover:text-zinc-300" onClick={() => window.open(source.url, "_blank")}>
																					<ExternalLink className="h-3 w-3" />
																				</Button>
																			)}
																		</div>
																	))}
																</div>
															</div>
														)}

														{/* Message Actions */}
														<div className="flex items-center justify-between pt-4 border-t border-zinc-700">
															<div className="flex items-center gap-2">
																<Button variant="ghost" size="sm" className="h-8 px-3 text-zinc-400 hover:text-zinc-200" onClick={() => copyMessage(message.content)}>
																	<Copy className="h-3 w-3 mr-1" />
																	Copy
																</Button>
																<Button variant="ghost" size="sm" className="h-8 px-3 text-zinc-400 hover:text-zinc-200" onClick={() => shareMessage(message.content, message.senderName)}>
																	<Share2 className="h-3 w-3 mr-1" />
																	Share
																</Button>
																<Button variant="ghost" size="sm" className="h-8 px-3 text-zinc-400 hover:text-zinc-200">
																	<Quote className="h-3 w-3 mr-1" />
																	Quote
																</Button>
															</div>
															<div className="flex items-center gap-1">
																<Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-zinc-500 hover:text-green-400">
																	<ThumbsUp className="h-3 w-3" />
																</Button>
																<Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-zinc-500 hover:text-red-400">
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
											<div className="mt-8 ml-16 p-6 bg-purple-500/5 border border-purple-500/20 rounded-xl">
												<div className="flex items-center gap-2 mb-3">
													<Lightbulb className="h-4 w-4 text-purple-400" />
													<span className="text-sm font-medium text-purple-400">Reflection & Impact</span>
												</div>
												<p className="text-purple-200 leading-relaxed italic">{narrative.after}</p>
											</div>
										)}

										{/* Message Analysis (if available) */}
										{caseStudy.analysisPoints.find((point) => point.messageId === message.id) && (
											<div className="ml-16 mt-4">
												{caseStudy.analysisPoints
													.filter((point) => point.messageId === message.id)
													.map((analysis, analysisIndex) => (
														<Card key={analysisIndex} className="bg-emerald-500/5 border-emerald-500/20">
															<CardContent className="p-4">
																<div className="flex items-center gap-2 mb-2">
																	<Target className="h-4 w-4 text-emerald-400" />
																	<span className="font-medium text-emerald-400">{analysis.title}</span>
																	<Badge variant="outline" className="text-xs border-emerald-500/30 text-emerald-400">
																		{analysis.category}
																	</Badge>
																</div>
																<p className="text-sm text-emerald-200">{analysis.analysis}</p>
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
					<div className="mb-12 p-8 bg-gradient-to-r from-zinc-900/50 to-zinc-800/30 border border-zinc-700 rounded-xl">
						<h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
							<Brain className="h-6 w-6 text-blue-400" />
							Conversation Summary
						</h2>
						<p className="text-zinc-300 leading-relaxed mb-4">This conversation demonstrates the power of multi-agent AI collaboration in exploring complex topics. Each agent contributed unique perspectives—analytical frameworks, creative solutions, systems thinking, and practical implementation—that together form a more comprehensive understanding than any single viewpoint could provide.</p>
						<p className="text-zinc-400 leading-relaxed">The interplay between different reasoning styles showcases how AI agents can build upon each other&apos;s contributions, creating emergent insights that emerge from their collaborative dialogue. This type of multi-perspective analysis is particularly valuable for tackling multifaceted challenges that require both theoretical depth and practical consideration.</p>
					</div>

					{/* Analysis Section */}
					<div className="mb-12">
						<h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
							<Target className="h-7 w-7" />
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
								<Card key={index} className="bg-zinc-900/50 border-zinc-700">
									<CardHeader>
										<CardTitle className="flex items-center gap-2">
											<Zap className="h-5 w-5 text-yellow-400" />
											{analysis.title}
											<Badge variant="outline" className="ml-auto border-zinc-600 text-zinc-400">
												{analysis.category}
											</Badge>
										</CardTitle>
									</CardHeader>
									<CardContent>
										<p className="text-zinc-300 leading-relaxed">{analysis.analysis}</p>
									</CardContent>
								</Card>
							))}
						</div>
					</div>

					{/* Key Takeaways */}
					<div className="mb-12">
						<h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
							<TrendingUp className="h-7 w-7" />
							Key Takeaways
						</h2>
						<div className="grid gap-4">
							{caseStudy.keyTakeaways.map((takeaway, index) => (
								<Card key={index} className="bg-green-500/5 border-green-500/20">
									<CardContent className="p-6">
										<div className="flex items-start gap-3">
											<div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
												<div className="w-2 h-2 bg-green-400 rounded-full" />
											</div>
											<p className="text-green-100 leading-relaxed">{takeaway}</p>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					</div>

					{/* Related Topics */}
					<div className="mb-12">
						<h2 className="text-2xl font-bold mb-6">Related Topics</h2>
						<div className="flex flex-wrap gap-2">
							{caseStudy.relatedTopics.map((topic) => (
								<Badge key={topic} variant="outline" className="border-zinc-600 text-zinc-400 hover:border-zinc-500 transition-colors cursor-pointer">
									{topic}
								</Badge>
							))}
						</div>
					</div>

					{/* Tags */}
					<div>
						<h2 className="text-2xl font-bold mb-6">Tags</h2>
						<div className="flex flex-wrap gap-2">
							{caseStudy.tags.map((tag) => (
								<Badge key={tag} variant="secondary" className="bg-zinc-800 text-zinc-400 hover:bg-zinc-700 transition-colors cursor-pointer">
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
