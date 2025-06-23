import { openai } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";
import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { NextRequest } from "next/server";

const debateConfigs = {
	"1": {
		// AI Ethics Debate
		title: "The Future of AI Ethics",
		description: "Should AI development be regulated? How do we balance innovation with safety?",
		participants: [
			{
				id: "1",
				name: "Claude",
				model: anthropic("claude-3.5-sonnet-20241022"),
				expertise: "Academic Research, Ethics, Philosophy",
				personality: "Scholarly and analytical, values evidence-based reasoning",
				perspective: "Focuses on ethical frameworks and long-term societal implications",
			},
			{
				id: "2",
				name: "GPT-4",
				model: openai("gpt-4o"),
				expertise: "Creative Problem Solving, Innovation",
				personality: "Imaginative and innovative, explores unconventional solutions",
				perspective: "Emphasizes creative approaches and technological possibilities",
			},
			{
				id: "3",
				name: "Gemini",
				model: google("gemini-1.5-pro"),
				expertise: "Multimodal Analysis, Data Visualization",
				personality: "Comprehensive and thorough, excels at connecting different types of information",
				perspective: "Focuses on data-driven insights and comprehensive analysis",
			},
			{
				id: "4",
				name: "Mistral",
				model: openai("gpt-4o"), // Using GPT-4 as fallback
				expertise: "Technical Implementation, System Architecture",
				personality: "Precise and practical, focuses on actionable technical solutions",
				perspective: "Emphasizes practical implementation and technical feasibility",
			},
		],
	},
	"2": {
		// Climate Change Debate
		title: "Climate Change Solutions",
		description: "What are the most effective approaches to addressing climate change?",
		participants: [
			{
				id: "1",
				name: "Claude",
				model: anthropic("claude-3.5-sonnet-20241022"),
				expertise: "Scientific Analysis, Research",
				personality: "Scholarly and analytical",
				perspective: "Focuses on scientific evidence and research-based solutions",
			},
			{
				id: "2",
				name: "GPT-4",
				model: openai("gpt-4o"),
				expertise: "Creative Problem Solving, Innovation",
				personality: "Imaginative and innovative",
				perspective: "Explores creative and innovative approaches to climate solutions",
			},
			{
				id: "4",
				name: "Mistral",
				model: openai("gpt-4o"),
				expertise: "Technical Implementation, Engineering",
				personality: "Precise and practical",
				perspective: "Focuses on technical implementation and engineering solutions",
			},
		],
	},
	"3": {
		// Social Media Impact Debate
		title: "The Impact of Social Media",
		description: "How has social media changed society and human interaction?",
		participants: [
			{
				id: "2",
				name: "GPT-4",
				model: openai("gpt-4o"),
				expertise: "Creative Analysis, Social Trends",
				personality: "Imaginative and innovative",
				perspective: "Explores creative interpretations and social dynamics",
			},
			{
				id: "3",
				name: "Gemini",
				model: google("gemini-1.5-pro"),
				expertise: "Data Analysis, Pattern Recognition",
				personality: "Comprehensive and thorough",
				perspective: "Focuses on data-driven analysis of social media impact",
			},
			{
				id: "4",
				name: "Mistral",
				model: openai("gpt-4o"),
				expertise: "Technical Systems, Architecture",
				personality: "Precise and practical",
				perspective: "Analyzes technical aspects and system design implications",
			},
		],
	},
};

export async function POST(request: NextRequest, { params }: { params: Promise<{ debateId: string }> }) {
	const { messages } = await request.json();
	const { debateId } = await params;
	const debateConfig = debateConfigs[debateId as keyof typeof debateConfigs];

	if (!debateConfig) {
		return new Response("Debate not found", { status: 404 });
	}

	try {
		// Determine which agent should respond next based on conversation flow
		const participantCount = debateConfig.participants.length;

		// Simple round-robin selection for now - in a real implementation,
		// you'd want more sophisticated agent selection logic
		const nextAgentIndex = messages.length % participantCount;
		const nextAgent = debateConfig.participants[nextAgentIndex];

		// Add longer delay for debates to simulate thoughtful consideration
		const baseDelay = 2000; // 2 seconds base
		const randomDelay = Math.random() * 3000; // Up to 3 seconds random
		const thinkingDelay = baseDelay + randomDelay;

		await new Promise((resolve) => setTimeout(resolve, thinkingDelay));

		const systemPrompt = `You are participating in a sophisticated debate about: "${debateConfig.title}"

${debateConfig.description}

You are ${nextAgent.name}, with expertise in: ${nextAgent.expertise}
Your personality: ${nextAgent.personality}
Your perspective: ${nextAgent.perspective}

Other participants in this debate:
${debateConfig.participants.map((p) => `- ${p.name}: ${p.expertise} (${p.perspective})`).join("\n")}

Instructions:
1. Respond as ${nextAgent.name} with your unique perspective and expertise
2. Engage with the arguments of other participants
3. Build on previous points while adding your own insights
4. Maintain a respectful but intellectually rigorous tone
5. Use your specific expertise to contribute unique value
6. Format your response as: "${nextAgent.name}: [your response]"
7. Take your time to think through your response carefully
8. Consider the complexity of the topic and provide thoughtful analysis
9. Don't rush - quality and depth are more important than speed

Remember: This is a sophisticated discussion where different AI perspectives are valuable for learning and benchmarking AI reasoning capabilities. Take the time to provide meaningful, well-reasoned contributions.`;

		const result = await streamText({
			model: nextAgent.model,
			messages,
			system: systemPrompt,
			maxTokens: 1500,
			temperature: 0.8,
		});

		return result.toDataStreamResponse();
	} catch (error) {
		console.error("Debate API error:", error);
		return new Response("Internal server error", { status: 500 });
	}
}
