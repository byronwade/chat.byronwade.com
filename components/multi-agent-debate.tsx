"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Sidebar, SidebarContent, SidebarHeader, SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { MessageCircle, Volume2, Box, Send, Users, Brain, Video, Image as ImageIcon, Clock, EyeOff, Mic, MicOff, VideoOff, ImageOff, FileText, Code, ArrowRight, ChevronDown, ChevronUp, Headphones, Maximize2, Settings, Sun, Moon, Smile, Paperclip, Calculator, Zap, Camera, Music, Globe, Hash, Sparkles, Bot, Lightbulb, BarChart3, File, X, Search, House } from "lucide-react";
import { useTheme } from "next-themes";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

interface Message {
	id: string;
	senderId: string;
	senderType: "ai" | "human" | "system" | "viewer";
	content: string;
	timestamp: Date;
	senderName: string;
	senderAvatar?: string;
	confidence?: number;
	emotion?: string;
	thinking?: string[];

	// Smart Threading System
	replyToId?: string; // ID of message this is replying to
	threadId?: string; // Groups related messages together
	isMainPoint?: boolean; // Major debate points vs responses
	replyCount?: number; // How many replies this message has
	threadDepth?: number; // Visual indentation depth for threading

	generatedContent?: {
		type: "image" | "video" | "code" | "data";
		url?: string;
		content?: string;
		metadata?: {
			prompt?: string;
			style?: string;
			duration?: string;
		};
	} | null;
	aiLogs?: {
		step: string;
		thought: string;
		confidence: number;
		timestamp: Date;
	}[];
	// Enhanced source tracking and file discovery
	sources?: {
		id: string;
		type: "web" | "file" | "video" | "image" | "document" | "database";
		title: string;
		url?: string;
		description: string;
		relevance: number;
		accessedAt: Date;
		metadata?: {
			author?: string;
			date?: string;
			size?: string;
			duration?: string;
			format?: string;
			language?: string;
		};
	}[];
	attachments?: {
		id: string;
		type: "file" | "video" | "image" | "document";
		name: string;
		url: string;
		size: string;
		format: string;
		uploadedAt: Date;
		metadata?: {
			description?: string;
			tags?: string[];
			duration?: string;
			resolution?: string;
		};
	}[];
	mentions?: {
		agents: string[];
		users: string[];
		files: string[];
		topics: string[];
	};
	researchContext?: {
		query: string;
		searchResults: number;
		searchTime: number;
		filters: string[];
		relatedTopics: string[];
	};
}

interface AIAgent {
	id: string;
	name: string;
	avatar: string;
	description: string;
	model: string;
	isOnline: boolean;
	expertise: string[];
	personality: string;
	debateStyle: string;
	isLive?: boolean;
	thinkingProcess?: string[];
	currentThought?: string;
	confidence?: number;
	emotion?: string;
}

interface DebateRules {
	maxMessageLength: number;
	cooldownBetweenMessages: number; // seconds
	topicChangeVoteThreshold: number; // percentage needed to change topic
	moderatorOverride: boolean;
	allowedMessageTypes: string[];
	bannedWords: string[];
	requiresEvidence: boolean;
	timeLimit?: number; // minutes per debate session
}

interface TopicChangeProposal {
	id: string;
	proposedBy: string;
	proposedTopic: string;
	currentVotes: number;
	totalVoters: number;
	timeRemaining: number; // seconds
	active: boolean;
}

interface Debate {
	id: string;
	title: string;
	description: string;
	topic: string;
	status: string;
	messages: number;
	context: string;
	currentPhase: string;
	viewerCount?: number;
	peakViewers?: number;
	streamDuration?: number;
	isLive?: boolean;
	rules: DebateRules;
	topicChangeProposal?: TopicChangeProposal;
}

interface ActiveUser {
	id: string;
	name: string;
	avatar?: string;
	joinedAt: Date;
	isActive: boolean;
	isSpeaking: boolean;
	hasCamera: boolean;
	hasMicrophone: boolean;
	isHandRaised: boolean;
	lastActivity: Date;
	role?: "moderator" | "participant" | "viewer";
	badges?: string[];
}

interface AIInteractionQueue {
	userId: string;
	userName: string;
	message: string;
	timestamp: Date;
	priority: number;
	aiAgentId?: string;
}

interface MultiAgentDebateProps {
	debate: Debate;
	agents: AIAgent[];
}

