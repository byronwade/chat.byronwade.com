"use client";

import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";

import { Clock, Send, MoreHorizontal, Eye, Copy, ThumbsUp, ThumbsDown, User, Star, Archive } from "lucide-react";
import { useChat } from "ai/react";

interface AIAgent {
	id: string;
	name: string;
	avatar: string;
	description: string;
	model: string;
	isOnline: boolean;
	lastMessage: string;
	timestamp: string;
	unreadCount: number;
	expertise: string[];
	personality: string;
}

interface AIAgentChatProps {
	agent: AIAgent;
}

export function AIAgentChat({ agent }: AIAgentChatProps) {
	const scrollAreaRef = useRef<HTMLDivElement>(null);
	const [isTyping, setIsTyping] = useState(false);
	const [typingDuration, setTypingDuration] = useState(0);
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [messageDelay, setMessageDelay] = useState(2000); // 2 second delay between messages
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [readSpeed, setReadSpeed] = useState(150); // words per minute for reading

	const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
		api: `/api/chat/${agent.id}`,
		initialMessages: [
			{
				id: "welcome",
				role: "assistant",
				content: `Hello! I'm ${agent.name}, your ${agent.description.toLowerCase()}. I'm here to help you with research, analysis, and sophisticated conversations. What would you like to explore today?`,
			},
		],
	});

	useEffect(() => {
		if (scrollAreaRef.current) {
			scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
		}
	}, [messages]);

	useEffect(() => {
		if (isLoading) {
			setIsTyping(true);
			// Calculate typing duration based on message length and reading speed
			const lastMessage = messages[messages.length - 1];
			if (lastMessage && lastMessage.role === "user") {
				const wordCount = lastMessage.content.split(" ").length;
				const estimatedResponseLength = Math.max(wordCount * 2, 50); // AI typically responds with 2x words
				const typingTime = (estimatedResponseLength / readSpeed) * 60 * 1000; // Convert to milliseconds
				setTypingDuration(Math.min(typingTime, 8000)); // Cap at 8 seconds
			}
		} else {
			setIsTyping(false);
		}
	}, [isLoading, messages, readSpeed]);

	const onSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (input.trim()) {
			handleSubmit(e);
		}
	};

	const copyMessage = (content: string) => {
		navigator.clipboard.writeText(content);
	};

	const getMessageTimestamp = () => {
		return new Date().toLocaleTimeString("en-US", {
			hour: "2-digit",
			minute: "2-digit",
			hour12: false,
		});
	};

	const getReadTime = (content: string) => {
		const wordCount = content.split(" ").length;
		const readTime = Math.ceil((wordCount / readSpeed) * 60);
		return readTime;
	};

	return (
		<div className="flex flex-col h-full bg-background/95 backdrop-blur-sm">
			{/* Chat Header */}
			<div className="p-6 border-b border-border/50 bg-background/80 backdrop-blur-sm">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-4">
						<Avatar className="h-12 w-12 ring-2 ring-background">
							<AvatarImage src={agent.avatar} alt={agent.name} />
							<AvatarFallback className="bg-primary/10 text-primary font-medium">{agent.name.charAt(0)}</AvatarFallback>
						</Avatar>
						<div>
							<h2 className="font-semibold flex items-center gap-2 text-foreground/90">
								{agent.name}
								{agent.isOnline && <div className="h-2 w-2 bg-green-500 rounded-full ring-1 ring-green-400" />}
							</h2>
							<p className="text-sm text-muted-foreground/70">{agent.description}</p>
						</div>
					</div>

					<div className="flex items-center gap-3">
						<div className="flex items-center gap-2 text-xs text-muted-foreground/60">
							<Clock className="h-3 w-3" />
							<span>{readSpeed} WPM</span>
						</div>
						<Badge variant="outline" className="text-xs border-border/50">
							{agent.model}
						</Badge>
						<Button variant="ghost" size="sm" className="h-8 w-8 p-0">
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</div>
				</div>
			</div>

			{/* Messages */}
			<ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
				<div className="space-y-3">
					{messages.map((message) => (
						<div key={message.id} className={`flex gap-4 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
							{message.role === "assistant" && (
								<Avatar className="h-8 w-8 flex-shrink-0 ring-1 ring-border/50">
									<AvatarImage src={agent.avatar} alt={agent.name} />
									<AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">{agent.name.charAt(0)}</AvatarFallback>
								</Avatar>
							)}

							<div className={`max-w-[75%] ${message.role === "user" ? "order-1" : "order-2"}`}>
								<Card className={`${message.role === "user" ? "bg-primary text-primary-foreground shadow-lg" : "bg-background/50 border-border/50 shadow-sm"}`}>
									<CardContent className="p-4">
										<div className="flex items-start justify-between gap-3">
											<div className="flex-1">
												<div className="flex items-center gap-2 mb-2">
													<span className="text-xs text-muted-foreground/60">{getMessageTimestamp()}</span>
													{message.role === "assistant" && (
														<div className="flex items-center gap-1 text-xs text-muted-foreground/60">
															<Eye className="h-3 w-3" />
															<span>{getReadTime(message.content)}s read</span>
														</div>
													)}
												</div>
												<p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
											</div>
											<div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
												<Button variant="ghost" size="sm" className="h-7 w-7 p-0 hover:bg-background/50" onClick={() => copyMessage(message.content)}>
													<Copy className="h-3 w-3" />
												</Button>
												{message.role === "assistant" && (
													<>
														<Button variant="ghost" size="sm" className="h-7 w-7 p-0 hover:bg-background/50">
															<ThumbsUp className="h-3 w-3" />
														</Button>
														<Button variant="ghost" size="sm" className="h-7 w-7 p-0 hover:bg-background/50">
															<ThumbsDown className="h-3 w-3" />
														</Button>
													</>
												)}
											</div>
										</div>
									</CardContent>
								</Card>
							</div>

							{message.role === "user" && (
								<Avatar className="h-8 w-8 flex-shrink-0 ring-1 ring-border/50">
									<AvatarFallback className="bg-secondary text-secondary-foreground text-xs font-medium">
										<User className="h-4 w-4" />
									</AvatarFallback>
								</Avatar>
							)}
						</div>
					))}

					{isTyping && (
						<div className="flex gap-4 justify-start">
							<Avatar className="h-8 w-8 flex-shrink-0 ring-1 ring-border/50">
								<AvatarImage src={agent.avatar} alt={agent.name} />
								<AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">{agent.name.charAt(0)}</AvatarFallback>
							</Avatar>
							<Card className="bg-background/50 border-border/50 shadow-sm">
								<CardContent className="p-4">
									<div className="flex items-center gap-3">
										<div className="flex space-x-1">
											<div className="h-2 w-2 bg-muted-foreground/60 rounded-full animate-bounce" />
											<div className="h-2 w-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
											<div className="h-2 w-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
										</div>
										<span className="text-sm text-muted-foreground/70">{agent.name} is typing...</span>
										<span className="text-xs text-muted-foreground/50">~{Math.ceil(typingDuration / 1000)}s</span>
									</div>
								</CardContent>
							</Card>
						</div>
					)}

					{error && (
						<div className="flex gap-4 justify-start">
							<Avatar className="h-8 w-8 flex-shrink-0 ring-1 ring-border/50">
								<AvatarFallback className="bg-destructive/10 text-destructive text-xs font-medium">!</AvatarFallback>
							</Avatar>
							<Card className="bg-destructive/10 border-destructive/20 shadow-sm">
								<CardContent className="p-4">
									<p className="text-sm text-destructive">Sorry, I encountered an error. Please try again.</p>
								</CardContent>
							</Card>
						</div>
					)}
				</div>
			</ScrollArea>

			{/* Input */}
			<div className="p-6 border-t border-border/50 bg-background/80 backdrop-blur-sm">
				<form onSubmit={onSubmit} className="flex gap-3">
					<Input value={input} onChange={handleInputChange} placeholder={`Message ${agent.name}...`} className="flex-1 h-12 bg-background/50 border-border/50 focus:border-primary/50" disabled={isLoading || isTyping} />
					<Button type="submit" disabled={isLoading || !input.trim() || isTyping} className="h-12 px-6">
						<Send className="h-4 w-4" />
					</Button>
				</form>

				<div className="flex items-center justify-between mt-3 text-xs text-muted-foreground/60">
					<div className="flex items-center gap-4">
						<span>Powered by {agent.model}</span>
						<span>•</span>
						<span>{messageDelay}ms delay</span>
					</div>
					<div className="flex items-center gap-4">
						<button className="flex items-center gap-1 hover:text-foreground/80 transition-colors">
							<Star className="h-3 w-3" />
							Save
						</button>
						<button className="flex items-center gap-1 hover:text-foreground/80 transition-colors">
							<Archive className="h-3 w-3" />
							Archive
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
