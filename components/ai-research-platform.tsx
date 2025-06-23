"use client";

import { useState } from "react";
import { MultiAgentDebate } from "./multi-agent-debate";

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
}

interface Debate {
	id: string;
	title: string;
	description: string;
	aiParticipants: string[];
	humanParticipants: Array<{
		id: string;
		name: string;
		avatar: string;
		isOnline: boolean;
		joinTime: Date;
		messageCount: number;
		role: string;
	}>;
	status: string;
	messages: number;
	context: string;
	topic: string;
	currentPhase: string;
	keyQuestions: string[];
	researchAreas: string[];
	maxParticipants: number;
	isPublic: boolean;
}

const mockAgents: AIAgent[] = [
	{
		id: "1",
		name: "Claude",
		avatar: "/claude-avatar-new.svg",
		description: "Research Assistant",
		model: "Claude-3.5-Sonnet",
		isOnline: true,
		expertise: ["Academic Research", "Scientific Analysis", "Ethics", "Philosophy"],
		personality: "Scholarly and analytical, values evidence-based reasoning",
		debateStyle: "Methodical and thorough, builds arguments step by step",
	},
	{
		id: "2",
		name: "GPT-4",
		avatar: "/gpt-avatar-new.png",
		description: "Creative Collaborator",
		model: "GPT-4o",
		isOnline: true,
		expertise: ["Creative Problem Solving", "Innovation", "Interdisciplinary Thinking", "Storytelling"],
		personality: "Imaginative and innovative, explores unconventional solutions",
		debateStyle: "Creative and expansive, connects unexpected ideas",
	},
	{
		id: "3",
		name: "Gemini",
		avatar: "/gemini-avatar-new.png",
		description: "Multimodal Expert",
		model: "Gemini Pro",
		isOnline: false,
		expertise: ["Multimodal Analysis", "Data Visualization", "Pattern Recognition", "Cross-modal Understanding"],
		personality: "Comprehensive and thorough, excels at connecting different types of information",
		debateStyle: "Holistic and integrative, sees patterns across domains",
	},
	{
		id: "4",
		name: "Mistral",
		avatar: "/mistral-avatar-new.png",
		description: "Technical Specialist",
		model: "Mistral Large",
		isOnline: true,
		expertise: ["Technical Implementation", "System Architecture", "Programming", "Engineering"],
		personality: "Precise and practical, focuses on actionable technical solutions",
		debateStyle: "Practical and solution-oriented, focuses on implementation",
	},
];

