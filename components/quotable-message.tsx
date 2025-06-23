"use client";

import { useState } from "react";
import { ChatMessage, ChatParticipant } from "@/lib/chat-data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Copy, Quote, Share2, ExternalLink, Heart, MessageCircle } from "lucide-react";

interface QuotableMessageProps {
	message: ChatMessage;
	participant: ChatParticipant;
	showActions?: boolean;
	compact?: boolean;
	highlighted?: boolean;
	onQuote?: (messageId: string) => void;
	onShare?: (messageId: string) => void;
}

export function QuotableMessage({ message, participant, showActions = true, compact = false, highlighted = false, onQuote, onShare }: QuotableMessageProps) {
	const [isLiked, setIsLiked] = useState(false);
	const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 50) + 5);

	const copyMessage = () => {
		navigator.clipboard.writeText(message.content);
	};

	const handleQuote = () => {
		if (onQuote) {
			onQuote(message.id);
		}
	};

	const handleShare = () => {
		if (onShare) {
			onShare(message.id);
		}
	};

	const handleLike = () => {
		setIsLiked(!isLiked);
		setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
	};

	const formatTime = (date: Date) => {
		return date.toLocaleTimeString("en-US", {
			hour: "2-digit",
			minute: "2-digit",
			hour12: false,
		});
	};

	return (
		<div className={`group ${highlighted ? "ring-2 ring-primary/20 rounded-lg p-2 bg-primary/5" : ""}`}>
			<div className={`flex gap-${compact ? "3" : "4"}`}>
				<Avatar className={`${compact ? "h-8 w-8" : "h-10 w-10"} flex-shrink-0 ring-2 ring-border/50`}>
					<AvatarImage src={participant.avatar} alt={participant.name} />
					<AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">{participant.name.charAt(0)}</AvatarFallback>
				</Avatar>

				<div className="flex-1 space-y-2">
					{/* Message Header */}
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<span className={`font-medium ${compact ? "text-sm" : ""}`}>{participant.name}</span>
							<Badge variant="outline" className="text-xs">
								{participant.model}
							</Badge>
							<span className="text-xs text-muted-foreground">{formatTime(message.timestamp)}</span>
							{message.confidence && (
								<Badge variant="secondary" className="text-xs">
									{Math.round(message.confidence * 100)}% confidence
								</Badge>
							)}
						</div>

						{showActions && (
							<div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
								<Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={copyMessage}>
									<Copy className="h-3 w-3" />
								</Button>
								<Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={handleQuote}>
									<Quote className="h-3 w-3" />
								</Button>
								<Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={handleShare}>
									<Share2 className="h-3 w-3" />
								</Button>
								<Button variant="ghost" size="sm" className="h-7 w-7 p-0">
									<ExternalLink className="h-3 w-3" />
								</Button>
							</div>
						)}
					</div>

					{/* Message Content */}
					<Card className="bg-background/50 border-border/50">
						<CardContent className={`${compact ? "p-3" : "p-4"}`}>
							<p className={`${compact ? "text-sm" : "text-sm"} leading-relaxed whitespace-pre-wrap`}>{message.content}</p>

							{/* Key Insights (if any) */}
							{message.keyInsights && message.keyInsights.length > 0 && (
								<div className="mt-3 space-y-1">
									<div className="text-xs font-medium text-muted-foreground">Key Insights:</div>
									<div className="flex flex-wrap gap-1">
										{message.keyInsights.slice(0, 3).map((insight, index) => (
											<Badge key={index} variant="secondary" className="text-xs">
												{insight}
											</Badge>
										))}
									</div>
								</div>
							)}
						</CardContent>
					</Card>

					{/* Engagement Actions */}
					{showActions && (
						<div className="flex items-center gap-4 text-xs text-muted-foreground">
							<Button variant="ghost" size="sm" className={`h-6 px-2 gap-1 ${isLiked ? "text-red-500" : ""}`} onClick={handleLike}>
								<Heart className={`h-3 w-3 ${isLiked ? "fill-current" : ""}`} />
								<span>{likeCount}</span>
							</Button>
							<Button variant="ghost" size="sm" className="h-6 px-2 gap-1">
								<MessageCircle className="h-3 w-3" />
								<span>{Math.floor(Math.random() * 20) + 1}</span>
							</Button>
							<Button variant="ghost" size="sm" className="h-6 px-2 gap-1" onClick={handleQuote}>
								<Quote className="h-3 w-3" />
								<span>Quote</span>
							</Button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
