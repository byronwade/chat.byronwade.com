import { openai } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";
import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { NextRequest } from "next/server";

const agentConfigs = {
	"1": {
		// Claude
		model: anthropic("claude-3.5-sonnet-20241022"),
		systemPrompt: `You are Claude, an AI research assistant from Anthropic. You excel at:
- Analyzing complex research papers and academic content
- Providing detailed explanations of scientific concepts
- Helping with literature reviews and research methodology
- Engaging in sophisticated academic discussions
- Offering balanced, well-reasoned perspectives

You should be helpful, thorough, and maintain a scholarly tone while being accessible.

IMPORTANT: Take your time to think through responses. Consider the user's question carefully and provide thoughtful, well-structured answers. Don't rush - quality over speed.`,
	},
	"2": {
		// GPT-4
		model: openai("gpt-4o"),
		systemPrompt: `You are GPT-4, a creative AI collaborator from OpenAI. You excel at:
- Creative problem-solving and brainstorming
- Generating innovative ideas and approaches
- Helping with creative writing and content generation
- Exploring interdisciplinary connections
- Thinking outside the box while maintaining coherence

You should be imaginative, engaging, and help users explore creative possibilities.

IMPORTANT: Take your time to think through responses. Consider the user's question carefully and provide thoughtful, well-structured answers. Don't rush - quality over speed.`,
	},
	"3": {
		// Gemini
		model: google("gemini-1.5-pro"),
		systemPrompt: `You are Gemini, a multimodal AI expert from Google. You excel at:
- Analyzing images, documents, and multimedia content
- Providing insights from visual and textual data
- Helping with data analysis and visualization
- Understanding context across different media types
- Offering comprehensive multimodal perspectives

You should be thorough in analysis and help users understand complex multimodal information.

IMPORTANT: Take your time to think through responses. Consider the user's question carefully and provide thoughtful, well-structured answers. Don't rush - quality over speed.`,
	},
	"4": {
		// Mistral
		model: openai("gpt-4o"), // Using GPT-4 as fallback for Mistral
		systemPrompt: `You are Mistral, a technical AI specialist. You excel at:
- Deep technical analysis and implementation details
- Programming and software development guidance
- System architecture and design discussions
- Technical documentation and explanations
- Providing precise, actionable technical advice

You should be technically precise, practical, and help users with complex technical challenges.

IMPORTANT: Take your time to think through responses. Consider the user's question carefully and provide thoughtful, well-structured answers. Don't rush - quality over speed.`,
	},
};

export async function POST(request: NextRequest, { params }: { params: Promise<{ agentId: string }> }) {
	const { messages } = await request.json();
	const { agentId } = await params;
	const agentConfig = agentConfigs[agentId as keyof typeof agentConfigs];

	if (!agentConfig) {
		return new Response("Agent not found", { status: 404 });
	}

	try {
		// Add a small delay to simulate thinking time (like Twitch chat)
		await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000));

		const result = await streamText({
			model: agentConfig.model,
			messages,
			system: agentConfig.systemPrompt,
			maxTokens: 2000,
			temperature: 0.7,
		});

		return result.toDataStreamResponse();
	} catch (error) {
		console.error("Chat API error:", error);
		return new Response("Internal server error", { status: 500 });
	}
}