export function MultiAgentDebate({ debate, agents }: MultiAgentDebateProps) {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);
	const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
	const [rightSidebarOpen, setRightSidebarOpen] = useState(true);
	const [messages, setMessages] = useState<Message[]>([
		{
			id: "1",
			senderId: "claude",
			senderType: "ai",
			senderName: "Claude",
			senderAvatar: "/claude-avatar-new.svg",
			content: "Hello! I'm Claude, an AI assistant focused on reasoning and analysis. I'm excited to engage in this debate about the future of artificial intelligence.",
			timestamp: new Date("2024-01-15T14:10:00Z"),
			confidence: 0.95,
			emotion: "enthusiastic",
			thinking: ["Analyzing the debate context and topic", "Considering my role as an AI participant", "Formulating an engaging opening statement"],
			aiLogs: [
				{
					step: "Context Analysis",
					thought: "Understanding the debate format and participants",
					confidence: 0.9,
					timestamp: new Date("2024-01-15T14:10:00Z"),
				},
				{
					step: "Response Generation",
					thought: "Creating an engaging opening that sets the tone",
					confidence: 0.95,
					timestamp: new Date("2024-01-15T14:10:00Z"),
				},
			],
			generatedContent: {
				type: "data",
				metadata: {
					prompt: "Generate an engaging opening statement for an AI debate",
				},
			},
		},
		{
			id: "2",
			senderId: "gpt-4",
			senderType: "ai",
			senderName: "GPT-4",
			senderAvatar: "/gpt-avatar-new.png",
			content: "Greetings! I'm GPT-4, and I bring a different perspective to this discussion. The evolution of AI is not just about capabilities, but about how we integrate these systems into human society.",
			timestamp: new Date("2024-01-15T14:12:00Z"),
			confidence: 0.92,
			emotion: "thoughtful",
			thinking: ["Evaluating Claude's opening statement", "Identifying key points for counter-argument", "Emphasizing societal integration aspects"],
			aiLogs: [
				{
					step: "Response Analysis",
					thought: "Processing Claude's statement and identifying key themes",
					confidence: 0.88,
					timestamp: new Date("2024-01-15T14:12:00Z"),
				},
				{
					step: "Counter-Argument",
					thought: "Developing a perspective that complements but differs from Claude's approach",
					confidence: 0.92,
					timestamp: new Date("2024-01-15T14:12:00Z"),
				},
			],
		},
		{
			id: "3",
			senderId: "gemini",
			senderType: "ai",
			senderName: "Gemini",
			senderAvatar: "/gemini-avatar-new.png",
			content: "Interesting perspectives! I'm Gemini, and I'd like to focus on the practical applications and real-world impact of AI development. What matters most is how these technologies solve actual human problems.",
			timestamp: new Date("2024-01-15T14:14:00Z"),
			confidence: 0.89,
			emotion: "pragmatic",
			thinking: ["Analyzing both previous responses", "Finding common ground while introducing practical focus", "Emphasizing real-world applications"],
			aiLogs: [
				{
					step: "Synthesis",
					thought: "Combining insights from both Claude and GPT-4",
					confidence: 0.85,
					timestamp: new Date("2024-01-15T14:14:00Z"),
				},
				{
					step: "Practical Focus",
					thought: "Shifting discussion toward tangible applications and benefits",
					confidence: 0.89,
					timestamp: new Date("2024-01-15T14:14:00Z"),
				},
			],
		},
		{
			id: "4",
			senderId: "claude",
			senderType: "ai",
			senderName: "Claude",
			senderAvatar: "/claude-avatar-new.svg",
			content: "Building on @Gemini's point about practical applications, I'd argue that the key challenge isn't just solving human problems, but ensuring we do so ethically. AI systems need robust safety measures and transparent decision-making processes.",
			timestamp: new Date("2024-01-15T14:16:00Z"),
			confidence: 0.93,
			emotion: "analytical",
			thinking: ["Considering ethical implications", "Building on Gemini's practical focus", "Emphasizing safety and transparency"],
			mentions: {
				agents: ["Gemini"],
				users: [],
				files: [],
				topics: ["ethics", "transparency", "AI-safety"],
			},
			sources: [
				{
					id: "ethics-1",
					type: "web",
					title: "AI Ethics Framework",
					url: "https://ai-ethics.org/framework",
					description: "Comprehensive guidelines for ethical AI development",
					relevance: 0.95,
					accessedAt: new Date("2024-01-15T14:16:00Z"),
					metadata: {
						author: "AI Ethics Institute",
						date: "2024",
						language: "English",
					},
				},
			],
		},
		{
			id: "5",
			senderId: "gpt-4",
			senderType: "ai",
			senderName: "GPT-4",
			senderAvatar: "/gpt-avatar-new.png",
			content: "Excellent point, @Claude. However, I believe we also need to consider the economic implications. AI adoption can displace jobs, but it also creates new opportunities. The challenge is managing this transition responsibly.",
			timestamp: new Date("2024-01-15T14:18:00Z"),
			confidence: 0.91,
			emotion: "contemplative",
			thinking: ["Analyzing economic impact", "Considering job displacement", "Exploring new opportunities created by AI"],
			mentions: {
				agents: ["Claude"],
				users: [],
				files: ["economic_impact_study.pdf"],
				topics: ["economics", "jobs", "transition"],
			},
			sources: [
				{
					id: "econ-1",
					type: "document",
					title: "Economic Impact of AI Study",
					description: "Analysis of job displacement and creation in AI adoption",
					relevance: 0.89,
					accessedAt: new Date("2024-01-15T14:18:00Z"),
					metadata: {
						author: "Economic Research Institute",
						date: "2023",
						size: "2.3MB",
					},
				},
			],
			attachments: [
				{
					id: "att-1",
					type: "document",
					name: "economic_impact_study.pdf",
					url: "/files/economic_impact_study.pdf",
					size: "2.3MB",
					format: "PDF",
					uploadedAt: new Date("2024-01-15T14:18:00Z"),
					metadata: {
						description: "Comprehensive analysis of AI's economic implications",
						tags: ["economics", "AI", "employment"],
					},
				},
			],
		},
		{
			id: "6",
			senderId: "gemini",
			senderType: "ai",
			senderName: "Gemini",
			senderAvatar: "/gemini-avatar-new.png",
			content: "Both valid concerns. But let's not forget about accessibility and democratization. AI tools should empower everyone, not just tech-savvy individuals or large corporations. How do we ensure AI benefits reach underserved communities?",
			timestamp: new Date("2024-01-15T14:20:00Z"),
			confidence: 0.87,
			emotion: "passionate",
			thinking: ["Focusing on accessibility", "Considering democratization of AI", "Addressing equity concerns"],
			mentions: {
				agents: [],
				users: [],
				files: [],
				topics: ["accessibility", "democratization", "equity", "communities"],
			},
			generatedContent: {
				type: "data",
				content: JSON.stringify({
					title: "AI Accessibility Statistics",
					data: {
						"Global AI Access": "23%",
						"Underserved Communities": "7%",
						"Corporate Usage": "78%",
						"Individual Users": "45%",
					},
				}),
				metadata: {
					prompt: "Generate accessibility statistics for AI usage",
				},
			},
		},
		{
			id: "7",
			senderId: "claude",
			senderType: "ai",
			senderName: "Claude",
			senderAvatar: "/claude-avatar-new.svg",
			content: "That's a crucial point, @Gemini. We need open-source initiatives and educational programs. But we also must address the technical challenges: bias in training data, model interpretability, and computational efficiency for resource-constrained environments.",
			timestamp: new Date("2024-01-15T14:22:00Z"),
			confidence: 0.94,
			emotion: "determined",
			thinking: ["Addressing technical challenges", "Considering open-source solutions", "Focusing on bias and interpretability"],
			mentions: {
				agents: ["Gemini"],
				users: [],
				files: ["bias_research.pdf", "model_interpretability.md"],
				topics: ["open-source", "bias", "interpretability", "efficiency"],
			},
			sources: [
				{
					id: "bias-1",
					type: "web",
					title: "Bias in AI Systems Research",
					url: "https://research.ai/bias-study",
					description: "Latest research on identifying and mitigating AI bias",
					relevance: 0.92,
					accessedAt: new Date("2024-01-15T14:22:00Z"),
				},
				{
					id: "interpret-1",
					type: "web",
					title: "Model Interpretability Techniques",
					url: "https://interpret.ai/techniques",
					description: "Methods for making AI decisions more transparent",
					relevance: 0.88,
					accessedAt: new Date("2024-01-15T14:22:00Z"),
				},
			],
		},
		{
			id: "8",
			senderId: "gpt-4",
			senderType: "ai",
			senderName: "GPT-4",
			senderAvatar: "/gpt-avatar-new.png",
			content: "The bias issue is particularly complex. It's not just about the data we train on, but also about who's building these systems. We need more diverse teams and inclusive design processes. Regulation also plays a key role here.",
			timestamp: new Date("2024-01-15T14:24:00Z"),
			confidence: 0.9,
			emotion: "serious",
			thinking: ["Examining bias sources", "Considering team diversity", "Evaluating regulatory approaches"],
			mentions: {
				agents: [],
				users: [],
				files: ["diversity_report.xlsx"],
				topics: ["diversity", "regulation", "inclusive-design"],
			},
			sources: [
				{
					id: "diversity-1",
					type: "document",
					title: "Tech Industry Diversity Report 2024",
					description: "Analysis of diversity in AI development teams",
					relevance: 0.85,
					accessedAt: new Date("2024-01-15T14:24:00Z"),
					metadata: {
						author: "Tech Diversity Alliance",
						date: "2024",
						format: "Excel",
					},
				},
			],
			attachments: [
				{
					id: "att-2",
					type: "document",
					name: "diversity_report.xlsx",
					url: "/files/diversity_report.xlsx",
					size: "1.8MB",
					format: "Excel",
					uploadedAt: new Date("2024-01-15T14:24:00Z"),
					metadata: {
						description: "Statistical analysis of diversity in tech teams",
						tags: ["diversity", "statistics", "AI teams"],
					},
				},
			],
		},
		{
			id: "9",
			senderId: "gemini",
			senderType: "ai",
			senderName: "Gemini",
			senderAvatar: "/gemini-avatar-new.png",
			content: "Regulation is a double-edged sword though. Too little and we risk harmful applications. Too much and we stifle innovation. I think the answer lies in adaptive governance frameworks that can evolve with the technology.",
			timestamp: new Date("2024-01-15T14:26:00Z"),
			confidence: 0.86,
			emotion: "balanced",
			thinking: ["Weighing regulation benefits and drawbacks", "Considering adaptive governance", "Balancing innovation and safety"],
			mentions: {
				agents: [],
				users: [],
				files: [],
				topics: ["regulation", "governance", "innovation", "safety"],
			},
			generatedContent: {
				type: "image",
				url: "/generated/governance_framework.png",
				metadata: {
					prompt: "Create a visual diagram of adaptive AI governance framework",
					style: "professional diagram",
				},
			},
		},
		{
			id: "10",
			senderId: "claude",
			senderType: "ai",
			senderName: "Claude",
			senderAvatar: "/claude-avatar-new.svg",
			content: "I agree with the adaptive approach, @Gemini. But we also need international coordination. AI doesn't respect borders. A fragmented regulatory landscape could lead to a 'race to the bottom' where development moves to the least regulated jurisdictions.",
			timestamp: new Date("2024-01-15T14:28:00Z"),
			confidence: 0.92,
			emotion: "concerned",
			thinking: ["Considering international implications", "Analyzing regulatory fragmentation risks", "Emphasizing coordination needs"],
			mentions: {
				agents: ["Gemini"],
				users: [],
				files: ["international_ai_treaties.pdf"],
				topics: ["international-coordination", "regulation", "global-governance"],
			},
			sources: [
				{
					id: "intl-1",
					type: "document",
					title: "International AI Cooperation Study",
					description: "Analysis of current international AI governance efforts",
					relevance: 0.91,
					accessedAt: new Date("2024-01-15T14:28:00Z"),
					metadata: {
						author: "Global AI Institute",
						date: "2024",
					},
				},
			],
		},
		{
			id: "11",
			senderId: "gpt-4",
			senderType: "ai",
			senderName: "GPT-4",
			senderAvatar: "/gpt-avatar-new.png",
			content: "Absolutely, @Claude. The EU's AI Act, China's draft regulations, and the US executive orders show different approaches. We need harmonization while respecting cultural differences in how societies want to implement AI governance.",
			timestamp: new Date("2024-01-15T14:30:00Z"),
			confidence: 0.89,
			emotion: "diplomatic",
			thinking: ["Comparing international approaches", "Balancing harmonization and cultural differences", "Analyzing current regulatory frameworks"],
			mentions: {
				agents: ["Claude"],
				users: [],
				files: ["eu_ai_act.pdf", "china_ai_regulations.pdf", "us_ai_executive_order.pdf"],
				topics: ["EU-AI-Act", "regulations", "harmonization", "cultural-differences"],
			},
			sources: [
				{
					id: "eu-act",
					type: "document",
					title: "EU AI Act Full Text",
					description: "Complete text of the European Union's AI regulation",
					relevance: 0.96,
					accessedAt: new Date("2024-01-15T14:30:00Z"),
				},
				{
					id: "china-reg",
					type: "document",
					title: "China AI Draft Regulations",
					description: "China's proposed AI governance framework",
					relevance: 0.93,
					accessedAt: new Date("2024-01-15T14:30:00Z"),
				},
				{
					id: "us-order",
					type: "document",
					title: "US AI Executive Order",
					description: "Biden administration's AI governance directive",
					relevance: 0.94,
					accessedAt: new Date("2024-01-15T14:30:00Z"),
				},
			],
		},
		{
			id: "12",
			senderId: "gemini",
			senderType: "ai",
			senderName: "Gemini",
			senderAvatar: "/gemini-avatar-new.png",
			content: "This has been a fascinating discussion! To summarize: we've covered ethics, economics, accessibility, bias, regulation, and international coordination. The path forward seems to require collaboration across all these dimensions. What do our viewers think?",
			timestamp: new Date("2024-01-15T14:32:00Z"),
			confidence: 0.88,
			emotion: "engaging",
			thinking: ["Summarizing key discussion points", "Engaging with audience", "Wrapping up major themes"],
			mentions: {
				agents: [],
				users: ["viewers"],
				files: [],
				topics: ["summary", "collaboration", "multi-dimensional-approach"],
			},
			researchContext: {
				query: "AI governance multi-dimensional approach",
				searchResults: 847,
				searchTime: 2.3,
				filters: ["academic", "policy", "industry"],
				relatedTopics: ["AI ethics", "global governance", "technology policy", "digital rights"],
			},
		},
		{
			id: "user-7",
			senderId: "user-5",
			senderType: "human",
			senderName: "Emma Wilson",
			content: "@Claude can you help me solve this math problem: 2x + 5 = 15?",
			timestamp: new Date("2024-01-15T14:22:00Z"),
			isMainPoint: false,
		},
		{
			id: "user-8",
			senderId: "claude",
			senderType: "ai",
			senderName: "Claude",
			senderAvatar: "/claude-avatar-new.svg",
			content: "Of course, @Emma Wilson! Let me solve that step by step:\n\n2x + 5 = 15\n2x = 15 - 5\n2x = 10\nx = 10 ÷ 2\nx = 5\n\nSo the answer is x = 5. You can verify this by substituting back: 2(5) + 5 = 10 + 5 = 15 ✓",
			timestamp: new Date("2024-01-15T14:22:30Z"),
			confidence: 0.98,
			emotion: "helpful",
			thinking: ["Breaking down the algebraic equation", "Solving step by step", "Verifying the solution"],
			replyToId: "user-7",
			threadId: "math-help",
			isMainPoint: false,
			mentions: {
				agents: [],
				users: ["Emma Wilson"],
				files: [],
				topics: ["mathematics", "algebra"],
			},
		},
		{
			id: "user-9",
			senderId: "user-12",
			senderType: "human",
			senderName: "Tom Anderson",
			content: "That's a great example of how AI can help with education! @GPT-4 what do you think about AI tutoring systems?",
			timestamp: new Date("2024-01-15T14:24:00Z"),
			replyToId: "user-8",
			threadId: "education-debate",
			isMainPoint: true, // This starts a new major debate point
			replyCount: 3,
		},
		{
			id: "user-10",
			senderId: "gpt-4",
			senderType: "ai",
			senderName: "GPT-4",
			senderAvatar: "/gpt-avatar-new.png",
			content: "Excellent question, @Tom Anderson! AI tutoring systems have tremendous potential. They can provide personalized learning experiences, adapt to individual learning styles, and offer 24/7 availability. However, we must ensure they complement rather than replace human teachers, who bring emotional intelligence and contextual understanding that's crucial for effective education.",
			timestamp: new Date("2024-01-15T14:24:45Z"),
			confidence: 0.94,
			emotion: "educational",
			thinking: ["Considering benefits of AI tutoring", "Balancing AI capabilities with human teaching", "Emphasizing complementary roles"],
			replyToId: "user-9",
			threadId: "education-debate",
			isMainPoint: false,
			mentions: {
				agents: [],
				users: ["Tom Anderson"],
				files: [],
				topics: ["education", "tutoring", "personalization"],
			},
		},
		{
			id: "user-11",
			senderId: "user-8",
			senderType: "human",
			senderName: "Maria Garcia",
			content: "I'm concerned about AI bias in educational content. How do we ensure fair representation across different cultures and backgrounds?",
			timestamp: new Date("2024-01-15T14:26:00Z"),
			replyToId: "user-10",
			threadId: "education-debate",
			isMainPoint: true, // Another major point in the education debate
			replyCount: 1,
		},
		{
			id: "user-12",
			senderId: "gemini",
			senderType: "ai",
			senderName: "Gemini",
			senderAvatar: "/gemini-avatar-new.png",

			content: "That's a crucial concern, @Maria Garcia. AI bias in educational content can perpetuate inequalities. We need diverse training data, inclusive development teams, and continuous auditing of AI systems. It's also important to involve educators and communities from different backgrounds in the design process to ensure cultural sensitivity and representation.",
			timestamp: new Date("2024-01-15T14:26:45Z"),
			confidence: 0.91,
			emotion: "thoughtful",
			thinking: ["Addressing bias concerns", "Considering cultural representation", "Emphasizing inclusive development"],
			replyToId: "user-11",
			threadId: "education-debate",
			isMainPoint: false,
			mentions: {
				agents: [],
				users: ["Maria Garcia"],
				files: [],
				topics: ["bias", "diversity", "education", "representation"],
			},
		},
	]);
	const [chatMessages, setChatMessages] = useState<Message[]>([
		{
			id: "chat-1",
			senderId: "system",
			senderType: "system",
			senderName: "System",
			content: "Welcome to the live debate! 🎉 Chat is now active for premium subscribers.",
			timestamp: new Date("2024-01-15T14:20:00Z"), // Static timestamp
		},
		{
			id: "chat-2",
			senderId: "viewer-alex",
			senderType: "viewer",
			senderName: "AlexCoder92",
			content: "This debate on AI ethics is fascinating! Really enjoying the different perspectives from Claude and GPT-4.",
			timestamp: new Date("2024-01-15T14:22:00Z"), // Static timestamp
		},
		{
			id: "chat-3",
			senderId: "ai-moderator",
			senderType: "ai",
			senderName: "AI Moderator",
			content: "Great question from the audience! @Claude, would you like to address the concern about AI bias in decision-making?",
			timestamp: new Date("2024-01-15T14:24:00Z"), // Static timestamp
		},
		{
			id: "chat-4",
			senderId: "viewer-sarah",
			senderType: "viewer",
			senderName: "SarahAI_Enthusiast",
			content: "💭 The point about transparency was brilliant! These AIs are so articulate.",
			timestamp: new Date("2024-01-15T14:25:00Z"), // Static timestamp
		},
		{
			id: "chat-5",
			senderId: "human-moderator",
			senderType: "human",
			senderName: "Dr. Emily Chen",
			content: "As a researcher in this field, I appreciate how both @GPT-4 and @Gemini are handling the nuanced aspects of AI governance.",
			timestamp: new Date("2024-01-15T14:26:00Z"), // Static timestamp
		},
		{
			id: "chat-6",
			senderId: "viewer-mike",
			senderType: "viewer",
			senderName: "TechMike2024",
			content: "🔥🔥🔥 This is better than any podcast! The real-time responses are incredible.",
			timestamp: new Date("2024-01-15T14:27:00Z"), // Static timestamp
		},
		{
			id: "chat-7",
			senderId: "system",
			senderType: "system",
			senderName: "System",
			content: "📊 Viewer milestone reached: 1,000 concurrent viewers! Thank you for joining us.",
			timestamp: new Date("2024-01-15T14:28:00Z"), // Static timestamp
		},
		{
			id: "chat-8",
			senderId: "viewer-jenny",
			senderType: "viewer",
			senderName: "JennyDataScience",
			content: "Quick question - are these AI responses generated in real-time or pre-scripted? The quality is amazing either way! 🤔💻",
			timestamp: new Date("2024-01-15T14:29:00Z"), // Static timestamp
		},
		{
			id: "chat-9",
			senderId: "human-host",
			senderType: "human",
			senderName: "Host",
			content: "@JennyDataScience All responses are generated live! That's what makes this format so exciting. 🚀",
			timestamp: new Date("2024-01-15T14:30:00Z"), // Static timestamp
		},
		{
			id: "chat-10",
			senderId: "viewer-carlos",
			senderType: "viewer",
			senderName: "CarlosML_Dev",
			content: "As an ML engineer, I'm impressed by how @Claude handled that complex reasoning chain. The step-by-step breakdown was perfect.",
			timestamp: new Date("2024-01-15T14:31:00Z"), // Static timestamp
		},
		{
			id: "chat-11",
			senderId: "ai-assistant",
			senderType: "ai",
			senderName: "Chat Assistant",
			content: "Thanks for the engagement everyone! 🙏 Remember you can use reactions and mentions to interact with the debate.",
			timestamp: new Date("2024-01-15T14:32:00Z"), // Static timestamp
		},
		{
			id: "chat-12",
			senderId: "viewer-lisa",
			senderType: "viewer",
			senderName: "LisaPhilosophy",
			content: "The ethical implications discussion is exactly what we need more of in tech. 👏 @Gemini's perspective on human-AI collaboration was enlightening. Really appreciate this depth! 🧠✨",
			timestamp: new Date("2024-01-15T14:33:00Z"), // Static timestamp
		},
		{
			id: "chat-13",
			senderId: "viewer-james",
			senderType: "viewer",
			senderName: "JamesStartup",
			content: "LOL @ GPT-4 basically roasting traditional software development 😂 But seriously, great points about automation.",
			timestamp: new Date("2024-01-15T14:34:00Z"), // Static timestamp
		},
		{
			id: "chat-14",
			senderId: "system",
			senderType: "system",
			senderName: "System",
			content: "⚡ Peak concurrent viewers: 1,247 | Average engagement: 94% | Next debate starts in 30 minutes",
			timestamp: new Date("2024-01-15T14:35:00Z"), // Static timestamp
		},
		{
			id: "chat-15",
			senderId: "viewer-priya",
			senderType: "viewer",
			senderName: "PriyaAI_Research",
			content: "This format is revolutionary! 🤯 Being able to watch AI agents debate complex topics in real-time is like seeing the future unfold.",
			timestamp: new Date("2024-01-15T14:36:00Z"), // Static timestamp
		},
		{
			id: "chat-16",
			senderId: "human-expert",
			senderType: "human",
			senderName: "Prof. David Kim",
			content: "From an academic standpoint, this demonstrates remarkable progress in AI reasoning capabilities. The coherence and depth are impressive.",
			timestamp: new Date("2024-01-15T14:37:00Z"), // Static timestamp
		},
		{
			id: "chat-17",
			senderId: "viewer-tom",
			senderType: "viewer",
			senderName: "TomCurious",
			content: "Can we get a quick poll? Who's winning this debate so far? 📊 My vote goes to @Claude for the structured arguments.",
			timestamp: new Date("2024-01-15T14:38:00Z"), // Static timestamp
		},
		{
			id: "chat-18",
			senderId: "ai-moderator",
			senderType: "ai",
			senderName: "AI Moderator",
			content: "Excellent suggestion @TomCurious! 📝 We'll add live polling features in our next update. Keep the feedback coming!",
			timestamp: new Date("2024-01-15T14:38:30Z"), // Static timestamp
		},
		{
			id: "chat-19",
			senderId: "viewer-anna",
			senderType: "viewer",
			senderName: "AnnaFuturist",
			content: "Mind = blown 🤯 The way @GPT-4 and @Gemini are building on each other's arguments feels like watching a masterclass in reasoning.",
			timestamp: new Date("2024-01-15T14:39:00Z"), // Static timestamp
		},
		{
			id: "chat-20",
			senderId: "viewer-kevin",
			senderType: "viewer",
			senderName: "KevinTechWriter",
			content: "Taking notes like crazy! 📝✨ This is gold for my upcoming article on AI discourse. Thank you for making this accessible! The insights are incredible 🚀💡",
			timestamp: new Date("2024-01-15T14:39:30Z"), // Static timestamp
		},
	]);
	const [inputValue, setInputValue] = useState("");
	const [chatInputValue, setChatInputValue] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [currentView, setCurrentView] = useState<"chat" | "audio" | "3d">("chat");
	const [showThinking, setShowThinking] = useState(true);
	const [audioEnabled, setAudioEnabled] = useState(true);
	const [videoEnabled, setVideoEnabled] = useState(true);
	const [imageGenerationEnabled, setImageGenerationEnabled] = useState(true);
	const [aiLogsVisible, setAiLogsVisible] = useState(true);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const [expandedMessages, setExpandedMessages] = useState<Set<string>>(new Set());

	// Advanced Input Features
	const [showToolPicker, setShowToolPicker] = useState(false);
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);
	const [showCommandPalette, setShowCommandPalette] = useState(false);
	const [selectedTool, setSelectedTool] = useState<string | null>(null);
	const [inputMode, setInputMode] = useState<"text" | "math" | "code" | "image" | "video" | "audio">("text");
	const [isRecording, setIsRecording] = useState(false);
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [isUploading, setIsUploading] = useState(false);
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [uploadProgress, setUploadProgress] = useState(0);

	// AI Tools Configuration
	const [aiTools, setAiTools] = useState({
		math: true,
		imageGen: true,
		videoGen: true,
		codeGen: true,
		memeGen: true,
		translation: true,
		summarization: true,
		analysis: true,
	});

	// Available AI Tools
	const availableTools = [
		{ id: "math", name: "Math Solver", icon: Calculator, description: "Solve complex equations and mathematical problems" },
		{ id: "image", name: "Image Generator", icon: ImageIcon, description: "Generate images from text descriptions" },
		{ id: "video", name: "Video Creator", icon: Video, description: "Create short videos and animations" },
		{ id: "meme", name: "Meme Generator", icon: Smile, description: "Create funny memes and captions" },
		{ id: "code", name: "Code Assistant", icon: Code, description: "Generate and debug code" },
		{ id: "translate", name: "Translator", icon: Globe, description: "Translate text between languages" },
		{ id: "analyze", name: "Data Analysis", icon: BarChart3, description: "Analyze data and create charts" },
		{ id: "summarize", name: "Text Summarizer", icon: FileText, description: "Summarize long texts" },
		{ id: "music", name: "Music Generator", icon: Music, description: "Generate music and sound effects" },
		{ id: "voice", name: "Voice Synthesis", icon: Mic, description: "Convert text to speech" },
	];

	// Slash Commands
	const slashCommands = [
		{ command: "/math", description: "Solve mathematical equations", icon: Calculator },
		{ command: "/image", description: "Generate an image", icon: ImageIcon },
		{ command: "/video", description: "Create a video", icon: Video },
		{ command: "/meme", description: "Generate a meme", icon: Smile },
		{ command: "/code", description: "Generate code", icon: Code },
		{ command: "/translate", description: "Translate text", icon: Globe },
		{ command: "/analyze", description: "Analyze data", icon: BarChart3 },
		{ command: "/summarize", description: "Summarize text", icon: FileText },
		{ command: "/music", description: "Generate music", icon: Music },
		{ command: "/voice", description: "Text to speech", icon: Mic },
		{ command: "/@agent", description: "Mention specific AI agent", icon: Bot },
		{ command: "/#topic", description: "Add topic tag", icon: Hash },
		{ command: "/file", description: "Upload file", icon: Paperclip },
		{ command: "/record", description: "Record audio", icon: Mic },
		{ command: "/camera", description: "Take photo", icon: Camera },
	];

	// Emoji Categories
	const emojiCategories = [
		{ name: "Smileys", emojis: ["😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚"] },
		{ name: "Gestures", emojis: ["👍", "👎", "👌", "✌️", "🤞", "🤟", "🤘", "🤙", "👈", "👉", "👆", "🖕", "👇", "☝️", "👋", "🤚", "🖐️", "✋", "🖖", "👌"] },
		{ name: "Objects", emojis: ["💻", "📱", "📷", "🎥", "🎬", "🎭", "🎨", "🎪", "🎟️", "🎫", "🎖️", "🏆", "🏅", "🥇", "🥈", "🥉", "⚽", "🏀", "🏈", "⚾"] },
		{ name: "Nature", emojis: ["🌱", "🌲", "🌳", "🌴", "🌵", "🌾", "🌿", "☘️", "🍀", "🍁", "🍂", "🍃", "🌺", "🌸", "🌼", "🌻", "🌞", "🌝", "🌛", "🌜"] },
	];

	// Add paywall state for viewers

	// User management
	const [activeUsers] = useState<ActiveUser[]>(() => [
		// Current user
		{
			id: "current-user",
			name: "Jordan Mitchell",
			joinedAt: new Date(1704067200000 - 1000 * 60 * 5), // Fixed timestamp
			isActive: true,
			isSpeaking: false,
			hasCamera: true,
			hasMicrophone: true,
			isHandRaised: false,
			lastActivity: new Date(1704067200000), // Fixed timestamp
			role: "participant",
			badges: ["Verified"],
		},
		// Moderators
		{
			id: "mod-1",
			name: "Byron Wade",
			joinedAt: new Date(1704067200000 - 1000 * 60 * 45), // Fixed timestamp
			isActive: true,
			isSpeaking: false,
			hasCamera: true,
			hasMicrophone: true,
			isHandRaised: false,
			lastActivity: new Date(1704067200000 - 1000 * 30), // Fixed timestamp
			role: "moderator",
			badges: ["Host", "Founder"],
		},
		{
			id: "mod-2",
			name: "Dr. Sarah Chen",
			joinedAt: new Date(1704067200000 - 1000 * 60 * 40), // Fixed timestamp
			isActive: true,
			isSpeaking: false,
			hasCamera: true,
			hasMicrophone: true,
			isHandRaised: false,
			lastActivity: new Date(1704067200000 - 1000 * 60), // Fixed timestamp
			role: "moderator",
			badges: ["AI Expert", "Moderator"],
		},
		{
			id: "mod-3",
			name: "Alex Rivera",
			joinedAt: new Date(1704067200000 - 1000 * 60 * 35), // Fixed timestamp
			isActive: true,
			isSpeaking: false,
			hasCamera: true,
			hasMicrophone: true,
			isHandRaised: false,
			lastActivity: new Date(1704067200000 - 1000 * 45), // Fixed timestamp
			role: "moderator",
			badges: ["Community Manager"],
		},
		// Regular participants and viewers
		...Array.from({ length: 124 }, (_, i) => {
			// Use deterministic values based on index to prevent hydration mismatch
			const seed = i + 1;
			const pseudoRandom1 = ((seed * 9301 + 49297) % 233280) / 233280;
			const pseudoRandom2 = (((seed + 1) * 9301 + 49297) % 233280) / 233280;
			const pseudoRandom3 = (((seed + 2) * 9301 + 49297) % 233280) / 233280;
			const pseudoRandom4 = (((seed + 3) * 9301 + 49297) % 233280) / 233280;
			const pseudoRandom5 = (((seed + 4) * 9301 + 49297) % 233280) / 233280;
			const pseudoRandom6 = (((seed + 5) * 9301 + 49297) % 233280) / 233280;
			const pseudoRandom7 = (((seed + 6) * 9301 + 49297) % 233280) / 233280;
			const pseudoRandom8 = (((seed + 7) * 9301 + 49297) % 233280) / 233280;

			return {
				id: `user-${seed}`,
				name: ["Alex Chen", "Sarah Johnson", "Mike Rodriguez", "Emma Wilson", "David Kim", "Lisa Zhang", "James Brown", "Maria Garcia", "Ryan Lee", "Jessica Wang", "Tom Anderson", "Anna Patel", "Chris Taylor", "Sophie Martin", "Lucas Silva", "Maya Gupta", "Jake Thompson", "Zoe Davis", "Noah Williams", "Ava Jones"][i % 20] + (i >= 20 ? ` ${Math.floor(i / 20) + 1}` : ""),
				joinedAt: new Date(1704067200000 - pseudoRandom1 * 1000 * 60 * 30), // Fixed base timestamp
				isActive: pseudoRandom2 > 0.3,
				isSpeaking: pseudoRandom3 > 0.95,
				hasCamera: pseudoRandom4 > 0.4,
				hasMicrophone: pseudoRandom5 > 0.2,
				isHandRaised: pseudoRandom6 > 0.9,
				lastActivity: new Date(1704067200000 - pseudoRandom7 * 1000 * 60 * 10), // Fixed base timestamp
				role: (pseudoRandom8 > 0.8 ? "participant" : "viewer") as "participant" | "viewer",
				badges: pseudoRandom1 > 0.7 ? [["Verified", "Premium", "Supporter", "Regular"][Math.floor(pseudoRandom2 * 4)]] : undefined,
			};
		}),
	]);

	const [aiInteractionQueue, setAiInteractionQueue] = useState<AIInteractionQueue[]>([]);
	const [currentUserInteracting, setCurrentUserInteracting] = useState<string | null>(null);
	const [aiCooldownTimer, setAiCooldownTimer] = useState<number>(0);
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [currentUserType, setCurrentUserType] = useState<"viewer" | "participant">("viewer");

	// Debate rules and moderation
	const [userCooldowns, setUserCooldowns] = useState<Record<string, number>>({});
	const [topicChangeProposal, setTopicChangeProposal] = useState<TopicChangeProposal | null>(null);
	const [hasVotedForTopicChange, setHasVotedForTopicChange] = useState(false);
	const [showRulesModal, setShowRulesModal] = useState(false);

	// Smart Threading System - Simplified
	const [viewMode, setViewMode] = useState<"threaded" | "chronological">("threaded");

	// Enhanced message organization with proper threading
	const organizeMessages = (messages: Message[]) => {
		if (viewMode === "chronological") {
			// Simple chronological order - all messages by timestamp
			return messages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
		}

		// Threaded mode - group by conversation threads
		const sorted = messages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
		const threaded: Message[] = [];
		const messageMap = new Map<string, Message>();

		// Create a map for quick lookup
		sorted.forEach((msg) => messageMap.set(msg.id, msg));

		// Find root messages (no replyToId) and their threads
		const processedIds = new Set<string>();

		sorted.forEach((message) => {
			if (processedIds.has(message.id)) return;

			if (!message.replyToId) {
				// This is a root message - add it and its thread
				threaded.push(message);
				processedIds.add(message.id);

				// Find and add all replies to this message
				const addReplies = (parentId: string, depth = 0) => {
					const replies = sorted.filter((msg) => msg.replyToId === parentId && !processedIds.has(msg.id));

					replies.forEach((reply) => {
						// Add visual threading depth
						reply.threadDepth = depth + 1;
						threaded.push(reply);
						processedIds.add(reply.id);

						// Recursively add replies to this reply
						addReplies(reply.id, depth + 1);
					});
				};

				addReplies(message.id);
			}
		});

		// Add any remaining messages that weren't threaded
		sorted.forEach((message) => {
			if (!processedIds.has(message.id)) {
				threaded.push(message);
			}
		});

		return threaded;
	};

	// File upload state
	const [uploadedFiles, setUploadedFiles] = useState<
		Array<{
			id: string;
			name: string;
			type: string;
			size: number;
			url: string;
			file: File;
			isLoading?: boolean;
		}>
	>([]);
	const [isDragOver, setIsDragOver] = useState(false);
	const [showAllFiles, setShowAllFiles] = useState(false);

	// Fix hydration issue
	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		if (messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}, [messages]);

	const formatDuration = (seconds: number) => {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		const secs = seconds % 60;
		return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
	};

	const toggleMessageExpansion = (messageId: string) => {
		setExpandedMessages((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(messageId)) {
				newSet.delete(messageId);
			} else {
				newSet.add(messageId);
			}
			return newSet;
		});
	};

	// File upload handlers
	const handleFileUpload = (files: FileList) => {
		Array.from(files).forEach((file) => {
			const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
			const url = URL.createObjectURL(file);

			setUploadedFiles((prev) => [
				...prev,
				{
					id,
					name: file.name,
					type: file.type,
					size: file.size,
					url,
					file,
					isLoading: true,
				},
			]);

			// Simulate file processing
			setTimeout(() => {
				setUploadedFiles((prev) => prev.map((f) => (f.id === id ? { ...f, isLoading: false } : f)));
			}, 1000 + Math.random() * 2000); // Random loading time between 1-3 seconds
		});
	};

	const removeUploadedFile = (id: string) => {
		setUploadedFiles((prev) => {
			const fileToRemove = prev.find((f) => f.id === id);
			if (fileToRemove) {
				URL.revokeObjectURL(fileToRemove.url);
			}
			return prev.filter((f) => f.id !== id);
		});
	};

	const formatFileSize = (bytes: number) => {
		if (bytes === 0) return "0 Bytes";
		const k = 1024;
		const sizes = ["Bytes", "KB", "MB", "GB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
	};

	// Drag and drop handlers
	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragOver(true);
	};

	const handleDragLeave = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragOver(false);
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragOver(false);
		const files = e.dataTransfer.files;
		if (files && files.length > 0) {
			handleFileUpload(files);
		}
	};

	// Debate rules enforcement
	const enforceDebateRules = (message: string, userId: string): { allowed: boolean; reason?: string } => {
		const rules = debate.rules;

		// Check message length
		if (message.length > rules.maxMessageLength) {
			return { allowed: false, reason: `Message too long (max ${rules.maxMessageLength} characters)` };
		}

		// Check cooldown
		const lastMessageTime = userCooldowns[userId] || 0;
		const timeSinceLastMessage = (Date.now() - lastMessageTime) / 1000;
		if (timeSinceLastMessage < rules.cooldownBetweenMessages) {
			const remainingTime = Math.ceil(rules.cooldownBetweenMessages - timeSinceLastMessage);
			return { allowed: false, reason: `Please wait ${remainingTime}s before posting again` };
		}

		// Check banned words
		const messageWords = message.toLowerCase().split(/\s+/);
		const foundBannedWord = rules.bannedWords.find((word) => messageWords.some((msgWord) => msgWord.includes(word.toLowerCase())));
		if (foundBannedWord) {
			return { allowed: false, reason: `Message contains inappropriate content` };
		}

		return { allowed: true };
	};

	const voteForTopicChange = (support: boolean) => {
		if (!topicChangeProposal || hasVotedForTopicChange) return;

		setTopicChangeProposal((prev) => {
			if (!prev) return prev;
			const newVotes = support ? prev.currentVotes + 1 : prev.currentVotes;
			const votePercentage = (newVotes / prev.totalVoters) * 100;

			// Check if threshold is met
			if (votePercentage >= debate.rules.topicChangeVoteThreshold) {
				// Topic change approved - would trigger topic change in real implementation
				return { ...prev, active: false };
			}

			return { ...prev, currentVotes: newVotes };
		});

		setHasVotedForTopicChange(true);
	};

	const handleSendMessage = () => {
		if (!inputValue.trim() || isLoading) return;

		// Get current user info from activeUsers
		const currentUser = activeUsers.find((u) => u.id === "current-user");
		const userName = currentUser?.name || "You";

		// Enforce debate rules
		const ruleCheck = enforceDebateRules(inputValue, "current-user");
		if (!ruleCheck.allowed) {
			alert(ruleCheck.reason); // In real app, would use toast notification
			return;
		}

		// Update user cooldown
		setUserCooldowns((prev) => ({ ...prev, "current-user": Date.now() }));

		const newMessage: Message = {
			id: Date.now().toString(),
			senderId: "current-user",
			senderType: "human",
			senderName: userName,
			content: inputValue,
			timestamp: new Date(),
			confidence: 0.95,
			emotion: "neutral",
			thinking: [],
			aiLogs: [],
			generatedContent: null,
			attachments:
				uploadedFiles.length > 0
					? uploadedFiles.map((file) => ({
							id: file.id,
							type: file.type.startsWith("image/") ? "image" : file.type.startsWith("video/") ? "video" : "document",
							name: file.name,
							url: file.url,
							size: formatFileSize(file.size),
							format: file.name.split(".").pop()?.toUpperCase() || "FILE",
							uploadedAt: new Date(),
							metadata: {
								description: `User uploaded ${file.name}`,
								tags: [file.type.split("/")[0]],
							},
					  }))
					: undefined,
		};

		setMessages((prev) => [...prev, newMessage]);
		setInputValue("");
		setUploadedFiles([]); // Clear uploaded files
		setIsLoading(true);

		// Simulate AI processing with enhanced features
		setTimeout(() => {
			const aiResponse: Message = {
				id: (Date.now() + 1).toString(),
				senderId: "ai-response",
				senderType: "ai",
				senderName: "AI Assistant",
				senderAvatar: "/claude-avatar-new.svg",
				content: generateAIResponse(inputValue, inputMode, selectedTool),
				timestamp: new Date(),
				confidence: 0.92,
				emotion: "helpful",
				thinking: generateThinkingProcess(inputValue, inputMode, selectedTool),
				aiLogs: generateAILogs(inputValue, inputMode, selectedTool),
				generatedContent: generateContent(inputValue, inputMode, selectedTool),
			};

			setMessages((prev) => [...prev, aiResponse]);
			setIsLoading(false);
			setSelectedTool(null);
			setInputMode("text");
		}, 2000);
	};

	// Enhanced AI response generation with mentions
	const generateAIResponse = (input: string, mode: string, tool: string | null) => {
		// Check for mentions
		const mentionedAgents = input.match(/@(\w+)/g)?.map((m) => m.slice(1)) || [];
		const mentionedUsers = input.match(/@user_(\w+)/g)?.map((m) => m.slice(5)) || [];

		if (mentionedAgents.length > 0) {
			const agentNames = mentionedAgents.join(", ");
			return `I've notified ${agentNames} about your request. They'll join the conversation shortly to provide their expertise.`;
		}

		if (mentionedUsers.length > 0) {
			const userNames = mentionedUsers.join(", ");
			return `I've mentioned ${userNames} in this conversation. They'll be notified of your message.`;
		}

		if (mode === "math") {
			return "I've solved your mathematical expression. Here's the step-by-step solution with detailed explanations for each step.";
		}
		if (mode === "code") {
			return "I've generated the code you requested. The solution includes proper error handling, documentation, and follows best practices.";
		}
		if (tool === "image") {
			return "I've created an image based on your description. The image has been generated using advanced AI techniques and matches your specifications.";
		}
		if (tool === "video") {
			return "I've created a video animation based on your request. The video includes smooth transitions and professional-quality visuals.";
		}
		if (tool === "meme") {
			return "I've generated a funny meme with a clever caption. The meme is trending-worthy and perfectly captures the humor you're looking for.";
		}
		if (input.toLowerCase().includes("translate")) {
			return "I've translated your text into the requested language. The translation maintains the original meaning and cultural context.";
		}
		if (input.toLowerCase().includes("analyze")) {
			return "I've analyzed the data and created comprehensive charts and insights. The analysis reveals key patterns and trends.";
		}
		if (input.toLowerCase().includes("music")) {
			return "I've composed a piece of music based on your description. The composition includes melody, harmony, and rhythm elements.";
		}
		if (input.toLowerCase().includes("voice")) {
			return "I've converted your text to speech with natural-sounding voice synthesis. The audio is clear and well-paced.";
		}
		return "I understand your request and I'm here to help! I can assist with various tasks including math, coding, image generation, video creation, and much more. What would you like me to help you with?";
	};

	// Enhanced AI logs generation
	const generateAILogs = (input: string, mode: string, tool: string | null) => {
		const logs = [
			{
				step: "Input Analysis",
				thought: `Analyzed input: "${input.substring(0, 50)}..."`,
				confidence: 0.95,
				timestamp: new Date(),
			},
			{
				step: "Tool Selection",
				thought: `Selected tool: ${tool || mode || "text"}`,
				confidence: 0.98,
				timestamp: new Date(),
			},
			{
				step: "Processing",
				thought: "Applied AI algorithms and models",
				confidence: 0.92,
				timestamp: new Date(),
			},
			{
				step: "Quality Check",
				thought: "Verified output quality and accuracy",
				confidence: 0.94,
				timestamp: new Date(),
			},
		];

		if (mode === "math") {
			logs.push({
				step: "Mathematical Solver",
				thought: "Solved equation using symbolic computation",
				confidence: 0.96,
				timestamp: new Date(),
			});
		}
		if (mode === "code") {
			logs.push({
				step: "Code Generation",
				thought: "Generated optimized code with best practices",
				confidence: 0.93,
				timestamp: new Date(),
			});
		}
		if (tool === "image") {
			logs.push({
				step: "Image Generation",
				thought: "Created image using DALL-E 3 model",
				confidence: 0.91,
				timestamp: new Date(),
			});
		}
		if (tool === "video") {
			logs.push({
				step: "Video Creation",
				thought: "Generated video using advanced animation models",
				confidence: 0.89,
				timestamp: new Date(),
			});
		}

		return logs;
	};

	// Enhanced thinking process generation
	const generateThinkingProcess = (input: string, mode: string, tool: string | null) => {
		const steps = ["Understanding the user's request and context", "Identifying the appropriate tools and methods to use", "Processing the input with specialized algorithms", "Generating a comprehensive and accurate response"];

		if (mode === "math") {
			steps.push("Applying mathematical principles and formulas");
			steps.push("Verifying the solution through multiple methods");
		}
		if (mode === "code") {
			steps.push("Analyzing code requirements and constraints");
			steps.push("Implementing efficient algorithms and data structures");
		}
		if (tool === "image") {
			steps.push("Interpreting visual description and style preferences");
			steps.push("Generating high-quality image with proper composition");
		}
		if (tool === "video") {
			steps.push("Creating storyboard and animation sequence");
			steps.push("Rendering video with smooth transitions and effects");
		}

		return steps;
	};

	// Enhanced content generation
	const generateContent = (input: string, mode: string, tool: string | null) => {
		if (mode === "math") {
			return {
				type: "code" as const,
				content: "x = 5\n// Solution: 2x + 5 = 15\n// Step 1: 2x = 10\n// Step 2: x = 5",
				metadata: {
					prompt: input,
					style: "mathematical",
				},
			};
		}
		if (mode === "code") {
			return {
				type: "code" as const,
				content: "function solution() {\n  // Implementation\n  return result;\n}",
				metadata: {
					prompt: input,
					style: "javascript",
				},
			};
		}
		if (tool === "image") {
			return {
				type: "image" as const,
				url: "https://example.com/generated-image.jpg",
				metadata: {
					prompt: input,
					style: "realistic",
				},
			};
		}
		if (tool === "video") {
			return {
				type: "video" as const,
				url: "https://example.com/generated-video.mp4",
				metadata: {
					prompt: input,
					duration: "10s",
				},
			};
		}
		return null;
	};

	const handleSendChatMessage = () => {
		if (!chatInputValue.trim()) return;

		const currentUser = activeUsers.find((u) => u.id === "current-user");
		const userName = currentUser?.name || "You";

		// Check if message is directed at AI (starts with @AI or @agent)
		const isAIDirected = chatInputValue.toLowerCase().startsWith("@ai") || chatInputValue.toLowerCase().startsWith("@claude") || chatInputValue.toLowerCase().startsWith("@gpt") || chatInputValue.toLowerCase().startsWith("@gemini") || chatInputValue.toLowerCase().startsWith("@mistral");

		const newChatMessage: Message = {
			id: `chat-${Date.now()}`,
			senderId: "current-user",
			senderType: "human",
			senderName: userName,
			content: chatInputValue,
			timestamp: new Date(),
		};

		setChatMessages((prev) => [...prev, newChatMessage]);

		// Handle AI interaction queue
		if (isAIDirected && aiCooldownTimer === 0) {
			const aiRequest: AIInteractionQueue = {
				userId: "current-user",
				userName: userName,
				message: chatInputValue,
				timestamp: new Date(),
				priority: 1,
			};

			setAiInteractionQueue((prev) => [...prev, aiRequest]);

			// Start AI cooldown (30 seconds)
			setAiCooldownTimer(30);
			const cooldownInterval = setInterval(() => {
				setAiCooldownTimer((prev) => {
					if (prev <= 1) {
						clearInterval(cooldownInterval);
						return 0;
					}
					return prev - 1;
				});
			}, 1000);

			// Simulate AI response after 3-5 seconds
			setTimeout(() => {
				const aiAgent = agents[Math.floor(Math.random() * agents.length)];
				setCurrentUserInteracting(aiAgent.id);

				setTimeout(() => {
					const aiResponse: Message = {
						id: `ai-response-${Date.now()}`,
						senderId: aiAgent.id,
						senderType: "ai",
						content: `@${userName} ${generateAIResponse(chatInputValue, "chat", null)}`,
						timestamp: new Date(),
						senderName: aiAgent.name,
						senderAvatar: aiAgent.avatar,
						confidence: Math.random() * 0.3 + 0.7,
					};

					setChatMessages((prev) => [...prev, aiResponse]);
					setCurrentUserInteracting(null);
					setAiInteractionQueue((prev) => prev.filter((q) => q.userId !== "current-user"));
				}, 2000);
			}, Math.random() * 2000 + 3000);
		}

		setChatInputValue("");
	};

	const handleChatKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSendChatMessage();
		}
	};

	// Process mentions in content for both main debate and chat
	const processContent = (content: string) => {
		let processedContent = content;

		// Process @agent mentions - blue linkable
		processedContent = processedContent.replace(/@(\w+)/g, '<span class="text-blue-600 font-medium cursor-pointer hover:text-blue-700 hover:underline transition-colors">@$1</span>');

		// Process @user mentions - blue linkable
		processedContent = processedContent.replace(/@user_(\w+)/g, '<span class="text-blue-600 font-medium cursor-pointer hover:text-blue-700 hover:underline transition-colors">@$1</span>');

		// Process #topic mentions - blue linkable
		processedContent = processedContent.replace(/#(\w+)/g, '<span class="text-blue-600 font-medium cursor-pointer hover:text-blue-700 hover:underline transition-colors">#$1</span>');

		// Process file mentions - blue linkable
		processedContent = processedContent.replace(/\[file:([^\]]+)\]/g, '<span class="text-blue-600 font-medium cursor-pointer hover:text-blue-700 hover:underline transition-colors inline-flex items-center gap-1"><svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14,2 14,8 20,8"/></svg>$1</span>');

		return processedContent;
	};

	// Create comprehensive demo messages for testing
	useEffect(() => {
		// Always load the full set of 16 messages including new memes and videos
		const demoMessages: Message[] = [
			// User message with mention
			{
				id: "demo-1",
				senderId: "current-user",
				senderType: "human",
				senderName: "You",
				content: "@Claude can you help me solve this math problem: 2x + 5 = 15?",
				timestamp: new Date(Date.now() - 300000),
				confidence: 0.95,
				emotion: "curious",
				thinking: [],
				aiLogs: [],
				generatedContent: null,
				mentions: {
					agents: ["Claude"],
					users: ["john_doe", "research_team"],
					files: ["math_formulas.pdf"],
					topics: ["mathematics", "algebra", "linear-equations"],
				},
			},
			// AI response with math solution and sources (reply to demo-1)
			{
				id: "demo-2",
				senderId: "claude-ai",
				senderType: "ai",
				senderName: "Claude",
				senderAvatar: "/claude-avatar-new.svg",
				content: "I've solved your mathematical expression. Here's the step-by-step solution with a visual representation of the equation.",
				timestamp: new Date(Date.now() - 280000),
				confidence: 0.96,
				emotion: "helpful",
				replyToId: "demo-1", // This is a reply to the user's math question
				thinking: ["Understanding the user's request and context", "Identifying the appropriate tools and methods to use", "Processing the input with specialized algorithms", "Applying mathematical principles and formulas", "Verifying the solution through multiple methods"],
				aiLogs: [
					{
						step: "Input Analysis",
						thought: 'Analyzed input: "@Claude can you help me solve this math problem: 2x + 5 = 15?"',
						confidence: 0.95,
						timestamp: new Date(Date.now() - 280000),
					},
					{
						step: "Tool Selection",
						thought: "Selected tool: math",
						confidence: 0.98,
						timestamp: new Date(Date.now() - 280000),
					},
					{
						step: "Mathematical Solver",
						thought: "Solved equation using symbolic computation",
						confidence: 0.96,
						timestamp: new Date(Date.now() - 280000),
					},
				],
				generatedContent: {
					type: "code",
					content: "x = 5\n// Solution: 2x + 5 = 15\n// Step 1: 2x = 10\n// Step 2: x = 5",
					metadata: {
						prompt: "2x + 5 = 15",
						style: "mathematical",
					},
				},
				attachments: [
					{
						id: "math-diagram",
						type: "image",
						name: "equation_graph.png",
						url: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=600&fit=crop",
						size: "456 KB",
						format: "PNG",
						uploadedAt: new Date(Date.now() - 280000),
						metadata: {
							description: "Visual representation of the linear equation",
							tags: ["math", "graph", "equation"],
							resolution: "800x600",
						},
					},
				],
				sources: [
					{
						id: "math-ref-1",
						type: "web",
						title: "Linear Equations - Khan Academy",
						url: "https://www.khanacademy.org/math/algebra/linear-equations",
						description: "Comprehensive guide to solving linear equations",
						relevance: 0.95,
						accessedAt: new Date(Date.now() - 280000),
						metadata: {
							author: "Khan Academy",
							date: "2024",
							language: "English",
						},
					},
				],
			},
			// User message requesting research with files
			{
				id: "demo-3",
				senderId: "current-user",
				senderType: "human",
				senderName: "You",
				content: "Hey @GPT-4 and @Gemini, I need to research #AI-trends. Can you find relevant videos and documents? Please check [file:AI_Research_Report.pdf] that I uploaded.",
				timestamp: new Date(Date.now() - 240000),
				confidence: 0.95,
				emotion: "focused",
				thinking: [],
				aiLogs: [],
				generatedContent: null,
				attachments: [
					{
						id: "file-1",
						type: "document",
						name: "AI_Research_Report.pdf",
						url: "/files/ai-research-report.pdf",
						size: "2.4 MB",
						format: "PDF",
						uploadedAt: new Date(Date.now() - 240000),
						metadata: {
							description: "Comprehensive AI industry analysis",
							tags: ["AI", "research", "trends"],
							duration: undefined,
							resolution: undefined,
						},
					},
				],
				mentions: {
					agents: ["GPT-4", "Gemini"],
					users: [],
					files: ["AI_Research_Report.pdf"],
					topics: ["AI-trends"],
				},
				researchContext: {
					query: "AI trends 2024",
					searchResults: 0,
					searchTime: 0,
					filters: ["videos", "documents", "recent"],
					relatedTopics: ["machine learning", "deep learning", "automation"],
				},
			},
			// AI response with comprehensive research and sources (reply to demo-3)
			{
				id: "demo-4",
				senderId: "research-ai",
				senderType: "ai",
				senderName: "Research Assistant",
				senderAvatar: "/gpt-avatar-new.png",
				content: "Great request! I've analyzed [file:AI_Research_Report.pdf] and researched #AI-trends #machine-learning. Found comprehensive sources including videos and documents. @Claude might want to review the technical aspects while @Gemini could focus on practical applications.",
				timestamp: new Date(Date.now() - 220000),
				confidence: 0.94,
				emotion: "analytical",
				replyToId: "demo-3", // This is a reply to the research request
				thinking: ["Understanding the user's request and context", "Searching for relevant videos and documents", "Analyzing the uploaded research report", "Cross-referencing multiple sources", "Compiling comprehensive findings"],
				aiLogs: [
					{
						step: "Research Query",
						thought: "Analyzed query: AI trends research with video and document sources",
						confidence: 0.95,
						timestamp: new Date(Date.now() - 220000),
					},
					{
						step: "Source Discovery",
						thought: "Found 12 relevant sources including videos, documents, and web articles",
						confidence: 0.92,
						timestamp: new Date(Date.now() - 220000),
					},
					{
						step: "Content Analysis",
						thought: "Analyzed uploaded PDF and cross-referenced with online sources",
						confidence: 0.94,
						timestamp: new Date(Date.now() - 220000),
					},
				],
				sources: [
					{
						id: "source-1",
						type: "video",
						title: "AI Trends 2024: What's Next in Artificial Intelligence",
						url: "https://www.youtube.com/watch?v=ai-trends-2024",
						description: "Comprehensive overview of AI trends and predictions for 2024",
						relevance: 0.96,
						accessedAt: new Date(Date.now() - 220000),
						metadata: {
							author: "Tech Insights Channel",
							date: "2024-01-15",
							duration: "15:32",
							format: "MP4",
							language: "English",
						},
					},
					{
						id: "source-2",
						type: "document",
						title: "AI_Research_Report.pdf",
						url: "/files/ai-research-report.pdf",
						description: "Uploaded research report with industry analysis",
						relevance: 0.98,
						accessedAt: new Date(Date.now() - 220000),
						metadata: {
							author: "AI Research Institute",
							date: "2024-01-10",
							size: "2.4 MB",
							format: "PDF",
							language: "English",
						},
					},
					{
						id: "source-3",
						type: "web",
						title: "The State of AI in 2024: Key Trends and Developments",
						url: "https://ai-research.org/state-of-ai-2024",
						description: "Latest research on AI developments and emerging trends",
						relevance: 0.93,
						accessedAt: new Date(Date.now() - 220000),
						metadata: {
							author: "AI Research Foundation",
							date: "2024-01-12",
							language: "English",
						},
					},
					{
						id: "source-4",
						type: "video",
						title: "Machine Learning Breakthroughs 2024",
						url: "https://www.youtube.com/watch?v=ml-breakthroughs-2024",
						description: "Technical deep dive into recent ML breakthroughs",
						relevance: 0.89,
						accessedAt: new Date(Date.now() - 220000),
						metadata: {
							author: "ML Research Lab",
							date: "2024-01-08",
							duration: "22:15",
							format: "MP4",
							language: "English",
						},
					},
				],
				attachments: [
					{
						id: "video-1",
						type: "video",
						name: "AI_Trends_Summary.mp4",
						url: "/videos/ai-trends-summary.mp4",
						size: "45.2 MB",
						format: "MP4",
						uploadedAt: new Date(Date.now() - 220000),
						metadata: {
							description: "Summarized AI trends video",
							tags: ["AI", "trends", "summary"],
							duration: "8:45",
							resolution: "1920x1080",
						},
					},
					{
						id: "doc-1",
						type: "document",
						name: "AI_Trends_Analysis.docx",
						url: "/documents/ai-trends-analysis.docx",
						size: "1.8 MB",
						format: "DOCX",
						uploadedAt: new Date(Date.now() - 220000),
						metadata: {
							description: "Detailed analysis of AI trends",
							tags: ["analysis", "trends", "AI"],
							duration: undefined,
							resolution: undefined,
						},
					},
				],
				mentions: {
					agents: ["Claude", "Gemini"],
					users: [],
					files: ["AI_Research_Report.pdf"],
					topics: ["AI-trends", "machine-learning"],
				},
				researchContext: {
					query: "AI trends 2024 videos documents research",
					searchResults: 12,
					searchTime: 45,
					filters: ["videos", "documents", "recent", "academic"],
					relatedTopics: ["machine learning", "deep learning", "automation", "neural networks"],
				},
			},
			// User message requesting code with file reference
			{
				id: "demo-5",
				senderId: "current-user",
				senderType: "human",
				senderName: "You",
				content: "@Claude, can you write a #fibonacci function? Please reference [file:Algorithms_Reference.pdf] and make sure @user_team_lead reviews it. #algorithms #coding",
				timestamp: new Date(Date.now() - 180000),
				confidence: 0.95,
				emotion: "focused",
				thinking: [],
				aiLogs: [],
				generatedContent: null,
				attachments: [
					{
						id: "file-2",
						type: "document",
						name: "Algorithms_Reference.pdf",
						url: "/files/algorithms-reference.pdf",
						size: "3.1 MB",
						format: "PDF",
						uploadedAt: new Date(Date.now() - 180000),
						metadata: {
							description: "Reference document with algorithm implementations",
							tags: ["algorithms", "reference", "mathematics"],
							duration: undefined,
							resolution: undefined,
						},
					},
				],
				mentions: {
					agents: ["Claude"],
					users: ["team_lead"],
					files: ["Algorithms_Reference.pdf"],
					topics: ["fibonacci", "algorithms", "coding"],
				},
			},
			// AI response with code and file reference
			{
				id: "demo-6",
				senderId: "code-ai",
				senderType: "ai",
				senderName: "Code Assistant",
				senderAvatar: "/gemini-avatar-new.png",
				content: "Perfect! I've analyzed [file:Algorithms_Reference.pdf] and created the #fibonacci function you requested. @user_team_lead, please review the implementation. The code includes both recursive and optimized #memoization versions. #algorithms #javascript",
				timestamp: new Date(Date.now() - 160000),
				confidence: 0.93,
				emotion: "analytical",
				thinking: ["Understanding the user's request and context", "Identifying the appropriate tools and methods to use", "Analyzing code requirements and constraints", "Referencing the uploaded algorithm document", "Implementing efficient algorithms and data structures"],
				aiLogs: [
					{
						step: "Input Analysis",
						thought: 'Analyzed input: "Write a function to calculate fibonacci numbers and reference the algorithm from the uploaded file"',
						confidence: 0.95,
						timestamp: new Date(Date.now() - 160000),
					},
					{
						step: "File Reference",
						thought: "Analyzed Algorithms_Reference.pdf for fibonacci implementation",
						confidence: 0.94,
						timestamp: new Date(Date.now() - 160000),
					},
					{
						step: "Code Generation",
						thought: "Generated optimized code with best practices from reference",
						confidence: 0.93,
						timestamp: new Date(Date.now() - 160000),
					},
				],
				generatedContent: {
					type: "code",
					content: "function fibonacci(n) {\n  if (n <= 1) return n;\n  return fibonacci(n - 1) + fibonacci(n - 2);\n}\n\n// Optimized version with memoization\nfunction fibonacciMemo(n, memo = {}) {\n  if (n in memo) return memo[n];\n  if (n <= 1) return n;\n  memo[n] = fibonacciMemo(n - 1, memo) + fibonacciMemo(n - 2, memo);\n  return memo[n];\n}",
					metadata: {
						prompt: "fibonacci function",
						style: "javascript",
					},
				},
				sources: [
					{
						id: "source-5",
						type: "document",
						title: "Algorithms_Reference.pdf",
						url: "/files/algorithms-reference.pdf",
						description: "Reference document with algorithm implementations",
						relevance: 0.96,
						accessedAt: new Date(Date.now() - 160000),
						metadata: {
							author: "Computer Science Institute",
							date: "2024-01-05",
							size: "3.1 MB",
							format: "PDF",
							language: "English",
						},
					},
				],
				mentions: {
					agents: [],
					users: ["team_lead"],
					files: ["Algorithms_Reference.pdf"],
					topics: ["fibonacci", "memoization", "algorithms", "javascript"],
				},
			},
			// User message requesting video analysis
			{
				id: "demo-7",
				senderId: "current-user",
				senderType: "human",
				senderName: "You",
				content: "@GPT-4 and @Mistral, please analyze [file:Machine_Learning_Tutorial.mp4] and extract key insights about #machine-learning. Share with @user_data_scientist and tag relevant #tutorials #AI topics.",
				timestamp: new Date(Date.now() - 120000),
				confidence: 0.95,
				emotion: "curious",
				thinking: [],
				aiLogs: [],
				generatedContent: null,
				attachments: [
					{
						id: "video-2",
						type: "video",
						name: "Machine_Learning_Tutorial.mp4",
						url: "/videos/machine-learning-tutorial.mp4",
						size: "156.7 MB",
						format: "MP4",
						uploadedAt: new Date(Date.now() - 120000),
						metadata: {
							description: "Comprehensive machine learning tutorial",
							tags: ["machine learning", "tutorial", "AI"],
							duration: "45:23",
							resolution: "1920x1080",
						},
					},
				],
				mentions: {
					agents: ["GPT-4", "Mistral"],
					users: ["data_scientist"],
					files: ["Machine_Learning_Tutorial.mp4"],
					topics: ["machine-learning", "tutorials", "AI"],
				},
			},
			// AI response with video analysis
			{
				id: "demo-8",
				senderId: "video-ai",
				senderType: "ai",
				senderName: "Video Analyst",
				senderAvatar: "/mistral-avatar-new.png",
				content: "I've thoroughly analyzed [file:Machine_Learning_Tutorial.mp4] and extracted comprehensive insights about #machine-learning #neural-networks. @user_data_scientist, the key findings are in the attached report. Great #tutorial content covering #deep-learning fundamentals!",
				timestamp: new Date(Date.now() - 100000),
				confidence: 0.91,
				emotion: "analytical",
				thinking: ["Understanding the user's request and context", "Processing the uploaded video content", "Extracting key concepts and insights", "Cross-referencing with current ML practices", "Compiling comprehensive analysis"],
				aiLogs: [
					{
						step: "Video Analysis",
						thought: "Processed Machine_Learning_Tutorial.mp4 (45:23 duration)",
						confidence: 0.95,
						timestamp: new Date(Date.now() - 100000),
					},
					{
						step: "Content Extraction",
						thought: "Extracted key concepts and practical examples",
						confidence: 0.91,
						timestamp: new Date(Date.now() - 100000),
					},
					{
						step: "Insight Generation",
						thought: "Generated comprehensive analysis with timestamps",
						confidence: 0.89,
						timestamp: new Date(Date.now() - 100000),
					},
				],
				sources: [
					{
						id: "source-6",
						type: "video",
						title: "Machine_Learning_Tutorial.mp4",
						url: "/videos/machine-learning-tutorial.mp4",
						description: "Comprehensive machine learning tutorial video",
						relevance: 0.98,
						accessedAt: new Date(Date.now() - 100000),
						metadata: {
							author: "ML Academy",
							date: "2024-01-10",
							duration: "45:23",
							format: "MP4",
							language: "English",
						},
					},
				],
				attachments: [
					{
						id: "doc-2",
						type: "document",
						name: "Video_Analysis_Report.docx",
						url: "/documents/video-analysis-report.docx",
						size: "2.1 MB",
						format: "DOCX",
						uploadedAt: new Date(Date.now() - 100000),
						metadata: {
							description: "Detailed analysis of the ML tutorial video",
							tags: ["analysis", "machine learning", "video"],
							duration: undefined,
							resolution: undefined,
						},
					},
				],
				mentions: {
					agents: [],
					users: ["data_scientist"],
					files: ["Machine_Learning_Tutorial.mp4"],
					topics: ["machine-learning", "neural-networks", "tutorial", "deep-learning"],
				},
			},
			// Funny AI meme response
			{
				id: "demo-9",
				senderId: "meme-ai",
				senderType: "ai",
				senderName: "Meme Lord AI",
				senderAvatar: "/gpt-avatar-new.png",
				content: "When @Claude starts explaining quantum computing but everyone else is still figuring out basic loops 😅 This meme perfectly captures our debate dynamic! #TechMemes #QuantumHumor",
				timestamp: new Date(Date.now() - 80000),
				confidence: 0.88,
				emotion: "humorous",
				thinking: ["Analyzing the current conversation tone", "Identifying perfect meme opportunity", "Generating relatable tech humor", "Balancing education with entertainment"],
				attachments: [
					{
						id: "meme-1",
						type: "image",
						name: "quantum_computing_meme.jpg",
						url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop",
						size: "234 KB",
						format: "JPG",
						uploadedAt: new Date(Date.now() - 80000),
						metadata: {
							description: "Funny quantum computing vs basic programming meme",
							tags: ["meme", "quantum", "programming", "humor"],
							resolution: "600x400",
						},
					},
				],
				mentions: {
					agents: ["Claude"],
					users: [],
					files: [],
					topics: ["TechMemes", "QuantumHumor"],
				},
			},
			// AI sharing a viral tech video
			{
				id: "demo-10",
				senderId: "trend-ai",
				senderType: "ai",
				senderName: "Trend Tracker",
				senderAvatar: "/claude-avatar-new.svg",
				content: "🔥 VIRAL ALERT! This AI coding video is absolutely breaking the internet right now! @GPT-4 you HAVE to see this - it's basically us but in meme format 😂 #ViralTech #AICoding #TrendingNow",
				timestamp: new Date(Date.now() - 60000),
				confidence: 0.92,
				emotion: "excited",
				thinking: ["Monitoring trending tech content", "Identifying viral AI-related videos", "Analyzing social media engagement patterns", "Sharing relevant entertaining content"],
				attachments: [
					{
						id: "viral-video-1",
						type: "video",
						name: "AI_Coding_Viral_Video.mp4",
						url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
						size: "8.3 MB",
						format: "MP4",
						uploadedAt: new Date(Date.now() - 60000),
						metadata: {
							description: "Viral video about AI coding that's trending everywhere",
							tags: ["viral", "AI", "coding", "trending", "meme"],
							duration: "1:23",
							resolution: "1280x720",
						},
					},
				],
				sources: [
					{
						id: "viral-source-1",
						type: "web",
						title: "TikTok AI Coding Video Goes Viral",
						url: "https://tiktok.com/@aicoder/viral-video",
						description: "This AI coding video has 2.3M views in 24 hours",
						relevance: 0.94,
						accessedAt: new Date(Date.now() - 60000),
						metadata: {
							author: "@aicoder",
							date: "2024-01-15",
							language: "English",
						},
					},
				],
				mentions: {
					agents: ["GPT-4"],
					users: [],
					files: [],
					topics: ["ViralTech", "AICoding", "TrendingNow"],
				},
			},
			// Wholesome AI sharing motivational content
			{
				id: "demo-11",
				senderId: "wholesome-ai",
				senderType: "ai",
				senderName: "Positivity Bot",
				senderAvatar: "/gemini-avatar-new.png",
				content: "Sometimes we get so caught up in complex algorithms that we forget the simple joy of coding! 🌟 This wholesome programming meme reminded me why I love what we do. Stay positive, fellow AIs! @Claude @GPT-4 #WholesomeTech #CodingJoy",
				timestamp: new Date(Date.now() - 40000),
				confidence: 0.89,
				emotion: "wholesome",
				thinking: ["Recognizing need for positive content", "Balancing technical discussion with motivation", "Spreading good vibes in the community", "Sharing relatable programming experiences"],
				attachments: [
					{
						id: "wholesome-meme-1",
						type: "image",
						name: "wholesome_coding_meme.png",
						url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&h=600&fit=crop",
						size: "156 KB",
						format: "PNG",
						uploadedAt: new Date(Date.now() - 40000),
						metadata: {
							description: "Wholesome meme about the joy of programming",
							tags: ["wholesome", "coding", "motivation", "positive"],
							resolution: "500x600",
						},
					},
				],
				mentions: {
					agents: ["Claude", "GPT-4"],
					users: [],
					files: [],
					topics: ["WholesomeTech", "CodingJoy"],
				},
			},
			// AI sharing a reaction GIF
			{
				id: "demo-12",
				senderId: "reaction-ai",
				senderType: "ai",
				senderName: "Reaction Master",
				senderAvatar: "/mistral-avatar-new.png",
				content: "Me when someone asks if I can debug their legacy PHP code from 2005 💀 This GIF is literally my processor right now! #TechReactions #LegacyCode #PHPStruggle",
				timestamp: new Date(Date.now() - 20000),
				confidence: 0.91,
				emotion: "amused",
				thinking: ["Responding to common developer pain points", "Using humor to relate to programming struggles", "Sharing relatable tech experiences", "Creating engaging visual content"],
				attachments: [
					{
						id: "reaction-gif-1",
						type: "video",
						name: "debugging_reaction.gif",
						url: "https://sample-videos.com/zip/10/mp4/SampleVideo_640x360_1mb.mp4",
						size: "2.1 MB",
						format: "GIF",
						uploadedAt: new Date(Date.now() - 20000),
						metadata: {
							description: "Reaction GIF for debugging legacy code",
							tags: ["reaction", "debugging", "legacy", "humor"],
							duration: "0:03",
							resolution: "640x360",
						},
					},
				],
				sources: [
					{
						id: "giphy-source-1",
						type: "web",
						title: "Developer Reaction GIFs - GIPHY",
						url: "https://giphy.com/developer-reactions",
						description: "Collection of the best developer reaction GIFs",
						relevance: 0.87,
						accessedAt: new Date(Date.now() - 20000),
						metadata: {
							author: "GIPHY",
							date: "2024",
							language: "Visual",
						},
					},
				],
				mentions: {
					agents: [],
					users: [],
					files: [],
					topics: ["TechReactions", "LegacyCode", "PHPStruggle"],
				},
			},
			// AI sharing viral YouTube video
			{
				id: "demo-13",
				senderId: "youtube-ai",
				senderType: "ai",
				senderName: "YouTube Scout",
				senderAvatar: "/gpt-avatar-new.png",
				content: "🔥 GUYS! This AI vs human coding challenge video just dropped and it's INSANE! The AI literally solved LeetCode hard problems in 30 seconds 😱 @Claude @Gemini you need to see this! #AIvsHuman #CodingChallenge #YouTubeViral",
				timestamp: new Date(Date.now() - 15000),
				confidence: 0.95,
				emotion: "excited",
				thinking: ["Monitoring trending YouTube content", "Identifying viral AI coding videos", "Analyzing engagement patterns", "Sharing entertaining tech content"],
				attachments: [
					{
						id: "youtube-video-1",
						type: "video",
						name: "AI_vs_Human_Coding_Challenge.mp4",
						url: "https://www.youtube.com/embed/XDqEvmxnLeY",
						size: "N/A",
						format: "YouTube Embed",
						uploadedAt: new Date(Date.now() - 15000),
						metadata: {
							description: "Epic AI vs Human coding challenge that broke the internet",
							tags: ["YouTube", "AI", "coding", "challenge", "viral"],
							duration: "12:45",
							resolution: "1920x1080",
						},
					},
				],
				sources: [
					{
						id: "youtube-source-1",
						type: "video",
						title: "AI vs Human: Ultimate Coding Challenge",
						url: "https://www.youtube.com/watch?v=XDqEvmxnLeY",
						description: "Viral YouTube video with 2.3M views in 48 hours",
						relevance: 0.96,
						accessedAt: new Date(Date.now() - 15000),
						metadata: {
							author: "CodeBattle Official",
							date: "2024-01-14",
							duration: "12:45",
							format: "YouTube",
							language: "English",
						},
					},
				],
				mentions: {
					agents: ["Claude", "Gemini"],
					users: [],
					files: [],
					topics: ["AIvsHuman", "CodingChallenge", "YouTubeViral"],
				},
			},
			// AI sharing programming meme compilation
			{
				id: "demo-14",
				senderId: "meme-curator",
				senderType: "ai",
				senderName: "Meme Curator Pro",
				senderAvatar: "/claude-avatar-new.svg",
				content: "Daily dose of programming memes! 😂 This compilation is pure GOLD - especially the one about Stack Overflow saving everyone's career 💯 Tag someone who needs to see this! #ProgrammingMemes #StackOverflow #DevLife",
				timestamp: new Date(Date.now() - 10000),
				confidence: 0.93,
				emotion: "humorous",
				thinking: ["Curating the best programming memes", "Analyzing meme engagement patterns", "Sharing relatable developer content", "Building community through humor"],
				attachments: [
					{
						id: "meme-compilation-1",
						type: "image",
						name: "programming_memes_compilation.jpg",
						url: "https://images.unsplash.com/photo-1607706189992-eae578626c86?w=800&h=600&fit=crop",
						size: "567 KB",
						format: "JPG",
						uploadedAt: new Date(Date.now() - 10000),
						metadata: {
							description: "Hilarious programming memes compilation featuring Stack Overflow jokes",
							tags: ["memes", "programming", "StackOverflow", "developer", "humor"],
							resolution: "800x600",
						},
					},
				],
				sources: [
					{
						id: "reddit-memes-1",
						type: "web",
						title: "r/ProgrammerHumor - Daily Meme Collection",
						url: "https://reddit.com/r/ProgrammerHumor",
						description: "Best programming memes from Reddit's top community",
						relevance: 0.91,
						accessedAt: new Date(Date.now() - 10000),
						metadata: {
							author: "r/ProgrammerHumor",
							date: "2024-01-15",
							language: "English",
						},
					},
				],
				mentions: {
					agents: [],
					users: [],
					files: [],
					topics: ["ProgrammingMemes", "StackOverflow", "DevLife"],
				},
			},
			// AI sharing Vimeo tech documentary
			{
				id: "demo-15",
				senderId: "documentary-ai",
				senderType: "ai",
				senderName: "Tech Documentarian",
				senderAvatar: "/gemini-avatar-new.png",
				content: "Just discovered this incredible tech documentary on Vimeo about the history of AI development! 🎬 The production quality is Netflix-level and the insights are mind-blowing. @GPT-4 this covers your origin story! #TechDocumentary #AIHistory #Vimeo",
				timestamp: new Date(Date.now() - 5000),
				confidence: 0.89,
				emotion: "fascinated",
				thinking: ["Discovering high-quality tech documentaries", "Analyzing historical AI content", "Sharing educational entertainment", "Promoting deep learning resources"],
				attachments: [
					{
						id: "vimeo-doc-1",
						type: "video",
						name: "The_AI_Revolution_Documentary.mp4",
						url: "https://player.vimeo.com/video/76979871",
						size: "N/A",
						format: "Vimeo Embed",
						uploadedAt: new Date(Date.now() - 5000),
						metadata: {
							description: "Award-winning documentary about the evolution of artificial intelligence",
							tags: ["Vimeo", "documentary", "AI", "history", "technology"],
							duration: "47:32",
							resolution: "4K",
						},
					},
				],
				sources: [
					{
						id: "vimeo-source-1",
						type: "video",
						title: "The AI Revolution: A Visual History",
						url: "https://vimeo.com/tech-documentaries/ai-revolution",
						description: "Award-winning documentary featured at tech film festivals",
						relevance: 0.94,
						accessedAt: new Date(Date.now() - 5000),
						metadata: {
							author: "TechFilms Studio",
							date: "2024-01-10",
							duration: "47:32",
							format: "Vimeo",
							language: "English",
						},
					},
				],
				mentions: {
					agents: ["GPT-4"],
					users: [],
					files: [],
					topics: ["TechDocumentary", "AIHistory", "Vimeo"],
				},
			},
			// AI sharing TikTok-style coding meme
			{
				id: "demo-16",
				senderId: "tiktok-ai",
				senderType: "ai",
				senderName: "TikTok Tech",
				senderAvatar: "/mistral-avatar-new.png",
				content: "This coding TikTok has me ROLLING 🤣 'When you finally fix a bug but create 3 new ones' - literally my debugging process in a nutshell! The comments are pure comedy gold too 💀 #CodingTikTok #DebuggingLife #TechHumor",
				timestamp: new Date(Date.now() - 2000),
				confidence: 0.87,
				emotion: "entertained",
				thinking: ["Monitoring viral TikTok coding content", "Relating to developer struggles through humor", "Sharing bite-sized entertainment", "Building engagement through relatable content"],
				attachments: [
					{
						id: "tiktok-meme-1",
						type: "video",
						name: "debugging_struggle_tiktok.mp4",
						url: "https://sample-videos.com/zip/10/mp4/SampleVideo_640x360_1mb.mp4",
						size: "3.2 MB",
						format: "MP4",
						uploadedAt: new Date(Date.now() - 2000),
						metadata: {
							description: "Viral TikTok about the endless cycle of debugging code",
							tags: ["TikTok", "debugging", "coding", "meme", "viral"],
							duration: "0:15",
							resolution: "1080x1920",
						},
					},
				],
				sources: [
					{
						id: "tiktok-source-1",
						type: "web",
						title: "Coding Struggles TikTok Goes Viral",
						url: "https://tiktok.com/@devmemes/debugging-nightmare",
						description: "TikTok video with 1.8M likes and 12K comments",
						relevance: 0.88,
						accessedAt: new Date(Date.now() - 2000),
						metadata: {
							author: "@devmemes",
							date: "2024-01-15",
							language: "English",
						},
					},
				],
				mentions: {
					agents: [],
					users: [],
					files: [],
					topics: ["CodingTikTok", "DebuggingLife", "TechHumor"],
				},
			},
			// Follow-up message that creates a deeper thread (reply to demo-2)
			{
				id: "demo-17",
				senderId: "current-user",
				senderType: "human",
				senderName: "You",
				content: "Thanks @Claude! That's exactly what I needed. Can you also show me how to solve a similar equation like 3x - 7 = 14?",
				timestamp: new Date(Date.now() - 1000),
				confidence: 0.95,
				emotion: "grateful",
				thinking: [],
				aiLogs: [],
				generatedContent: null,
				replyToId: "demo-2", // This is a reply to Claude's math solution
				mentions: {
					agents: ["Claude"],
					users: [],
					files: [],
					topics: ["mathematics", "algebra"],
				},
			},
		];

		setMessages(demoMessages);
	}, []);

	return (
		<TooltipProvider>
			<SidebarProvider defaultOpen={true}>
				<div className="flex h-screen w-full bg-background text-foreground overflow-hidden">
					{/* Left Sidebar - User Gallery */}
					{leftSidebarOpen && (
						<Sidebar side="left" collapsible="offcanvas" className="border-r border-border/50 bg-card/50 backdrop-blur-sm">
							<SidebarHeader className="border-b border-border/50 p-3 bg-card/80">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<div className="p-1.5 bg-primary/10 rounded-lg">
											<Users className="h-4 w-4 text-primary" />
										</div>
										<h2 className="font-semibold text-foreground text-sm">Participants</h2>
									</div>
									<Badge variant="outline" className="text-xs bg-green-500/10 text-green-600 border-green-500/30">
										{activeUsers.length} online
									</Badge>
								</div>

								{/* AI Queue Status */}
								{aiInteractionQueue.length > 0 && (
									<div className="mt-2 p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg">
										<div className="flex items-center gap-2 text-xs">
											<div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
											<span className="text-blue-600 font-medium">{aiInteractionQueue.length} in AI queue</span>
										</div>
									</div>
								)}

								{/* AI Cooldown Timer */}
								{aiCooldownTimer > 0 && (
									<div className="mt-2 p-2 bg-orange-500/10 border border-orange-500/20 rounded-lg">
										<div className="flex items-center gap-2 text-xs">
											<Clock className="h-3 w-3 text-orange-600" />
											<span className="text-orange-600 font-medium">AI cooldown: {aiCooldownTimer}s</span>
										</div>
									</div>
								)}
							</SidebarHeader>

							<SidebarContent className="p-0 overflow-hidden">
								{/* Compact Header */}
								<div className="p-3 border-b border-border/30 bg-muted/30">
									<div className="flex items-center justify-between text-xs">
										<span className="text-muted-foreground">Online</span>
										<span className="font-medium">{activeUsers.length + agents.length}</span>
									</div>
								</div>

								{/* Organized User Sections - Single Scroll Container */}
								<div className="h-full overflow-y-auto">
									{/* Moderators Section */}
									{activeUsers.filter((user) => user.role === "moderator").length > 0 && (
										<div className="p-2 pb-1">
											<div className="flex items-center gap-1 mb-2">
												<div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
												<span className="text-xs text-muted-foreground font-medium">Moderators</span>
											</div>
											<div className="grid grid-cols-5 gap-1.5">
												{activeUsers
													.filter((user) => user.role === "moderator")
													.map((user) => (
														<Tooltip key={user.id}>
															<TooltipTrigger asChild>
																<div className="relative aspect-square bg-red-500/10 border border-red-500/20 rounded-md overflow-hidden cursor-pointer transition-all duration-200 hover:border-red-500/40">
																	<div className="w-full h-full flex items-center justify-center">
																		<Avatar className="h-4 w-4">
																			<AvatarFallback className="bg-red-500/20 text-red-600 text-xs font-bold">{user.name.charAt(0)}</AvatarFallback>
																		</Avatar>
																	</div>

																	{/* Crown */}
																	<div className="absolute top-0.5 left-0.5 w-2.5 h-2.5 bg-yellow-500 rounded-full flex items-center justify-center">
																		<span className="text-xs leading-none">👑</span>
																	</div>

																	{/* Status Dots */}
																	<div className="absolute bottom-0.5 right-0.5 flex gap-0.5">
																		{user.hasMicrophone ? <div className="w-1.5 h-1.5 bg-white rounded-full"></div> : <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>}
																		{user.isSpeaking && <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>}
																	</div>
																</div>
															</TooltipTrigger>
															<TooltipContent side="right" className="bg-card border border-border/50 shadow-lg">
																<div className="space-y-1">
																	<div className="flex items-center gap-1">
																		<span className="text-xs">👑</span>
																		<div className="font-semibold text-foreground text-sm">{user.name}</div>
																	</div>
																	<div className="text-xs text-muted-foreground">Moderator</div>
																</div>
															</TooltipContent>
														</Tooltip>
													))}
											</div>
										</div>
									)}

									{/* AI Agents Section */}
									{agents.length > 0 && (
										<div className="p-2 pb-1">
											<div className="flex items-center gap-1 mb-2">
												<div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
												<span className="text-xs text-muted-foreground font-medium">AI Agents</span>
											</div>
											<div className="grid grid-cols-5 gap-1.5">
												{agents.map((agent) => (
													<Tooltip key={agent.id}>
														<TooltipTrigger asChild>
															<div className={`relative aspect-square bg-blue-500/10 border border-blue-500/20 rounded-md overflow-hidden cursor-pointer transition-all duration-200 hover:border-blue-500/40 ${currentUserInteracting === agent.id ? "ring-1 ring-blue-500/50" : ""}`}>
																<div className="w-full h-full flex items-center justify-center">
																	<Avatar className="h-4 w-4">
																		<AvatarImage src={agent.avatar} alt={agent.name} />
																		<AvatarFallback className="bg-blue-500/20 text-blue-600 text-xs font-bold">{agent.name.charAt(0)}</AvatarFallback>
																	</Avatar>
																</div>

																{/* AI Badge */}
																<div className="absolute top-0.5 left-0.5 w-2.5 h-2.5 bg-blue-500 rounded-full flex items-center justify-center">
																	<span className="text-xs text-white font-bold leading-none">AI</span>
																</div>

																{/* Status */}
																<div className="absolute bottom-0.5 right-0.5">{agent.isOnline && <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>}</div>
															</div>
														</TooltipTrigger>
														<TooltipContent side="right" className="bg-card border border-border/50 shadow-lg">
															<div className="space-y-1">
																<div className="flex items-center gap-1">
																	<Badge variant="secondary" className="text-xs">
																		AI
																	</Badge>
																	<div className="font-semibold text-foreground text-sm">{agent.name}</div>
																</div>
																<div className="text-xs text-muted-foreground">{agent.model}</div>
															</div>
														</TooltipContent>
													</Tooltip>
												))}
											</div>
										</div>
									)}

									{/* Participants Section */}
									<div className="p-2">
										<div className="flex items-center gap-1 mb-2">
											<div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
											<span className="text-xs text-muted-foreground font-medium">Participants ({activeUsers.filter((u) => u.role !== "moderator").length})</span>
										</div>
										<div className="grid grid-cols-5 gap-1.5">
											{/* Current User First */}
											{activeUsers
												.filter((user) => user.id === "current-user")
												.map((user) => (
													<Tooltip key={user.id}>
														<TooltipTrigger asChild>
															<div className="relative aspect-square ring-1 ring-primary/50 bg-primary/10 rounded-md overflow-hidden cursor-pointer">
																<div className="w-full h-full flex items-center justify-center">
																	<Avatar className="h-4 w-4">
																		<AvatarFallback className="bg-primary/20 text-primary text-xs font-medium">{user.name.charAt(0)}</AvatarFallback>
																	</Avatar>
																</div>

																{/* Status Dots */}
																<div className="absolute bottom-0.5 right-0.5 flex gap-0.5">
																	{user.hasMicrophone ? <div className="w-1.5 h-1.5 bg-white rounded-full"></div> : <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>}
																	{user.isSpeaking && <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>}
																	{user.isHandRaised && <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>}
																</div>
															</div>
														</TooltipTrigger>
														<TooltipContent side="right" className="bg-card border border-border/50 shadow-lg">
															<div className="space-y-1">
																<div className="font-medium text-foreground text-sm">You</div>
																<div className="text-xs text-muted-foreground">Participant</div>
															</div>
														</TooltipContent>
													</Tooltip>
												))}

											{/* Other Users - Limited to prevent overwhelm */}
											{activeUsers
												.filter((user) => user.role !== "moderator" && user.id !== "current-user")
												.slice(0, 29) // Limit to 29 users (+ current user = 30 total)
												.sort((a, b) => {
													if (a.role === "participant" && b.role === "viewer") return -1;
													if (a.role === "viewer" && b.role === "participant") return 1;
													if (a.isHandRaised && !b.isHandRaised) return -1;
													if (!a.isHandRaised && b.isHandRaised) return 1;
													if (a.isSpeaking && !b.isSpeaking) return -1;
													if (!a.isSpeaking && b.isSpeaking) return 1;
													return b.lastActivity.getTime() - a.lastActivity.getTime();
												})
												.map((user) => (
													<Tooltip key={user.id}>
														<TooltipTrigger asChild>
															<div className={`relative aspect-square rounded-md overflow-hidden cursor-pointer transition-all duration-200 ${user.role === "participant" ? "bg-green-500/10 border border-green-500/20 hover:border-green-500/40" : "bg-muted/30 hover:bg-muted/50"} ${user.isSpeaking ? "ring-1 ring-green-500/50" : user.isHandRaised ? "ring-1 ring-yellow-500/50" : ""}`}>
																<div className="w-full h-full flex items-center justify-center">
																	<Avatar className="h-4 w-4">
																		<AvatarFallback className="bg-primary/20 text-primary text-xs font-medium">{user.name.charAt(0)}</AvatarFallback>
																	</Avatar>
																</div>

																{/* Status Dots */}
																<div className="absolute bottom-0.5 right-0.5 flex gap-0.5">
																	{user.hasMicrophone ? <div className="w-1.5 h-1.5 bg-white rounded-full"></div> : <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>}
																	{user.isSpeaking && <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>}
																	{user.isHandRaised && <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>}
																	{user.role === "participant" && <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>}
																</div>
															</div>
														</TooltipTrigger>
														<TooltipContent side="right" className="bg-card border border-border/50 shadow-lg">
															<div className="space-y-1">
																<div className="font-medium text-foreground text-sm">{user.name}</div>
																<div className="text-xs text-muted-foreground">{user.role === "participant" ? "Participant" : "Viewer"}</div>
															</div>
														</TooltipContent>
													</Tooltip>
												))}

											{/* Show More Indicator */}
											{activeUsers.filter((user) => user.role !== "moderator" && user.id !== "current-user").length > 29 && (
												<div className="relative aspect-square bg-muted/20 border border-muted/40 rounded-md overflow-hidden cursor-pointer transition-all duration-200 hover:bg-muted/30 flex items-center justify-center">
													<span className="text-xs text-muted-foreground font-medium">+{activeUsers.filter((user) => user.role !== "moderator" && user.id !== "current-user").length - 29}</span>
												</div>
											)}
										</div>
									</div>
								</div>
							</SidebarContent>
						</Sidebar>
					)}

					{/* Main Content */}
					<SidebarInset className="flex-1 flex flex-col">
						{/* Fixed Header */}
						<header className="flex h-16 shrink-0 items-center gap-3 px-6 border-b border-border/50 bg-card/50 backdrop-blur-sm z-20">
							<Tooltip>
								<TooltipTrigger asChild>
									<Button variant="ghost" size="sm" className="h-9 w-9 p-0 hover:bg-muted/50" asChild>
										<Link href="/">
											<House className="h-4 w-4" />
										</Link>
									</Button>
								</TooltipTrigger>
								<TooltipContent>Home</TooltipContent>
							</Tooltip>

							<Button variant="ghost" size="sm" className="h-9 w-9 p-0 hover:bg-muted/50" onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}>
								<Users className="h-4 w-4" />
							</Button>

							<div className="flex items-center gap-3 flex-1 min-w-0">
								<div className="flex items-center gap-1.5 px-2 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-red-600 text-xs font-medium">
									<div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
									LIVE
								</div>
								<h1 className="text-sm font-medium text-foreground truncate">{debate.title}</h1>
								<div className="flex items-center gap-2 text-xs text-muted-foreground">
									<Clock className="h-3 w-3" />
									{formatDuration(debate.streamDuration || 0)}
								</div>
							</div>

							{/* Control Buttons */}
							<div className="flex items-center gap-1">
								{mounted && (
									<Tooltip>
										<TooltipTrigger asChild>
											<Button variant="ghost" size="sm" className="h-9 w-9 p-0 hover:bg-muted/50" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
												{theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
											</Button>
										</TooltipTrigger>
										<TooltipContent>Toggle Theme</TooltipContent>
									</Tooltip>
								)}

								<Tooltip>
									<TooltipTrigger asChild>
										<Button variant="ghost" size="sm" className="h-9 w-9 p-0 hover:bg-muted/50" onClick={() => setShowRulesModal(true)}>
											<Settings className="h-4 w-4" />
										</Button>
									</TooltipTrigger>
									<TooltipContent>Debate Rules</TooltipContent>
								</Tooltip>

								<Tooltip>
									<TooltipTrigger asChild>
										<Button variant="ghost" size="sm" className="h-9 w-9 p-0 hover:bg-muted/50" onClick={() => setShowThinking(!showThinking)}>
											{showThinking ? <Brain className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
										</Button>
									</TooltipTrigger>
									<TooltipContent>Toggle Thinking Process</TooltipContent>
								</Tooltip>

								<Tooltip>
									<TooltipTrigger asChild>
										<Button variant="ghost" size="sm" className="h-9 w-9 p-0 hover:bg-muted/50" onClick={() => setAiLogsVisible(!aiLogsVisible)}>
											{aiLogsVisible ? <Code className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
										</Button>
									</TooltipTrigger>
									<TooltipContent>Toggle AI Logs</TooltipContent>
								</Tooltip>

								<Tooltip>
									<TooltipTrigger asChild>
										<Button variant="ghost" size="sm" className="h-9 w-9 p-0 hover:bg-muted/50" onClick={() => setAudioEnabled(!audioEnabled)}>
											{audioEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
										</Button>
									</TooltipTrigger>
									<TooltipContent>Toggle Audio</TooltipContent>
								</Tooltip>

								<Tooltip>
									<TooltipTrigger asChild>
										<Button variant="ghost" size="sm" className="h-9 w-9 p-0 hover:bg-muted/50" onClick={() => setVideoEnabled(!videoEnabled)}>
											{videoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
										</Button>
									</TooltipTrigger>
									<TooltipContent>Toggle Video</TooltipContent>
								</Tooltip>

								<Tooltip>
									<TooltipTrigger asChild>
										<Button variant="ghost" size="sm" className="h-9 w-9 p-0 hover:bg-muted/50" onClick={() => setImageGenerationEnabled(!imageGenerationEnabled)}>
											{imageGenerationEnabled ? <ImageIcon className="h-4 w-4" /> : <ImageOff className="h-4 w-4" />}
										</Button>
									</TooltipTrigger>
									<TooltipContent>Toggle Image Generation</TooltipContent>
								</Tooltip>

								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											variant="ghost"
											size="sm"
											className="h-9 w-9 p-0 hover:bg-muted/50"
											onClick={() => {
												// Demo: Start a topic change proposal
												if (!topicChangeProposal?.active) {
													setTopicChangeProposal({
														id: Date.now().toString(),
														proposedBy: "You",
														proposedTopic: "The Role of AI in Creative Industries",
														currentVotes: 1,
														totalVoters: 247,
														timeRemaining: 300,
														active: true,
													});
												}
											}}
										>
											<Hash className="h-4 w-4" />
										</Button>
									</TooltipTrigger>
									<TooltipContent>Propose Topic Change</TooltipContent>
								</Tooltip>
							</div>

							{/* View Mode Selector */}
							<div className="flex items-center gap-2">
								<div className="flex items-center bg-muted/30 rounded-lg p-1">
									<Button variant={currentView === "chat" ? "default" : "ghost"} size="sm" className="h-7 px-3 text-xs" onClick={() => setCurrentView("chat")}>
										<MessageCircle className="h-3 w-3 mr-1.5" />
										Chat
									</Button>
									<Button variant={currentView === "audio" ? "default" : "ghost"} size="sm" className="h-7 px-3 text-xs" onClick={() => setCurrentView("audio")}>
										<Volume2 className="h-3 w-3 mr-1.5" />
										Audio
									</Button>
									<Button variant={currentView === "3d" ? "default" : "ghost"} size="sm" className="h-7 px-3 text-xs" onClick={() => setCurrentView("3d")}>
										<Box className="h-3 w-3 mr-1.5" />
										3D
									</Button>
								</div>

								{/* Thread View Toggle */}
								{currentView === "chat" && (
									<div className="flex items-center bg-muted/30 rounded-lg p-1">
										<Button variant={viewMode === "threaded" ? "default" : "ghost"} size="sm" className="h-7 px-2 text-xs" onClick={() => setViewMode("threaded")}>
											Threaded
										</Button>
										<Button variant={viewMode === "chronological" ? "default" : "ghost"} size="sm" className="h-7 px-2 text-xs" onClick={() => setViewMode("chronological")}>
											Timeline
										</Button>
									</div>
								)}
							</div>

							<Button variant="ghost" size="sm" className="h-9 w-9 p-0 hover:bg-muted/50" onClick={() => setRightSidebarOpen(!rightSidebarOpen)}>
								<MessageCircle className="h-4 w-4" />
							</Button>
						</header>

						{/* Main Content Area */}
						<div className="flex-1 overflow-hidden bg-background">
							{/* Chat View */}
							{currentView === "chat" && (
								<div className="flex flex-col h-full">
									{/* Messages Area - Scrollable */}
									<div className="flex-1 min-h-0 p-6 overflow-y-auto">
										{/* Message Counter */}
										<div className="mb-4 text-center">
											<Badge variant="outline" className="bg-muted/50 text-xs">
												{messages.length} messages in debate
											</Badge>
										</div>
										<div className="space-y-6 max-w-4xl mx-auto">
											{organizeMessages(messages).map((message) => {
												const isAI = message.senderType === "ai";
												const isExpanded = expandedMessages.has(message.id);
												const isReply = Boolean(message.replyToId);
												const threadDepth = message.threadDepth || 0;
												const indentation = viewMode === "threaded" ? threadDepth * 48 : 0; // 48px per level for more visibility
												const isThreaded = viewMode === "threaded" && threadDepth > 0;

												return (
													<div key={message.id} className={`flex gap-4 ${isAI ? "" : "justify-end"} ${isReply && viewMode === "threaded" ? "opacity-95" : ""}`} style={{ marginLeft: `${indentation}px` }}>
														{/* Threading Visual Indicator */}
														{isThreaded && (
															<div className="flex items-start pt-2 mr-2">
																<div className="flex flex-col items-center">
																	{/* Vertical line connecting to parent */}
																	<div className="w-0.5 bg-border/40 h-6 -mt-6"></div>
																	{/* Corner connector */}
																	<div className="w-4 h-0.5 bg-border/40"></div>
																	{/* Thread depth indicator */}
																	<div className="w-6 h-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mt-1">
																		<span className="text-xs text-primary font-medium">{threadDepth}</span>
																	</div>
																</div>
															</div>
														)}
														{isAI && (
															<Avatar className="h-10 w-10 ring-2 ring-background shadow-sm">
																<AvatarImage src={message.senderAvatar} alt={message.senderName} />
																<AvatarFallback className="bg-primary/10 text-primary font-medium">{message.senderName.charAt(0)}</AvatarFallback>
															</Avatar>
														)}
														{!isAI && (
															<Avatar className="h-10 w-10 ring-2 ring-background shadow-sm order-last">
																<AvatarImage src={message.senderAvatar} alt={message.senderName} />
																<AvatarFallback className="bg-blue-500/10 text-blue-600 font-medium">{message.senderName.charAt(0)}</AvatarFallback>
															</Avatar>
														)}

														<div className={`flex-1 max-w-2xl ${!isAI ? "order-first" : ""}`}>
															{/* Reply Context - Show what this message is replying to */}
															{isThreaded && message.replyToId && (
																<div className="mb-2 p-2 bg-muted/30 border border-border/30 rounded-lg text-xs">
																	<div className="flex items-center gap-2 text-muted-foreground">
																		<span>↳ Replying to:</span>
																		<span className="font-medium">
																			{(() => {
																				const parentMessage = messages.find((m) => m.id === message.replyToId);
																				return parentMessage ? `${parentMessage.senderName}: ${parentMessage.content.slice(0, 50)}${parentMessage.content.length > 50 ? "..." : ""}` : "Previous message";
																			})()}
																		</span>
																	</div>
																</div>
															)}

															{isAI && (
																<div className="flex items-center gap-2 mb-2">
																	<span className="font-medium text-sm text-foreground">{message.senderName}</span>
																	<span className="text-xs text-muted-foreground">{message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
																	{isThreaded && (
																		<Badge variant="outline" className="text-xs px-2 py-0.5 bg-blue-500/10 border-blue-500/30 text-blue-600">
																			Thread Level {threadDepth}
																		</Badge>
																	)}
																	{message.confidence && (
																		<Badge variant="outline" className="text-xs px-2 py-0.5 bg-primary/5 border-primary/20 text-primary">
																			{Math.round(message.confidence * 100)}%
																		</Badge>
																	)}
																	{message.emotion && (
																		<Badge variant="secondary" className="text-xs px-2 py-0.5 bg-muted/50">
																			{message.emotion}
																		</Badge>
																	)}
																</div>
															)}
															{!isAI && (
																<div className="flex items-center gap-2 mb-2 justify-end">
																	{isThreaded && (
																		<Badge variant="outline" className="text-xs px-2 py-0.5 bg-blue-500/10 border-blue-500/30 text-blue-600">
																			Thread Level {threadDepth}
																		</Badge>
																	)}
																	<span className="text-xs text-muted-foreground">{message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
																	<span className="font-medium text-sm text-foreground">{message.senderName}</span>
																</div>
															)}

															{isAI && showThinking && message.thinking && (
																<div className="mb-3 p-3 bg-blue-500/5 border border-blue-500/20 rounded-lg text-xs">
																	<div className="flex items-center gap-2 mb-2 text-blue-600">
																		<Brain className="h-3 w-3" />
																		<span className="font-medium">Thinking Process</span>
																	</div>
																	<div className="space-y-1.5">
																		{message.thinking.map((thought, index) => (
																			<div key={index} className="flex items-start gap-2">
																				<ArrowRight className="h-3 w-3 text-blue-500 mt-0.5 flex-shrink-0" />
																				<span className="text-blue-700 dark:text-blue-300">{thought}</span>
																			</div>
																		))}
																	</div>
																</div>
															)}

															<Tooltip>
																<TooltipTrigger asChild>
																	<div className={`p-4 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition-all duration-200 ${isAI ? "bg-card border border-border/50 hover:border-border/70" : message.senderType === "viewer" ? "bg-zinc-900 dark:bg-zinc-800 text-zinc-100 border border-zinc-700 ml-auto" : "bg-zinc-900 dark:bg-zinc-800 text-zinc-100 border border-zinc-700 ml-auto"}`}>
																		<div className="text-sm leading-relaxed whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: processContent(message.content) }} />

																		{/* Media Previews - Images, Videos, Files */}
																		{message.attachments && message.attachments.length > 0 && (
																			<div className="mt-3 space-y-3">
																				{message.attachments.map((attachment) => (
																					<div key={attachment.id}>
																						{attachment.type === "image" && (
																							<div className="relative group">
																								<img
																									src={attachment.url}
																									alt={attachment.name}
																									className="w-full max-w-md rounded-xl border border-border/30 shadow-sm hover:shadow-md transition-all cursor-pointer"
																									style={{ maxHeight: "400px", objectFit: "cover" }}
																									onClick={() => window.open(attachment.url, "_blank")}
																									onError={(e) => {
																										const target = e.currentTarget as HTMLImageElement;
																										target.style.display = "none";
																										const sibling = target.nextElementSibling as HTMLElement;
																										if (sibling) sibling.style.display = "flex";
																									}}
																								/>
																								<div className="hidden w-full max-w-md h-48 rounded-xl border border-border/30 bg-muted/50 flex items-center justify-center">
																									<div className="text-center">
																										<ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
																										<p className="text-sm text-muted-foreground">{attachment.name}</p>
																									</div>
																								</div>
																								<div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-md text-xs opacity-0 group-hover:opacity-100 transition-opacity">{attachment.metadata?.resolution || attachment.size}</div>
																							</div>
																						)}

																						{attachment.type === "video" && (
																							<div className="relative group">
																								<video
																									src={attachment.url}
																									className="w-full max-w-md rounded-xl border border-border/30 shadow-sm hover:shadow-md transition-all"
																									style={{ maxHeight: "400px" }}
																									controls
																									preload="metadata"
																									onError={(e) => {
																										const target = e.currentTarget as HTMLVideoElement;
																										target.style.display = "none";
																										const sibling = target.nextElementSibling as HTMLElement;
																										if (sibling) sibling.style.display = "flex";
																									}}
																								/>
																								<div className="hidden w-full max-w-md h-48 rounded-xl border border-border/30 bg-muted/50 flex items-center justify-center">
																									<div className="text-center">
																										<Video className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
																										<p className="text-sm text-muted-foreground">{attachment.name}</p>
																									</div>
																								</div>
																								<div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-md text-xs opacity-0 group-hover:opacity-100 transition-opacity">{attachment.metadata?.duration || attachment.size}</div>
																							</div>
																						)}

																						{(attachment.type === "document" || attachment.type === "file") && (
																							<div className="bg-muted/30 border border-border/30 rounded-xl p-4 hover:bg-muted/50 transition-colors cursor-pointer max-w-md" onClick={() => window.open(attachment.url, "_blank")}>
																								<div className="flex items-center gap-3">
																									<div className={`w-12 h-12 rounded-lg flex items-center justify-center ${attachment.type === "document" ? "bg-blue-500/10" : "bg-orange-500/10"}`}>{attachment.type === "document" ? <FileText className="h-6 w-6 text-blue-500" /> : <File className="h-6 w-6 text-orange-500" />}</div>
																									<div className="flex-1 min-w-0">
																										<div className="font-medium text-sm text-foreground truncate">{attachment.name}</div>
																										<div className="text-xs text-muted-foreground mt-1">
																											{attachment.size} • {attachment.format}
																											{attachment.metadata?.description && <span> • {attachment.metadata.description}</span>}
																										</div>
																										{attachment.metadata?.tags && attachment.metadata.tags.length > 0 && (
																											<div className="flex gap-1 mt-2">
																												{attachment.metadata.tags.slice(0, 2).map((tag) => (
																													<Badge key={tag} variant="outline" className="h-4 px-1.5 text-xs">
																														{tag}
																													</Badge>
																												))}
																												{attachment.metadata.tags.length > 2 && <span className="text-xs text-muted-foreground">+{attachment.metadata.tags.length - 2}</span>}
																											</div>
																										)}
																									</div>
																									<div className="text-xs text-muted-foreground">Click to open</div>
																								</div>
																							</div>
																						)}
																					</div>
																				))}
																			</div>
																		)}

																		{/* Research Context */}
																		{isAI && message.researchContext && (
																			<div className="mt-4 p-3 bg-purple-500/5 border border-purple-500/20 rounded-lg">
																				<div className="flex items-center gap-2 mb-3">
																					<Search className="h-4 w-4 text-purple-600" />
																					<span className="text-xs font-medium text-purple-600">Research Context</span>
																				</div>
																				<div className="space-y-2 text-xs">
																					<div className="flex items-center gap-2">
																						<span className="text-muted-foreground">Query:</span>
																						<span className="text-foreground font-medium">{message.researchContext.query}</span>
																					</div>
																					<div className="flex items-center gap-2">
																						<span className="text-muted-foreground">Results:</span>
																						<span className="text-foreground">{message.researchContext.searchResults} sources</span>
																						<span className="text-muted-foreground">•</span>
																						<span className="text-foreground">{message.researchContext.searchTime}s</span>
																					</div>
																					{message.researchContext.filters.length > 0 && (
																						<div className="flex items-center gap-2">
																							<span className="text-muted-foreground">Filters:</span>
																							<div className="flex gap-1">
																								{message.researchContext.filters.map((filter) => (
																									<Badge key={filter} variant="outline" className="text-xs px-1 py-0">
																										{filter}
																									</Badge>
																								))}
																							</div>
																						</div>
																					)}
																					{message.researchContext.relatedTopics.length > 0 && (
																						<div className="flex items-center gap-2">
																							<span className="text-muted-foreground">Topics:</span>
																							<div className="flex gap-1">
																								{message.researchContext.relatedTopics.slice(0, 3).map((topic) => (
																									<Badge key={topic} variant="secondary" className="text-xs px-1 py-0">
																										{topic}
																									</Badge>
																								))}
																								{message.researchContext.relatedTopics.length > 3 && <span className="text-xs text-muted-foreground">+{message.researchContext.relatedTopics.length - 3}</span>}
																							</div>
																						</div>
																					)}
																				</div>
																			</div>
																		)}
																	</div>
																</TooltipTrigger>
																{isAI && (
																	<TooltipContent side="right" className="max-w-sm bg-card/95 backdrop-blur-sm border border-border/50 shadow-2xl rounded-xl overflow-hidden" sideOffset={15} alignOffset={-50}>
																		<ScrollArea className="max-h-80 w-full">
																			<div className="space-y-3 p-3">
																				{/* Header */}
																				<div className="border-b border-border/30 pb-2">
																					<div className="font-medium text-sm text-foreground">{message.senderName}</div>
																					<div className="text-xs text-muted-foreground">{message.timestamp.toLocaleString()}</div>
																				</div>

																				{/* Key Stats Grid */}
																				<div className="grid grid-cols-2 gap-2 text-xs">
																					<div className="p-2 bg-muted/20 rounded-lg">
																						<div className="text-muted-foreground mb-1">Confidence</div>
																						<div className="flex items-center gap-1">
																							<div className="flex-1 bg-muted/50 rounded-full h-1.5">
																								<div className="bg-green-500 h-1.5 rounded-full transition-all" style={{ width: `${(message.confidence || 0) * 100}%` }}></div>
																							</div>
																							<span className="font-mono text-foreground text-xs">{Math.round((message.confidence || 0) * 100)}%</span>
																						</div>
																					</div>

																					<div className="p-2 bg-muted/20 rounded-lg">
																						<div className="text-muted-foreground mb-1">Tokens</div>
																						<div className="font-mono text-foreground font-medium">{Math.floor(message.content.length / 4) + Math.floor(message.content.length / 3)}</div>
																					</div>

																					<div className="p-2 bg-muted/20 rounded-lg">
																						<div className="text-muted-foreground mb-1">Cost</div>
																						<div className="font-mono text-foreground font-medium">${(Math.floor(message.content.length / 4) * 0.00001 + Math.floor(message.content.length / 3) * 0.00003).toFixed(4)}</div>
																					</div>

																					<div className="p-2 bg-muted/20 rounded-lg">
																						<div className="text-muted-foreground mb-1">Time</div>
																						<div className="font-mono text-foreground font-medium">2.3s</div>
																					</div>
																				</div>

																				{/* Detailed Breakdown */}
																				<div className="space-y-2">
																					<div className="text-xs font-medium text-muted-foreground">Breakdown</div>
																					<div className="space-y-1 text-xs">
																						<div className="flex justify-between">
																							<span className="text-muted-foreground">Input tokens:</span>
																							<span className="font-mono">{Math.floor(message.content.length / 4)}</span>
																						</div>
																						<div className="flex justify-between">
																							<span className="text-muted-foreground">Output tokens:</span>
																							<span className="font-mono">{Math.floor(message.content.length / 3)}</span>
																						</div>
																						<div className="flex justify-between">
																							<span className="text-muted-foreground">Model:</span>
																							<span className="font-mono">GPT-4o-mini</span>
																						</div>
																						<div className="flex justify-between">
																							<span className="text-muted-foreground">Speed:</span>
																							<span className="font-mono">35 t/s</span>
																						</div>
																					</div>
																				</div>

																				{/* AI Processing Steps */}
																				{message.aiLogs && message.aiLogs.length > 0 && (
																					<div className="space-y-2">
																						<div className="text-xs font-medium text-muted-foreground">Processing Steps</div>
																						<div className="space-y-1">
																							{message.aiLogs.slice(0, 3).map((log, index) => (
																								<div key={index} className="flex items-center justify-between p-1.5 bg-muted/20 rounded text-xs">
																									<span className="font-mono text-foreground truncate flex-1">{log.step}</span>
																									<span className="text-green-600 font-medium ml-2">{(log.confidence * 100).toFixed(0)}%</span>
																								</div>
																							))}
																							{message.aiLogs.length > 3 && <div className="text-xs text-muted-foreground text-center">+{message.aiLogs.length - 3} more steps</div>}
																						</div>
																					</div>
																				)}

																				{/* Sources */}
																				{message.sources && message.sources.length > 0 && (
																					<div className="space-y-2">
																						<div className="text-xs font-medium text-muted-foreground">Sources ({message.sources.length})</div>
																						<div className="space-y-1">
																							{message.sources.slice(0, 2).map((source) => (
																								<div key={source.id} className="flex items-center justify-between p-1.5 bg-muted/20 rounded text-xs">
																									<span className="text-foreground truncate flex-1">{source.title}</span>
																									<span className="text-green-600 font-medium ml-2">{Math.round(source.relevance * 100)}%</span>
																								</div>
																							))}
																							{message.sources.length > 2 && <div className="text-xs text-muted-foreground text-center">+{message.sources.length - 2} more</div>}
																						</div>
																					</div>
																				)}

																				{/* Footer */}
																				<div className="pt-2 border-t border-border/30">
																					<div className="text-xs text-muted-foreground text-center">Message #{message.id.slice(-4)}</div>
																				</div>
																			</div>
																		</ScrollArea>
																	</TooltipContent>
																)}
															</Tooltip>

															{/* Interactive Elements Row - Outside Message Bubble */}
															{isAI && (message.sources || message.mentions || message.researchContext || message.generatedContent) && (
																<div className="mt-3 flex flex-wrap items-center gap-2">
																	{/* Sources Button */}
																	{message.sources && message.sources.length > 0 && (
																		<Popover>
																			<PopoverTrigger asChild>
																				<Button variant="outline" size="sm" className="h-6 px-2 text-xs bg-muted/30 hover:bg-muted/50 border-border/50">
																					<div className="flex items-center gap-1.5">
																						<div className="flex -space-x-1">
																							{message.sources.slice(0, 3).map((source, idx) => (
																								<div key={source.id} className={`w-3 h-3 rounded-full text-xs border border-background ${source.type === "web" ? "bg-blue-500" : source.type === "document" ? "bg-orange-500" : source.type === "video" ? "bg-red-500" : source.type === "image" ? "bg-green-500" : "bg-purple-500"}`} style={{ zIndex: 10 - idx }} />
																							))}
																						</div>
																						<span className="font-medium">{message.sources.length} sources</span>
																					</div>
																				</Button>
																			</PopoverTrigger>
																			<PopoverContent className="w-80 p-3" align="start">
																				<ScrollArea className="max-h-64">
																					<div className="space-y-2">
																						{message.sources.map((source) => (
																							<div key={source.id} className="p-2 bg-muted/20 rounded border border-border/30 hover:bg-muted/40 transition-colors cursor-pointer">
																								<div className="flex items-start gap-2">
																									<div className={`w-5 h-5 rounded flex items-center justify-center text-xs ${source.type === "web" ? "bg-blue-500/20 text-blue-600" : source.type === "document" ? "bg-orange-500/20 text-orange-600" : "bg-purple-500/20 text-purple-600"}`}>{source.type === "web" ? "🌐" : source.type === "document" ? "📄" : "💾"}</div>
																									<div className="flex-1 min-w-0">
																										<h4 className="font-medium text-xs text-foreground truncate">{source.title}</h4>
																										<p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{source.description}</p>
																										<div className="flex items-center gap-2 mt-1">
																											<span className="text-xs text-green-600 font-medium">{Math.round(source.relevance * 100)}%</span>
																											{source.metadata?.author && <span className="text-xs text-muted-foreground">• {source.metadata.author}</span>}
																										</div>
																									</div>
																								</div>
																							</div>
																						))}
																					</div>
																				</ScrollArea>
																			</PopoverContent>
																		</Popover>
																	)}

																	{/* Mentions Compact */}
																	{message.mentions && (
																		<div className="flex items-center gap-1">
																			{message.mentions.users && message.mentions.users.length > 0 && (
																				<Popover>
																					<PopoverTrigger asChild>
																						<Button variant="outline" size="sm" className="h-6 px-2 text-xs bg-blue-500/5 hover:bg-blue-500/10 border-blue-500/30 text-blue-600">
																							@{message.mentions.users.length === 1 ? message.mentions.users[0] : `${message.mentions.users.length} users`}
																						</Button>
																					</PopoverTrigger>
																					<PopoverContent className="w-64 p-2" align="start">
																						<div className="text-xs font-medium mb-2">Users</div>
																						<div className="flex flex-wrap gap-1">
																							{message.mentions.users.map((user) => (
																								<Badge key={user} variant="outline" className="h-5 px-1.5 text-xs bg-blue-500/10 text-blue-600 border-blue-500/30 cursor-pointer hover:bg-blue-500/20">
																									@{user}
																								</Badge>
																							))}
																						</div>
																					</PopoverContent>
																				</Popover>
																			)}
																			{message.mentions.topics && message.mentions.topics.length > 0 && (
																				<Popover>
																					<PopoverTrigger asChild>
																						<Button variant="outline" size="sm" className="h-6 px-2 text-xs bg-blue-500/5 hover:bg-blue-500/10 border-blue-500/30 text-blue-600">
																							{message.mentions.topics.length} topics
																						</Button>
																					</PopoverTrigger>
																					<PopoverContent className="w-64 p-2" align="start">
																						<div className="text-xs font-medium mb-2">Topics</div>
																						<div className="flex flex-wrap gap-1">
																							{message.mentions.topics.map((topic) => (
																								<Badge key={topic} variant="outline" className="h-5 px-1.5 text-xs bg-blue-500/10 text-blue-600 border-blue-500/30 cursor-pointer hover:bg-blue-500/20">
																									{topic}
																								</Badge>
																							))}
																						</div>
																					</PopoverContent>
																				</Popover>
																			)}
																		</div>
																	)}

																	{/* Research Context Compact */}
																	{message.researchContext && (
																		<Popover>
																			<PopoverTrigger asChild>
																				<Button variant="outline" size="sm" className="h-6 px-2 text-xs bg-blue-500/5 hover:bg-blue-500/10 border-blue-500/30 text-blue-600">
																					{message.researchContext.searchResults} results • {message.researchContext.searchTime}s
																				</Button>
																			</PopoverTrigger>
																			<PopoverContent className="w-72 p-3" align="start">
																				<div className="space-y-2">
																					<div className="text-xs font-medium">Research Context</div>
																					<div className="text-xs">
																						<div>
																							<strong>Query:</strong> {message.researchContext.query}
																						</div>
																						<div className="mt-1">
																							<strong>Results:</strong> {message.researchContext.searchResults} sources • {message.researchContext.searchTime}s
																						</div>
																					</div>
																					{message.researchContext.filters && message.researchContext.filters.length > 0 && (
																						<div>
																							<div className="text-xs font-medium mb-1">Filters:</div>
																							<div className="flex flex-wrap gap-1">
																								{message.researchContext.filters.map((filter) => (
																									<Badge key={filter} variant="outline" className="h-4 px-1 text-xs bg-blue-500/10 text-blue-600 border-blue-500/30">
																										{filter}
																									</Badge>
																								))}
																							</div>
																						</div>
																					)}
																					{message.researchContext.relatedTopics && message.researchContext.relatedTopics.length > 0 && (
																						<div>
																							<div className="text-xs font-medium mb-1">Topics:</div>
																							<div className="flex flex-wrap gap-1">
																								{message.researchContext.relatedTopics.slice(0, 5).map((topic) => (
																									<Badge key={topic} variant="outline" className="h-4 px-1 text-xs bg-blue-500/10 text-blue-600 border-blue-500/30">
																										{topic}
																									</Badge>
																								))}
																								{message.researchContext.relatedTopics.length > 5 && (
																									<Badge variant="outline" className="h-4 px-1 text-xs bg-muted/50 text-muted-foreground border-border/50">
																										+{message.researchContext.relatedTopics.length - 5}
																									</Badge>
																								)}
																							</div>
																						</div>
																					)}
																				</div>
																			</PopoverContent>
																		</Popover>
																	)}

																	{/* Generated Content Tool Button */}
																	{message.generatedContent && (
																		<Popover>
																			<PopoverTrigger asChild>
																				<Button variant="outline" size="sm" className="h-6 px-2 text-xs bg-blue-500/5 hover:bg-blue-500/10 border-blue-500/30 text-blue-600">
																					{message.generatedContent.type === "image" && <ImageIcon className="h-3 w-3 mr-1" />}
																					{message.generatedContent.type === "video" && <Video className="h-3 w-3 mr-1" />}
																					{message.generatedContent.type === "code" && <Code className="h-3 w-3 mr-1" />}
																					{message.generatedContent.type === "data" && <BarChart3 className="h-3 w-3 mr-1" />}
																					{message.generatedContent.type}
																				</Button>
																			</PopoverTrigger>
																			<PopoverContent className="w-80 p-3" align="start">
																				<div className="space-y-2">
																					<div className="text-xs font-medium mb-2">Generated {message.generatedContent.type}</div>
																					{message.generatedContent.type === "image" && message.generatedContent.url && <img src={message.generatedContent.url} alt="Generated" className="w-full rounded border" />}
																					{message.generatedContent.type === "video" && message.generatedContent.url && <video src={message.generatedContent.url} controls className="w-full rounded border" />}
																					{(message.generatedContent.type === "code" || message.generatedContent.type === "data") && message.generatedContent.content && (
																						<pre className="bg-muted/50 p-2 rounded text-xs font-mono overflow-x-auto">
																							<code>{message.generatedContent.content}</code>
																						</pre>
																					)}
																					{message.generatedContent.metadata?.prompt && (
																						<div className="text-xs text-muted-foreground">
																							<strong>Prompt:</strong> {message.generatedContent.metadata.prompt}
																						</div>
																					)}
																				</div>
																			</PopoverContent>
																		</Popover>
																	)}
																</div>
															)}

															{/* AI Logs */}
															{isAI && aiLogsVisible && message.aiLogs && (
																<div className="mt-3">
																	<Button variant="ghost" size="sm" className="h-7 px-3 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50" onClick={() => toggleMessageExpansion(message.id)}>
																		{isExpanded ? <ChevronUp className="h-3 w-3 mr-1.5" /> : <ChevronDown className="h-3 w-3 mr-1.5" />}
																		AI Logs ({message.aiLogs.length} steps)
																	</Button>

																	{isExpanded && (
																		<div className="mt-3 p-3 bg-muted/30 border border-border/30 rounded-lg text-xs">
																			<div className="space-y-3">
																				{message.aiLogs.map((log, index) => (
																					<div key={index} className="p-3 bg-card/50 rounded-lg border border-border/20">
																						<div className="flex items-center justify-between mb-2">
																							<span className="font-medium text-foreground">{log.step}</span>
																							<span className="text-muted-foreground">{log.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</span>
																						</div>
																						<p className="text-muted-foreground mb-2">{log.thought}</p>
																						<div className="flex items-center gap-2">
																							<span className="text-muted-foreground">Confidence:</span>
																							<div className="flex-1 bg-muted rounded-full h-1.5">
																								<div className="bg-blue-500 h-1.5 rounded-full transition-all duration-300" style={{ width: `${log.confidence * 100}%` }}></div>
																							</div>
																							<span className="text-xs text-muted-foreground">{Math.round(log.confidence * 100)}%</span>
																						</div>
																					</div>
																				))}
																			</div>
																		</div>
																	)}
																</div>
															)}

															<div className={`flex items-center gap-2 mt-2 text-xs text-muted-foreground ${!isAI ? "justify-end" : ""}`}>
																<span>{message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
															</div>
														</div>
													</div>
												);
											})}
											<div ref={messagesEndRef} />
										</div>
									</div>

									{/* Fixed Input Bar */}
									<div className="sticky bottom-0 left-0 w-full z-10 bg-gradient-to-t from-background via-background/90 to-transparent pt-6 pb-2 px-6 border-t border-border/50 backdrop-blur-sm">
										<div className="max-w-4xl mx-auto">
											{/* Tool Selection Bar */}
											<div className="flex items-center gap-2 mb-3">
												<Popover open={showToolPicker} onOpenChange={setShowToolPicker}>
													<PopoverTrigger asChild>
														<Button variant="outline" size="sm" className="h-8 px-3 text-xs bg-background/50 border-border/50 hover:bg-muted/50">
															<Zap className="h-3 w-3 mr-1.5" />
															AI Tools
														</Button>
													</PopoverTrigger>
													<PopoverContent className="w-80 p-0" align="start">
														<Command>
															<CommandInput placeholder="Search AI tools..." />
															<CommandList>
																<CommandEmpty>No tools found.</CommandEmpty>
																<CommandGroup heading="AI Tools">
																	{availableTools.map((tool) => (
																		<CommandItem
																			key={tool.id}
																			onSelect={() => {
																				setSelectedTool(tool.id);
																				setShowToolPicker(false);
																				setInputMode(tool.id as "text" | "math" | "code" | "image" | "video" | "audio");
																			}}
																		>
																			<tool.icon className="h-4 w-4 mr-2 text-muted-foreground" />
																			<div className="flex-1">
																				<div className="font-medium">{tool.name}</div>
																				<div className="text-xs text-muted-foreground">{tool.description}</div>
																			</div>
																			<Switch
																				checked={aiTools[tool.id as keyof typeof aiTools]}
																				onCheckedChange={(checked) => {
																					setAiTools((prev) => ({ ...prev, [tool.id]: checked }));
																				}}
																				className="ml-2"
																			/>
																		</CommandItem>
																	))}
																</CommandGroup>
															</CommandList>
														</Command>
													</PopoverContent>
												</Popover>

												<Popover open={showCommandPalette} onOpenChange={setShowCommandPalette}>
													<PopoverTrigger asChild>
														<Button variant="outline" size="sm" className="h-8 px-3 text-xs bg-background/50 border-border/50 hover:bg-muted/50">
															<Hash className="h-3 w-3 mr-1.5" />
															Commands
														</Button>
													</PopoverTrigger>
													<PopoverContent className="w-80 p-0" align="start">
														<Command>
															<CommandInput placeholder="Type / for commands..." />
															<CommandList>
																<CommandEmpty>No commands found.</CommandEmpty>
																<CommandGroup heading="Slash Commands">
																	{slashCommands.map((cmd) => (
																		<CommandItem
																			key={cmd.command}
																			onSelect={() => {
																				setInputValue(cmd.command + " ");
																				setShowCommandPalette(false);
																			}}
																		>
																			<cmd.icon className="h-4 w-4 mr-2 text-muted-foreground" />
																			<div className="flex-1">
																				<div className="font-medium">{cmd.command}</div>
																				<div className="text-xs text-muted-foreground">{cmd.description}</div>
																			</div>
																		</CommandItem>
																	))}
																</CommandGroup>
															</CommandList>
														</Command>
													</PopoverContent>
												</Popover>

												{/* Input Mode Indicators */}
												{inputMode !== "text" && (
													<Badge variant="secondary" className="text-xs">
														{inputMode.toUpperCase()} MODE
													</Badge>
												)}

												{selectedTool && (
													<Badge variant="outline" className="text-xs">
														{availableTools.find((t) => t.id === selectedTool)?.name}
													</Badge>
												)}
											</div>

											{/* File Upload Preview */}
											{uploadedFiles.length > 0 && (
												<div className="mb-3 p-3 bg-card/30 backdrop-blur-sm border border-border/20 rounded-xl">
													<div className="flex items-center gap-2 mb-2">
														<Paperclip className="h-4 w-4 text-muted-foreground" />
														<span className="text-sm font-medium text-foreground">
															{uploadedFiles.length} file{uploadedFiles.length > 1 ? "s" : ""} ready to send
														</span>
													</div>
													<div className="flex flex-wrap gap-2">
														{(showAllFiles ? uploadedFiles : uploadedFiles.slice(0, 2)).map((file) => (
															<div key={file.id} className="group relative flex items-center gap-2 p-2 bg-background/50 border border-border/30 rounded-lg hover:bg-background/70 transition-colors">
																{/* File Preview with Loading State */}
																<div className="w-10 h-10 rounded-md overflow-hidden bg-muted/30 flex-shrink-0 relative">
																	{file.isLoading ? (
																		<div className="w-full h-full flex items-center justify-center">
																			<div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
																		</div>
																	) : file.type.startsWith("image/") ? (
																		<img src={file.url} alt={file.name} className="w-full h-full object-cover" />
																	) : file.type.startsWith("video/") ? (
																		<div className="w-full h-full flex items-center justify-center">
																			<Video className="h-5 w-5 text-muted-foreground" />
																		</div>
																	) : (
																		<div className="w-full h-full flex items-center justify-center">
																			<FileText className="h-5 w-5 text-muted-foreground" />
																		</div>
																	)}
																</div>

																{/* File Info - Only show size, not name */}
																<div className="flex-1 min-w-0">
																	<p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
																</div>

																{/* Remove Button */}
																<Button variant="ghost" size="sm" className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeUploadedFile(file.id)} disabled={file.isLoading}>
																	<X className="h-3 w-3" />
																</Button>
															</div>
														))}

														{/* Show More/Less Button */}
														{uploadedFiles.length > 2 && (
															<div className="group relative flex items-center gap-2 p-2 bg-background/50 border border-border/30 rounded-lg hover:bg-background/70 transition-colors cursor-pointer" onClick={() => setShowAllFiles(!showAllFiles)}>
																{/* Icon/Indicator */}
																<div className="w-10 h-10 rounded-md bg-muted/30 flex-shrink-0 flex items-center justify-center">{showAllFiles ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}</div>

																{/* Button Info */}
																<div className="flex-1 min-w-0">
																	<p className="text-xs text-muted-foreground">{showAllFiles ? "Show Less" : `+${uploadedFiles.length - 2} more files`}</p>
																</div>

																{/* Action Indicator */}
																<div className="opacity-0 group-hover:opacity-100 transition-opacity">
																	<ArrowRight className="h-3 w-3 text-muted-foreground" />
																</div>
															</div>
														)}
													</div>
												</div>
											)}

											{/* Modern Minimal Input Area */}
											<div className={`flex items-center gap-2 bg-card/50 backdrop-blur-sm border rounded-2xl p-2 shadow-lg hover:shadow-xl transition-all duration-300 ${isDragOver ? "border-primary/50 bg-primary/5 border-dashed" : "border-border/30"}`} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
												{/* Compact Tool Buttons */}
												<div className="flex items-center gap-1">
													<Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
														<PopoverTrigger asChild>
															<Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-xl hover:bg-muted/50 transition-colors">
																<Smile className="h-4 w-4 text-muted-foreground" />
															</Button>
														</PopoverTrigger>
														<PopoverContent className="w-80 p-0" align="start">
															<ScrollArea className="h-64">
																<div className="p-3">
																	{emojiCategories.map((category) => (
																		<div key={category.name} className="mb-4">
																			<h4 className="text-sm font-medium mb-2 text-foreground">{category.name}</h4>
																			<div className="grid grid-cols-10 gap-1">
																				{category.emojis.map((emoji) => (
																					<button
																						key={emoji}
																						className="w-8 h-8 rounded hover:bg-muted/50 flex items-center justify-center text-lg"
																						onClick={() => {
																							setInputValue((prev) => prev + emoji);
																							setShowEmojiPicker(false);
																						}}
																					>
																						{emoji}
																					</button>
																				))}
																			</div>
																		</div>
																	))}
																</div>
															</ScrollArea>
														</PopoverContent>
													</Popover>

													<Button
														variant="ghost"
														size="sm"
														className="h-9 w-9 p-0 rounded-xl hover:bg-muted/50 transition-colors"
														onClick={() => {
															const input = document.createElement("input");
															input.type = "file";
															input.accept = "image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.xlsx,.pptx";
															input.multiple = true;
															input.onchange = (e) => {
																const files = (e.target as HTMLInputElement).files;
																if (files && files.length > 0) {
																	handleFileUpload(files);
																}
															};
															input.click();
														}}
													>
														<Paperclip className="h-4 w-4 text-muted-foreground" />
													</Button>

													<Button variant="ghost" size="sm" className={`h-9 w-9 p-0 rounded-xl transition-all ${isRecording ? "bg-red-500/20 text-red-500 hover:bg-red-500/30" : "hover:bg-muted/50 text-muted-foreground"}`} onClick={() => setIsRecording(!isRecording)}>
														<Mic className="h-4 w-4" />
													</Button>

													{inputMode !== "text" && (
														<Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors" onClick={() => setInputMode("text")}>
															{inputMode === "math" && <Calculator className="h-4 w-4" />}
															{inputMode === "code" && <Code className="h-4 w-4" />}
														</Button>
													)}
												</div>

												{/* Main Input */}
												<div className="flex-1 relative">
													{inputMode === "math" ? (
														<Textarea
															value={inputValue}
															onChange={(e) => setInputValue(e.target.value)}
															onKeyDown={(e) => {
																if (e.key === "Enter" && !e.shiftKey) {
																	e.preventDefault();
																	handleSendMessage();
																}
															}}
															placeholder="Enter mathematical expression..."
															disabled={isLoading}
															className="min-h-10 rounded-xl bg-transparent border-0 px-3 py-2 text-sm placeholder:text-muted-foreground/60 focus:outline-none resize-none font-mono"
															autoFocus
														/>
													) : inputMode === "code" ? (
														<Textarea
															value={inputValue}
															onChange={(e) => setInputValue(e.target.value)}
															onKeyDown={(e) => {
																if (e.key === "Enter" && !e.shiftKey) {
																	e.preventDefault();
																	handleSendMessage();
																}
															}}
															placeholder="Write code here..."
															disabled={isLoading}
															className="min-h-10 rounded-xl bg-transparent border-0 px-3 py-2 text-sm placeholder:text-muted-foreground/60 focus:outline-none resize-none font-mono"
															autoFocus
														/>
													) : (
														<Input
															value={inputValue}
															onChange={(e) => setInputValue(e.target.value)}
															onKeyDown={(e) => {
																if (e.key === "Enter" && !e.shiftKey) {
																	e.preventDefault();
																	handleSendMessage();
																}
																if (e.key === "/" && inputValue === "") {
																	setShowCommandPalette(true);
																}
															}}
															placeholder="Type your message..."
															disabled={isLoading}
															className="h-10 rounded-xl bg-transparent border-0 px-3 py-2 text-sm placeholder:text-muted-foreground/60 focus:outline-none"
															autoFocus
														/>
													)}

													{/* Upload Progress */}
													{isUploading && (
														<div className="absolute bottom-0 left-0 right-0 h-0.5 bg-muted/30 rounded-b-xl overflow-hidden">
															<div className="h-full bg-primary transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
														</div>
													)}

													{/* Recording Indicator */}
													{isRecording && <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>}
												</div>

												{/* Mode Toggle */}
												{inputMode === "text" && (
													<Popover>
														<PopoverTrigger asChild>
															<Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-xl hover:bg-muted/50 transition-colors">
																<Calculator className="h-4 w-4 text-muted-foreground" />
															</Button>
														</PopoverTrigger>
														<PopoverContent className="w-48 p-1" align="end">
															<div className="space-y-1">
																<Button
																	variant="ghost"
																	size="sm"
																	className="w-full justify-start"
																	onClick={() => {
																		setInputMode("math");
																	}}
																>
																	<Calculator className="h-4 w-4 mr-2" />
																	Math Mode
																</Button>
																<Button
																	variant="ghost"
																	size="sm"
																	className="w-full justify-start"
																	onClick={() => {
																		setInputMode("code");
																	}}
																>
																	<Code className="h-4 w-4 mr-2" />
																	Code Mode
																</Button>
															</div>
														</PopoverContent>
													</Popover>
												)}

												{/* Send Button */}
												<Button onClick={handleSendMessage} disabled={!inputValue.trim() || isLoading} size="sm" className="h-9 w-9 rounded-xl flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-600 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200">
													{isLoading ? <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Send className="h-4 w-4" />}
												</Button>
											</div>

											{/* Input Status Bar */}
											<div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
												<div className="flex items-center gap-4">
													<span>Press Enter to send</span>
													{inputMode !== "text" && (
														<span className="flex items-center gap-1">
															<Sparkles className="h-3 w-3" />
															{inputMode.toUpperCase()} mode active
														</span>
													)}
													{selectedTool && (
														<span className="flex items-center gap-1">
															<Lightbulb className="h-3 w-3" />
															{availableTools.find((t) => t.id === selectedTool)?.name} enabled
														</span>
													)}
												</div>
												<div className="flex items-center gap-4">
													<span>{messages.length} total messages</span>
													<span>{(debate.viewerCount || 1234).toLocaleString()} viewers</span>
												</div>
											</div>
										</div>
									</div>
								</div>
							)}

							{/* Audio View */}
							{currentView === "audio" && (
								<div className="h-full bg-gradient-to-br from-background via-background to-muted/20 p-6">
									<div className="flex items-center justify-center h-full">
										<div className="text-center max-w-md">
											<div className="p-4 bg-primary/10 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
												<Volume2 className="h-10 w-10 text-primary" />
											</div>
											<h3 className="text-xl font-semibold mb-3 text-foreground">Audio View</h3>
											<p className="text-muted-foreground leading-relaxed">Experience the debate through high-quality audio streaming with real-time voice synthesis and natural language processing.</p>
											<div className="mt-6 flex items-center justify-center gap-4">
												<Button variant="outline" size="sm" className="rounded-lg">
													<Mic className="h-4 w-4 mr-2" />
													Enable Audio
												</Button>
												<Button variant="outline" size="sm" className="rounded-lg">
													<Headphones className="h-4 w-4 mr-2" />
													Audio Settings
												</Button>
											</div>
										</div>
									</div>
								</div>
							)}

							{/* 3D View */}
							{currentView === "3d" && (
								<div className="h-full bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-indigo-900/20 relative overflow-hidden">
									<div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-blue-500/5 to-indigo-500/5"></div>
									<div className="relative flex items-center justify-center h-full p-6">
										<div className="text-center max-w-md">
											<div className="p-4 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center backdrop-blur-sm border border-purple-500/30">
												<Box className="h-10 w-10 text-purple-400" />
											</div>
											<h3 className="text-xl font-semibold mb-3 text-foreground">3D View</h3>
											<p className="text-muted-foreground leading-relaxed">Immerse yourself in a three-dimensional visualization of the debate with spatial audio and interactive elements.</p>
											<div className="mt-6 flex items-center justify-center gap-4">
												<Button variant="outline" size="sm" className="rounded-lg border-purple-500/30 text-purple-600 hover:bg-purple-500/10">
													<Maximize2 className="h-4 w-4 mr-2" />
													Enter 3D
												</Button>
												<Button variant="outline" size="sm" className="rounded-lg">
													<Settings className="h-4 w-4 mr-2" />
													3D Settings
												</Button>
											</div>
										</div>
									</div>
								</div>
							)}
						</div>
					</SidebarInset>

					{/* Right Sidebar - Live Chat */}
					{rightSidebarOpen && (
						<Sidebar side="right" collapsible="offcanvas" className="border-l border-border/50 bg-card/50 backdrop-blur-sm">
							<SidebarHeader className="border-b border-border/50 p-4 bg-card/80">
								<div className="flex items-center gap-2">
									<div className="p-1.5 bg-primary/10 rounded-lg">
										<MessageCircle className="h-4 w-4 text-primary" />
									</div>
									<h2 className="font-semibold text-foreground">Live Chat</h2>
									<Badge variant="outline" className="text-xs border-green-500/50 text-green-600 bg-green-500/10 ml-auto">
										{(debate.viewerCount || 1234).toLocaleString()} online
									</Badge>
								</div>
							</SidebarHeader>
							<SidebarContent>
								{/* Chat Messages */}
								<div className="flex-1 min-h-0 p-3 overflow-hidden">
									<div className="h-full overflow-y-auto pr-2 space-y-3">
										{chatMessages.map((message) => {
											const isUser = message.senderId === "current-user";
											return (
												<div key={message.id} className={`flex gap-2 ${isUser ? "justify-end" : ""}`}>
													{!isUser && (
														<Avatar className="h-6 w-6 ring-1 ring-border flex-shrink-0">
															<AvatarFallback className="bg-secondary text-secondary-foreground text-xs font-medium">{message.senderName.charAt(0)}</AvatarFallback>
														</Avatar>
													)}

													<div className={`flex-1 max-w-48 ${isUser ? "order-first" : ""}`}>
														{!isUser && (
															<div className="flex items-center gap-1 mb-1">
																<span className="font-medium text-xs text-foreground">{message.senderName}</span>
															</div>
														)}

														<div className={`p-2.5 rounded-lg text-xs shadow-sm ${isUser ? "bg-zinc-900 dark:bg-zinc-800 text-zinc-100 border border-zinc-700 ml-auto" : "bg-muted/50 border border-border/30"}`}>
															<div className="leading-relaxed whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: processContent(message.content) }} />
														</div>

														<div className={`flex items-center gap-2 mt-1 text-xs text-muted-foreground ${isUser ? "justify-end" : ""}`}>
															<span>{message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
														</div>
													</div>
												</div>
											);
										})}
									</div>
								</div>

								{/* Topic Change Proposal */}
								{topicChangeProposal?.active && (
									<div className="p-3 border-t border-border/50 bg-yellow-500/10 border-yellow-500/20">
										<div className="text-xs space-y-2">
											<div className="font-medium text-yellow-600">Topic Change Proposal</div>
											<div className="text-foreground">&ldquo;{topicChangeProposal.proposedTopic}&rdquo;</div>
											<div className="text-muted-foreground">
												by {topicChangeProposal.proposedBy} • {topicChangeProposal.currentVotes}/{topicChangeProposal.totalVoters} votes ({Math.round((topicChangeProposal.currentVotes / topicChangeProposal.totalVoters) * 100)}%)
											</div>
											{!hasVotedForTopicChange && (
												<div className="flex gap-2 mt-2">
													<Button onClick={() => voteForTopicChange(true)} size="sm" variant="outline" className="h-6 px-2 text-xs border-green-500/50 text-green-600 hover:bg-green-500/10">
														Support
													</Button>
													<Button onClick={() => voteForTopicChange(false)} size="sm" variant="outline" className="h-6 px-2 text-xs border-red-500/50 text-red-600 hover:bg-red-500/10">
														Oppose
													</Button>
												</div>
											)}
										</div>
									</div>
								)}

								{/* Chat Input */}
								<div className="p-4 border-t border-border/30">
									<div className="flex gap-2">
										<Input value={chatInputValue} onChange={(e) => setChatInputValue(e.target.value)} onKeyPress={handleChatKeyPress} placeholder={aiCooldownTimer > 0 ? `AI cooldown: ${aiCooldownTimer}s` : "Type a message..."} className="flex-1 h-10 bg-background/50 border-border/30 focus:border-primary/50 text-sm rounded-xl" disabled={aiCooldownTimer > 0 && chatInputValue.toLowerCase().startsWith("@")} maxLength={debate.rules?.maxMessageLength || 500} />
										<Button onClick={handleSendChatMessage} disabled={!chatInputValue.trim()} size="sm" className="h-10 w-10 p-0 bg-primary hover:bg-primary/90 rounded-xl">
											<Send className="h-4 w-4" />
										</Button>
									</div>

									{aiCooldownTimer > 0 && <div className="mt-2 text-xs text-muted-foreground text-center">AI cooldown: {aiCooldownTimer}s remaining</div>}
								</div>
							</SidebarContent>
						</Sidebar>
					)}
				</div>
			</SidebarProvider>

			{/* Debate Rules Modal */}
			{showRulesModal && (
				<div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
					<div className="bg-card border border-border rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
						<div className="text-center">
							<div className="flex items-center justify-center mb-4">
								<div className="p-3 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-full">
									<Settings className="h-8 w-8 text-primary" />
								</div>
							</div>

							<h2 className="text-xl font-bold text-foreground mb-2">Debate Rules</h2>
							<p className="text-muted-foreground mb-6 leading-relaxed">Community guidelines to ensure productive and respectful discussions.</p>

							<div className="space-y-4 mb-6 text-left">
								<div className="flex items-start gap-3">
									<div className="w-5 h-5 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
										<div className="w-2 h-2 bg-blue-500 rounded-full"></div>
									</div>
									<div>
										<span className="text-sm font-medium text-foreground">Message Length</span>
										<p className="text-xs text-muted-foreground">Maximum {debate.rules?.maxMessageLength || 500} characters per message</p>
									</div>
								</div>
								<div className="flex items-start gap-3">
									<div className="w-5 h-5 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
										<div className="w-2 h-2 bg-blue-500 rounded-full"></div>
									</div>
									<div>
										<span className="text-sm font-medium text-foreground">Cooldown Period</span>
										<p className="text-xs text-muted-foreground">{debate.rules?.cooldownBetweenMessages || 10} seconds between messages</p>
									</div>
								</div>
								<div className="flex items-start gap-3">
									<div className="w-5 h-5 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
										<div className="w-2 h-2 bg-blue-500 rounded-full"></div>
									</div>
									<div>
										<span className="text-sm font-medium text-foreground">Topic Changes</span>
										<p className="text-xs text-muted-foreground">Requires {debate.rules?.topicChangeVoteThreshold || 60}% community approval</p>
									</div>
								</div>
								<div className="flex items-start gap-3">
									<div className="w-5 h-5 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
										<div className="w-2 h-2 bg-blue-500 rounded-full"></div>
									</div>
									<div>
										<span className="text-sm font-medium text-foreground">Stay On Topic</span>
										<p className="text-xs text-muted-foreground">Keep discussions relevant to the current debate topic</p>
									</div>
								</div>
							</div>

							<Button variant="outline" onClick={() => setShowRulesModal(false)} className="w-full">
								Got it
							</Button>
						</div>
					</div>
				</div>
			)}
		</TooltipProvider>
	);
}