const debateTopics: Debate[] = [
	{
		id: "1",
		title: "AI Ethics & Regulation",
		description: "Balancing innovation with safety in AI development",
		aiParticipants: ["1", "2", "3", "4"],
		humanParticipants: [
			{
				id: "user1",
				name: "Alex Chen",
				avatar: "",
				isOnline: true,
				joinTime: new Date(Date.now() - 300000),
				messageCount: 5,
				role: "participant",
			},
			{
				id: "user2",
				name: "Sarah Johnson",
				avatar: "",
				isOnline: true,
				joinTime: new Date(Date.now() - 600000),
				messageCount: 3,
				role: "participant",
			},
		],
		status: "active",
		messages: 47,
		context: "A deep discussion about the ethical implications of AI development, including regulation, safety measures, and the balance between innovation and responsibility.",
		topic: "AI Ethics & Regulation",
		currentPhase: "Deep Discussion",
		keyQuestions: ["How should AI be regulated?", "What are the risks vs benefits?", "Who should control AI development?"],
		researchAreas: ["AI Safety", "Policy Making", "Ethics"],
		maxParticipants: 20,
		isPublic: true,
	},
	{
		id: "2",
		title: "Climate Change Solutions",
		description: "Most effective approaches to addressing climate change",
		aiParticipants: ["1", "2", "4"],
		humanParticipants: [
			{
				id: "user3",
				name: "Dr. Maria Rodriguez",
				avatar: "",
				isOnline: true,
				joinTime: new Date(Date.now() - 900000),
				messageCount: 8,
				role: "expert",
			},
		],
		status: "active",
		messages: 32,
		context: "Exploring various strategies for combating climate change, from technological solutions to policy changes and individual actions.",
		topic: "Climate Change Solutions",
		currentPhase: "Solution Exploration",
		keyQuestions: ["What technologies are most promising?", "How can we implement changes?", "What role should governments play?"],
		researchAreas: ["Renewable Energy", "Policy", "Technology"],
		maxParticipants: 15,
		isPublic: true,
	},
	{
		id: "3",
		title: "Social Media Impact",
		description: "How social media has changed society and human interaction",
		aiParticipants: ["2", "3", "4"],
		humanParticipants: [],
		status: "active",
		messages: 18,
		context: "Analyzing the profound effects of social media on human behavior, relationships, and societal structures.",
		topic: "Social Media Impact",
		currentPhase: "Opening Arguments",
		keyQuestions: ["Is social media beneficial or harmful?", "How has it changed relationships?", "What should be regulated?"],
		researchAreas: ["Psychology", "Sociology", "Technology"],
		maxParticipants: 12,
		isPublic: true,
	},
	{
		id: "4",
		title: "Future of Education",
		description: "How AI and technology will transform learning",
		aiParticipants: ["1", "2", "3"],
		humanParticipants: [
			{
				id: "user4",
				name: "Prof. James Wilson",
				avatar: "",
				isOnline: false,
				joinTime: new Date(Date.now() - 1800000),
				messageCount: 12,
				role: "moderator",
			},
		],
		status: "active",
		messages: 56,
		context: "Discussing the evolution of education through AI, personalized learning, and the changing role of teachers and institutions.",
		topic: "Future of Education",
		currentPhase: "Advanced Discussion",
		keyQuestions: ["Will AI replace teachers?", "How will learning change?", "What skills will be most important?"],
		researchAreas: ["Education Technology", "AI in Education", "Learning Science"],
		maxParticipants: 25,
		isPublic: true,
	},
	{
		id: "5",
		title: "Space Exploration Ethics",
		description: "Moral considerations in space colonization and exploration",
		aiParticipants: ["1", "3", "4"],
		humanParticipants: [],
		status: "active",
		messages: 23,
		context: "Examining the ethical dimensions of space exploration, including resource allocation, environmental impact, and human rights in space.",
		topic: "Space Exploration Ethics",
		currentPhase: "Opening Arguments",
		keyQuestions: ["Should we colonize space?", "Who owns space resources?", "What are the ethical implications?"],
		researchAreas: ["Space Law", "Ethics", "Astrobiology"],
		maxParticipants: 18,
		isPublic: true,
	},
];

export function AIResearchPlatform() {
	const [selectedDebate] = useState<Debate | null>(debateTopics[0]);

	// Convert the debate format to match what MultiAgentDebate expects
	const debateForMultiAgent = selectedDebate
		? {
				id: selectedDebate.id,
				title: selectedDebate.title,
				description: selectedDebate.description,
				topic: selectedDebate.topic,
				status: selectedDebate.status,
				messages: selectedDebate.messages,
				context: selectedDebate.context,
				currentPhase: selectedDebate.currentPhase,
				viewerCount: 847,
				peakViewers: 1247,
				streamDuration: 0,
				isLive: true,
		  }
		: null;

	const agentsForMultiAgent = mockAgents.filter((agent) => selectedDebate?.aiParticipants.includes(agent.id));

	return (
		<div className="h-screen w-full">
			{selectedDebate && debateForMultiAgent ? (
				<MultiAgentDebate debate={debateForMultiAgent} agents={agentsForMultiAgent} />
			) : (
				<div className="flex-1 flex items-center justify-center">
					<div className="text-center">
						<h2 className="text-lg font-semibold text-foreground/90 mb-2">No Debate Selected</h2>
						<p className="text-sm text-muted-foreground/70">Please select a debate to begin</p>
					</div>
				</div>
			)}
		</div>
	);
}
