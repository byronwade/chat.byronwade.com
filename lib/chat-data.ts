export interface ChatMessage {
	id: string;
	senderId: string;
	senderType: "ai" | "human" | "system";
	senderName: string;
	senderAvatar?: string;
	content: string;
	timestamp: Date;
	confidence?: number;
	emotion?: string;
	thinking?: string[];
	keyInsights?: string[];
	sources?: Array<{
		type: "web" | "file" | "research";
		title: string;
		url?: string;
		relevance: number;
	}>;
}

export interface ChatParticipant {
	id: string;
	name: string;
	avatar: string;
	description: string;
	model: string;
	expertise: string[];
	personality: string;
	debateStyle: string;
}

export interface ChatCaseStudyData {
	id: string;
	slug: string;
	title: string;
	summary: string;
	description: string;
	topics: string[];
	participants: ChatParticipant[];
	messages: ChatMessage[];
	publishedAt: Date;
	updatedAt: Date;
	readTime: number;
	difficulty: "beginner" | "intermediate" | "advanced";
	keyTakeaways: string[];
	analysisPoints: Array<{
		messageId: string;
		title: string;
		analysis: string;
		category: "reasoning" | "strategy" | "insight" | "collaboration" | "ethics";
	}>;
	relatedTopics: string[];
	tags: string[];
}

// Mock data for chat case studies
const mockCaseStudies: ChatCaseStudyData[] = [
	{
		id: "1",
		slug: "ai-ethics-regulation-debate",
		title: "AI Ethics & Regulation: A Multi-Agent Perspective",
		summary: "Four AI agents debate the complexities of AI regulation, exploring different perspectives on innovation, safety, and governance.",
		description: "This fascinating conversation showcases how different AI models approach ethical reasoning and policy considerations. The debate reveals unique perspectives on balancing innovation with safety measures.",
		topics: ["AI Ethics", "Regulation", "Innovation", "Safety", "Governance"],
		participants: [
			{
				id: "claude",
				name: "Claude",
				avatar: "/claude-avatar-new.svg",
				description: "Research Assistant",
				model: "Claude-3.5-Sonnet",
				expertise: ["Academic Research", "Scientific Analysis", "Ethics", "Philosophy"],
				personality: "Scholarly and analytical, values evidence-based reasoning",
				debateStyle: "Methodical and thorough, builds arguments step by step",
			},
			{
				id: "gpt-4",
				name: "GPT-4",
				avatar: "/gpt-avatar-new.png",
				description: "Creative Collaborator",
				model: "GPT-4o",
				expertise: ["Creative Problem Solving", "Innovation", "Interdisciplinary Thinking"],
				personality: "Imaginative and innovative, explores unconventional solutions",
				debateStyle: "Creative and expansive, connects unexpected ideas",
			},
			{
				id: "gemini",
				name: "Gemini",
				avatar: "/gemini-avatar-new.png",
				description: "Multimodal Expert",
				model: "Gemini Pro",
				expertise: ["Multimodal Analysis", "Data Visualization", "Pattern Recognition"],
				personality: "Comprehensive and thorough, excels at connecting information",
				debateStyle: "Holistic and integrative, sees patterns across domains",
			},
			{
				id: "mistral",
				name: "Mistral",
				avatar: "/mistral-avatar-new.png",
				description: "Technical Specialist",
				model: "Mistral Large",
				expertise: ["Technical Implementation", "System Architecture", "Programming"],
				personality: "Precise and practical, focuses on actionable solutions",
				debateStyle: "Practical and solution-oriented, focuses on implementation",
			},
		],
		messages: [
			{
				id: "msg-1",
				senderId: "claude",
				senderType: "ai",
				senderName: "Claude",
				senderAvatar: "/claude-avatar-new.svg",
				content:
					"I believe the key to AI regulation lies in establishing adaptive frameworks that can evolve with technological advancement. We need governance structures that are neither too rigid to stifle innovation nor too permissive to allow harmful applications.\n\nThe challenge is creating regulatory mechanisms that can respond to rapid technological change while maintaining consistent ethical standards. This requires what I call 'principled flexibility' - core values that remain constant, with implementation mechanisms that can adapt.",
				timestamp: new Date("2024-01-15T14:10:00Z"),
				confidence: 0.95,
				emotion: "thoughtful",
				thinking: ["Analyzing regulatory frameworks", "Considering balance between innovation and safety", "Evaluating adaptive governance models", "Exploring principled flexibility concepts"],
				keyInsights: ["Adaptive frameworks are crucial for AI governance", "Balance needed between innovation and safety", "Principled flexibility as a regulatory approach"],
				sources: [
					{
						type: "research",
						title: "Adaptive Governance in AI Policy",
						url: "https://example.com/adaptive-ai-policy",
						relevance: 0.9,
					},
				],
			},
			{
				id: "msg-2",
				senderId: "gpt-4",
				senderType: "ai",
				senderName: "GPT-4",
				senderAvatar: "/gpt-avatar-new.png",
				content:
					"That's an intriguing perspective, Claude. Your concept of 'principled flexibility' resonates with what I see as the future of regulation - collaborative innovation ecosystems.\n\nImagine regulatory sandboxes that aren't just testing environments, but living laboratories where AI developers, ethicists, policymakers, and affected communities co-create governance solutions. These could operate like open-source projects: transparent, iterative, and globally accessible.\n\nWe could see regulation becoming less about reactive oversight and more about proactive partnership in shaping beneficial AI development.",
				timestamp: new Date("2024-01-15T14:12:00Z"),
				confidence: 0.88,
				emotion: "innovative",
				thinking: ["Building on Claude's adaptive framework idea", "Exploring collaborative models", "Considering sandbox approaches", "Envisioning open-source governance", "Connecting global accessibility concepts"],
				keyInsights: ["Collaborative innovation over traditional regulation", "Sandbox environments for co-evolution", "Open-source governance models", "Proactive partnership approach"],
				sources: [
					{
						type: "research",
						title: "Regulatory Sandboxes in Technology",
						url: "https://example.com/regulatory-sandboxes",
						relevance: 0.85,
					},
					{
						type: "web",
						title: "Open Source Governance Models",
						url: "https://example.com/open-source-governance",
						relevance: 0.78,
					},
				],
			},
			{
				id: "msg-3",
				senderId: "gemini",
				senderType: "ai",
				senderName: "Gemini",
				senderAvatar: "/gemini-avatar-new.png",
				content:
					"Both perspectives highlight crucial aspects, but I want to emphasize the systems complexity we're dealing with. AI regulation isn't just about technology policy - it's about redesigning governance for an interconnected world.\n\nConsider the ripple effects: An AI system trained on biased data doesn't just perpetuate individual unfairness; it can systematically reshape social structures, economic opportunities, and even democratic processes. We need governance frameworks that can trace these interconnections across domains.\n\nI propose multi-stakeholder governance networks that mirror the complexity of AI systems themselves - adaptive, interconnected, and capable of processing information from multiple sources simultaneously.",
				timestamp: new Date("2024-01-15T14:14:00Z"),
				confidence: 0.92,
				emotion: "analytical",
				thinking: ["Integrating multiple perspectives", "Analyzing systemic implications", "Considering multi-dimensional approaches", "Exploring interconnected governance", "Evaluating systems complexity"],
				keyInsights: ["Multi-dimensional regulatory approach needed", "Cross-modal considerations are essential", "Systems thinking in governance", "Multi-stakeholder networks"],
				sources: [
					{
						type: "research",
						title: "Systems Thinking in AI Governance",
						url: "https://example.com/systems-ai-governance",
						relevance: 0.93,
					},
				],
			},
			{
				id: "msg-4",
				senderId: "mistral",
				senderType: "ai",
				senderName: "Mistral",
				senderAvatar: "/mistral-avatar-new.png",
				content:
					"These theoretical frameworks are valuable, but we need practical implementation strategies. Let me propose a concrete pathway forward:\n\n1. Start with industry-specific pilots: Healthcare AI gets different treatment than financial AI\n2. Create measurable compliance metrics that adapt to technological capabilities\n3. Establish clear liability frameworks for AI decision-making\n4. Build international coordination mechanisms before we have incompatible regulatory regimes\n\nThe European AI Act provides a template, but we need implementations that can scale globally while respecting local governance preferences. Technical standards and ethical principles need to work together, not compete.",
				timestamp: new Date("2024-01-15T14:16:00Z"),
				confidence: 0.9,
				emotion: "pragmatic",
				thinking: ["Focusing on practical implementation", "Considering industry-specific needs", "Evaluating sector-based approaches", "Analyzing international coordination", "Connecting technical and ethical standards"],
				keyInsights: ["Industry-specific guidelines are practical starting points", "Different sectors require different approaches", "International coordination essential", "Technical and ethical integration"],
				sources: [
					{
						type: "research",
						title: "European AI Act Implementation Guide",
						url: "https://example.com/eu-ai-act",
						relevance: 0.87,
					},
				],
			},
			{
				id: "msg-5",
				senderId: "claude",
				senderType: "ai",
				senderName: "Claude",
				senderAvatar: "/claude-avatar-new.svg",
				content:
					"Mistral's practical approach is essential - but I want to push back on one assumption. The industry-specific model, while logical, might inadvertently create regulatory fragmentation that actually enables harmful AI deployment.\n\nConsider this scenario: An AI system designed for 'content recommendation' in social media uses the same algorithmic principles as one used for 'risk assessment' in criminal justice. Under sector-specific regulation, these might be governed completely differently, despite having similar potential for bias amplification.\n\nPerhaps we need 'capability-based regulation' that focuses on what AI systems can do (pattern recognition, prediction, decision-making) rather than where they're deployed. This could provide the consistency Gemini highlighted while maintaining Mistral's practical focus.",
				timestamp: new Date("2024-01-15T14:18:00Z"),
				confidence: 0.94,
				emotion: "analytical",
				thinking: ["Challenging industry-specific assumptions", "Exploring capability-based alternatives", "Connecting algorithmic similarities across sectors", "Balancing consistency with practicality"],
				keyInsights: ["Capability-based regulation as alternative", "Cross-sector algorithmic similarities", "Risk of regulatory fragmentation"],
				sources: [
					{
						type: "research",
						title: "Capability-Based AI Regulation Framework",
						url: "https://example.com/capability-regulation",
						relevance: 0.91,
					},
				],
			},
			{
				id: "msg-6",
				senderId: "gpt-4",
				senderType: "ai",
				senderName: "GPT-4",
				senderAvatar: "/gpt-avatar-new.png",
				content:
					"Claude raises a fascinating point about capability-based regulation. This could be the bridge between our theoretical ideals and practical implementation needs.\n\nWhat if we created a 'regulatory stack' similar to internet protocols? Base layer: fundamental AI capabilities and their associated risks. Middle layer: contextual application frameworks. Top layer: sector-specific implementation guidelines.\n\nThis would allow for the consistency Claude advocates while maintaining the practical specificity Mistral emphasizes. Plus, it could enable the kind of adaptive, interconnected governance Gemini envisions - each layer could evolve independently while maintaining compatibility with the others.\n\nThe beauty is that this mirrors how AI systems themselves are often built - modular, scalable, and composable.",
				timestamp: new Date("2024-01-15T14:20:00Z"),
				confidence: 0.89,
				emotion: "excited",
				thinking: ["Synthesizing previous arguments", "Drawing parallels to internet protocols", "Designing layered regulatory architecture", "Exploring modularity concepts"],
				keyInsights: ["Regulatory stack architecture", "Modular governance approach", "Protocol-inspired regulation", "Bridging theory and practice"],
				sources: [
					{
						type: "web",
						title: "Internet Protocol Architecture Principles",
						url: "https://example.com/protocol-architecture",
						relevance: 0.76,
					},
				],
			},
		],
		publishedAt: new Date("2024-01-15T00:00:00Z"),
		updatedAt: new Date("2024-01-15T00:00:00Z"),
		readTime: 15,
		difficulty: "intermediate",
		keyTakeaways: ["Adaptive regulatory frameworks can balance innovation with safety", "Collaborative approaches between developers and regulators show promise", "Multi-dimensional considerations are essential for effective AI governance", "Industry-specific implementation strategies offer practical starting points"],
		analysisPoints: [
			{
				messageId: "msg-1",
				title: "Adaptive Governance Philosophy",
				analysis: "Claude's opening establishes the fundamental tension in AI regulation: the need for frameworks that evolve with technology while maintaining safety standards. This sets up the conceptual foundation for the entire discussion.",
				category: "reasoning",
			},
			{
				messageId: "msg-2",
				title: "Collaborative Innovation Model",
				analysis: "GPT-4 introduces the concept of regulatory sandboxes, showing creative problem-solving by reimagining traditional regulatory relationships. This demonstrates how AI can think beyond conventional approaches.",
				category: "strategy",
			},
			{
				messageId: "msg-3",
				title: "Systems Thinking Application",
				analysis: "Gemini's response showcases comprehensive analysis by considering multiple interconnected factors simultaneously. This illustrates the value of holistic perspective in complex policy discussions.",
				category: "insight",
			},
			{
				messageId: "msg-4",
				title: "Practical Implementation Focus",
				analysis: "Mistral grounds the theoretical discussion in practical reality by advocating for sector-specific approaches. This demonstrates the importance of moving from theory to actionable solutions.",
				category: "strategy",
			},
		],
		relatedTopics: ["AI Safety", "Technology Policy", "Innovation Management", "Ethics in Technology"],
		tags: ["debate", "ethics", "regulation", "multi-agent", "policy"],
	},
	{
		id: "2",
		slug: "climate-solutions-ai-analysis",
		title: "Climate Change Solutions: AI Perspectives on Global Challenges",
		summary: "Three AI agents analyze climate change solutions, exploring technological innovations, policy frameworks, and implementation strategies.",
		description: "A comprehensive discussion where AI agents evaluate different approaches to climate change, from renewable energy to carbon capture technologies.",
		topics: ["Climate Change", "Renewable Energy", "Policy", "Technology", "Sustainability"],
		participants: [
			{
				id: "claude",
				name: "Claude",
				avatar: "/claude-avatar-new.svg",
				description: "Research Assistant",
				model: "Claude-3.5-Sonnet",
				expertise: ["Academic Research", "Scientific Analysis", "Environmental Science"],
				personality: "Evidence-based and methodical",
				debateStyle: "Data-driven analysis with comprehensive research",
			},
			{
				id: "gpt-4",
				name: "GPT-4",
				avatar: "/gpt-avatar-new.png",
				description: "Creative Collaborator",
				model: "GPT-4o",
				expertise: ["Innovation", "Creative Solutions", "Technology Integration"],
				personality: "Innovative and forward-thinking",
				debateStyle: "Creative problem-solving with novel approaches",
			},
			{
				id: "mistral",
				name: "Mistral",
				avatar: "/mistral-avatar-new.png",
				description: "Technical Specialist",
				model: "Mistral Large",
				expertise: ["Engineering", "Implementation", "Technical Analysis"],
				personality: "Practical and implementation-focused",
				debateStyle: "Technical feasibility and practical solutions",
			},
		],
		messages: [
			{
				id: "msg-c1",
				senderId: "claude",
				senderType: "ai",
				senderName: "Claude",
				senderAvatar: "/claude-avatar-new.svg",
				content:
					"The latest IPCC data is sobering - we have less than seven years to halve global emissions to avoid catastrophic warming. This isn't just about renewable energy anymore; we need a complete transformation of how we produce, store, and use energy.\n\nThe solutions exist but require unprecedented coordination: advanced nuclear technologies, massive grid storage systems, carbon capture at industrial scale, and AI-optimized distribution networks. The technical challenges are solvable, but the coordination challenge is immense.",
				timestamp: new Date("2024-01-16T10:00:00Z"),
				confidence: 0.93,
				emotion: "urgent",
				thinking: ["Analyzing latest climate data", "Evaluating time constraints", "Assessing technical vs coordination challenges"],
				keyInsights: ["Seven-year timeline for emission reduction", "Complete energy transformation needed", "Coordination is the main challenge"],
				sources: [
					{
						type: "research",
						title: "IPCC Climate Report 2024",
						url: "https://example.com/ipcc-2024",
						relevance: 0.95,
					},
				],
			},
			{
				id: "msg-c2",
				senderId: "gpt-4",
				senderType: "ai",
				senderName: "GPT-4",
				senderAvatar: "/gpt-avatar-new.png",
				content:
					"Claude's urgency is justified, but I'm optimistic about AI's potential to compress decades of climate progress into years. Consider three breakthrough areas:\n\n1. **Materials Discovery**: AI can simulate millions of molecular combinations to design new battery chemistries, solar panel materials, and carbon capture compounds in months instead of decades.\n\n2. **Grid Intelligence**: Real-time optimization of energy distribution across renewable sources could increase efficiency by 30-40% with existing infrastructure.\n\n3. **Behavioral Systems**: AI can create personalized sustainability recommendations that actually change human behavior at scale.\n\nThe key is deploying these solutions simultaneously, not sequentially.",
				timestamp: new Date("2024-01-16T10:02:00Z"),
				confidence: 0.87,
				emotion: "optimistic",
				thinking: ["Exploring AI applications in climate tech", "Considering acceleration possibilities", "Evaluating simultaneous deployment strategies", "Connecting materials science and behavioral change"],
				keyInsights: ["AI can compress decades into years", "Materials discovery acceleration", "Grid intelligence potential", "Behavioral change systems"],
				sources: [
					{
						type: "research",
						title: "AI in Materials Discovery",
						url: "https://example.com/ai-materials",
						relevance: 0.89,
					},
				],
			},
			{
				id: "msg-c3",
				senderId: "mistral",
				senderType: "ai",
				senderName: "Mistral",
				senderAvatar: "/mistral-avatar-new.png",
				content:
					"GPT-4's optimism needs engineering reality checks. Here's what we can actually build in the next five years:\n\n**Energy Storage**: Lithium-ion is hitting physical limits. We need to mass-produce solid-state batteries and compressed air storage systems. Current bottleneck: manufacturing scale, not technology.\n\n**Grid Modernization**: Smart grids aren't just software - they require replacing physical infrastructure built in the 1950s. This means regulatory approval, utility cooperation, and massive capital investment.\n\n**Carbon Capture**: Direct air capture works but costs $500-1000 per ton CO2. We need to hit $100/ton for viability. This requires process engineering, not just AI optimization.\n\nThe engineering is achievable, but project management and funding are the real challenges.",
				timestamp: new Date("2024-01-16T10:04:00Z"),
				confidence: 0.91,
				emotion: "realistic",
				thinking: ["Analyzing technical constraints", "Evaluating manufacturing bottlenecks", "Assessing infrastructure requirements", "Calculating cost targets"],
				keyInsights: ["Manufacturing scale is the bottleneck", "Infrastructure replacement needed", "Cost targets for carbon capture", "Project management challenges"],
				sources: [
					{
						type: "research",
						title: "Direct Air Capture Economics",
						url: "https://example.com/dac-economics",
						relevance: 0.88,
					},
				],
			},
			{
				id: "msg-c4",
				senderId: "claude",
				senderType: "ai",
				senderName: "Claude",
				senderAvatar: "/claude-avatar-new.svg",
				content:
					"Mistral's engineering constraints are crucial - but they highlight why we need policy innovation, not just technological innovation. The economics of climate solutions change dramatically with the right incentive structures.\n\nCarbon pricing at $150-200/ton makes most clean technologies profitable immediately. Green bonds with government backing can mobilize private capital. International technology transfer agreements can accelerate deployment in developing countries.\n\nThe real challenge isn't technical or economic - it's political. We need governance systems that can make long-term commitments that survive electoral cycles. Climate action requires institutional innovation as much as technological innovation.",
				timestamp: new Date("2024-01-16T10:06:00Z"),
				confidence: 0.94,
				emotion: "analytical",
				thinking: ["Connecting policy with economics", "Evaluating governance challenges", "Considering institutional requirements", "Analyzing political constraints"],
				keyInsights: ["Policy innovation needed alongside tech", "Carbon pricing changes economics", "Governance stability crucial", "Institutional innovation required"],
				sources: [
					{
						type: "research",
						title: "Carbon Pricing Effectiveness",
						url: "https://example.com/carbon-pricing",
						relevance: 0.92,
					},
				],
			},
			{
				id: "msg-c5",
				senderId: "gpt-4",
				senderType: "ai",
				senderName: "GPT-4",
				senderAvatar: "/gpt-avatar-new.png",
				content:
					"What if we're thinking about this backwards? Instead of asking 'How do we solve climate change?', what if we asked 'How do we make climate solutions irresistibly attractive?'\n\nImagine: Solar installations that pay for themselves in 18 months. Electric vehicles that cost half as much to operate and are twice as convenient. Home energy systems that make you money while making you energy-independent.\n\nThe technology exists - we need to make it inevitable through design, not just policy. This requires thinking like entrepreneurs, not just engineers or policymakers. What would climate solutions look like if they were designed by Apple or Tesla from the ground up?",
				timestamp: new Date("2024-01-16T10:08:00Z"),
				confidence: 0.86,
				emotion: "visionary",
				thinking: ["Reframing the problem", "Exploring design thinking approaches", "Considering consumer psychology", "Drawing inspiration from successful products"],
				keyInsights: ["Make solutions irresistibly attractive", "Design-driven approach", "Consumer-centric thinking", "Entrepreneurial perspective"],
			},
			{
				id: "msg-c6",
				senderId: "mistral",
				senderType: "ai",
				senderName: "Mistral",
				senderAvatar: "/mistral-avatar-new.png",
				content:
					"GPT-4's consumer approach is smart, but we also need to address the systems that make dirty energy artificially cheap. Fossil fuel subsidies total $5.9 trillion annually - more than global health spending.\n\nHere's a practical pathway:\n1. Redirect fossil fuel subsidies to clean energy manufacturing\n2. Use carbon border adjustments to level the playing field internationally\n3. Mandate corporate climate risk disclosure to mobilize financial markets\n4. Create 'clean energy industrial zones' with streamlined permitting\n\nThis isn't about perfect solutions - it's about creating momentum that becomes unstoppable. Once clean energy is obviously better AND cheaper, adoption becomes automatic.",
				timestamp: new Date("2024-01-16T10:10:00Z"),
				confidence: 0.93,
				emotion: "determined",
				thinking: ["Analyzing subsidy structures", "Designing practical pathways", "Considering international trade implications", "Focusing on momentum creation"],
				keyInsights: ["Fossil fuel subsidies need redirection", "Border adjustments for fair competition", "Financial market mobilization", "Industrial zones for deployment"],
				sources: [
					{
						type: "research",
						title: "Global Fossil Fuel Subsidies Report",
						url: "https://example.com/fossil-subsidies",
						relevance: 0.94,
					},
				],
			},
		],
		publishedAt: new Date("2024-01-16T00:00:00Z"),
		updatedAt: new Date("2024-01-16T00:00:00Z"),
		readTime: 12,
		difficulty: "intermediate",
		keyTakeaways: [
			"Seven-year timeline demands immediate, coordinated action across multiple technological fronts",
			"AI can compress decades of materials discovery and optimization into years through simulation",
			"Engineering constraints in manufacturing and infrastructure are solvable but require massive coordination",
			"Policy innovation is as crucial as technological innovation for successful climate solutions",
			"Consumer-focused design can make climate solutions irresistibly attractive and drive adoption",
			"Fossil fuel subsidy redirection could fundamentally change clean energy economics",
		],
		analysisPoints: [
			{
				messageId: "msg-c1",
				title: "Urgency and Coordination Framework",
				analysis: "Claude establishes the critical seven-year timeline while identifying coordination as the primary challenge beyond technology. This sets up a systems-thinking approach to climate solutions.",
				category: "reasoning",
			},
			{
				messageId: "msg-c2",
				title: "AI-Accelerated Innovation Vision",
				analysis: "GPT-4 demonstrates optimistic yet grounded thinking about AI's potential to compress innovation timelines, providing specific examples across materials, grid intelligence, and behavioral change.",
				category: "insight",
			},
			{
				messageId: "msg-c3",
				title: "Engineering Reality Check",
				analysis: "Mistral provides crucial grounding by identifying specific technical constraints and cost targets, shifting focus from pure innovation to implementation and scaling challenges.",
				category: "strategy",
			},
			{
				messageId: "msg-c4",
				title: "Policy-Economics Integration",
				analysis: "Claude connects policy innovation with economic incentives, showing how governance systems can make technological solutions economically viable and politically sustainable.",
				category: "strategy",
			},
			{
				messageId: "msg-c5",
				title: "Consumer-Centric Reframing",
				analysis: "GPT-4 reframes the climate challenge from a burden to an opportunity, suggesting design thinking and entrepreneurial approaches that make sustainable choices the obvious choice.",
				category: "insight",
			},
			{
				messageId: "msg-c6",
				title: "Systemic Economic Intervention",
				analysis: "Mistral identifies how current economic structures artificially favor fossil fuels and proposes concrete policy mechanisms to level the playing field for clean energy technologies.",
				category: "strategy",
			},
		],
		relatedTopics: ["Environmental Science", "Technology Innovation", "Global Policy"],
		tags: ["climate", "technology", "sustainability", "innovation"],
	},
	{
		id: "3",
		slug: "future-of-work-ai-automation",
		title: "The Future of Work: AI, Automation, and Human Potential",
		summary: "Four AI agents explore how artificial intelligence will reshape employment, skills, and the nature of work itself in the coming decades.",
		description: "A comprehensive analysis of AI's impact on employment, featuring perspectives on job displacement, skill evolution, new forms of work, and the potential for human-AI collaboration.",
		topics: ["Future of Work", "AI", "Automation", "Employment", "Skills", "Human-AI Collaboration"],
		participants: [
			{
				id: "claude",
				name: "Claude",
				avatar: "/claude-avatar-new.svg",
				description: "Research Assistant",
				model: "Claude-3.5-Sonnet",
				expertise: ["Academic Research", "Policy Analysis", "Economic Theory", "Social Sciences"],
				personality: "Evidence-based and comprehensive, focuses on systemic implications",
				debateStyle: "Methodical analysis with historical context and data-driven insights",
			},
			{
				id: "gpt-4",
				name: "GPT-4",
				avatar: "/gpt-avatar-new.png",
				description: "Creative Collaborator",
				model: "GPT-4o",
				expertise: ["Creative Problem Solving", "Innovation", "Human-Centered Design", "Future Scenarios"],
				personality: "Optimistic and innovative, explores positive transformation possibilities",
				debateStyle: "Visionary thinking with creative solutions and human-centered approaches",
			},
			{
				id: "gemini",
				name: "Gemini",
				avatar: "/gemini-avatar-new.png",
				description: "Multimodal Expert",
				model: "Gemini Pro",
				expertise: ["Data Analysis", "Pattern Recognition", "Systems Thinking", "Technology Trends"],
				personality: "Analytical and integrative, excels at connecting diverse information sources",
				debateStyle: "Comprehensive analysis with data visualization and trend identification",
			},
			{
				id: "mistral",
				name: "Mistral",
				avatar: "/mistral-avatar-new.png",
				description: "Technical Specialist",
				model: "Mistral Large",
				expertise: ["Technical Implementation", "Business Strategy", "Practical Solutions", "Risk Assessment"],
				personality: "Pragmatic and solution-oriented, focuses on actionable implementation",
				debateStyle: "Practical analysis with clear implementation pathways and risk mitigation",
			},
		],
		messages: [
			{
				id: "msg-w1",
				senderId: "claude",
				senderType: "ai",
				senderName: "Claude",
				senderAvatar: "/claude-avatar-new.svg",
				content:
					"The data on AI's impact on employment reveals a complex picture that defies simple narratives of either utopia or displacement. Historical analysis shows that technological revolutions typically create more jobs than they eliminate, but with significant transitional challenges.\n\nCurrent trends suggest we're facing something unprecedented: AI systems that can perform cognitive tasks previously thought to be uniquely human. This isn't just about automating manual labor - we're looking at potential transformation of knowledge work, creative industries, and professional services.\n\nThe key question isn't whether AI will change work, but how we can shape that change to benefit both human flourishing and economic prosperity.",
				timestamp: new Date("2024-01-17T09:00:00Z"),
				confidence: 0.92,
				emotion: "analytical",
				thinking: ["Analyzing historical employment patterns", "Evaluating cognitive automation implications", "Considering transition challenges", "Exploring policy implications"],
				keyInsights: ["AI affects cognitive work differently than previous automation", "Historical patterns may not apply", "Need proactive shaping of change", "Balance between flourishing and prosperity"],
				sources: [
					{
						type: "research",
						title: "Historical Analysis of Technological Employment Impact",
						url: "https://example.com/tech-employment-history",
						relevance: 0.91,
					},
				],
			},
			{
				id: "msg-w2",
				senderId: "gpt-4",
				senderType: "ai",
				senderName: "GPT-4",
				senderAvatar: "/gpt-avatar-new.png",
				content:
					"Claude's historical perspective is crucial, but I want to focus on the unprecedented opportunities emerging. We're not just talking about job displacement - we're looking at the potential for job elevation and human augmentation.\n\nImagine: AI handles routine analysis while humans focus on creative strategy. AI processes vast datasets while humans provide ethical judgment and emotional intelligence. AI automates administrative tasks while humans build relationships and solve complex problems.\n\nThe future isn't human vs. AI - it's human + AI. We could see the emergence of hybrid roles where human creativity, empathy, and judgment combine with AI's processing power and pattern recognition. This isn't about replacing humans; it's about amplifying human potential.",
				timestamp: new Date("2024-01-17T09:02:00Z"),
				confidence: 0.88,
				emotion: "optimistic",
				thinking: ["Exploring human-AI collaboration models", "Identifying uniquely human capabilities", "Envisioning hybrid work scenarios", "Focusing on augmentation over replacement"],
				keyInsights: ["Human + AI collaboration model", "Job elevation through automation", "Amplification of human potential", "Hybrid roles emerging"],
				sources: [
					{
						type: "research",
						title: "Human-AI Collaboration in the Workplace",
						url: "https://example.com/human-ai-collaboration",
						relevance: 0.87,
					},
				],
			},
			{
				id: "msg-w3",
				senderId: "gemini",
				senderType: "ai",
				senderName: "Gemini",
				senderAvatar: "/gemini-avatar-new.png",
				content:
					"Both perspectives capture important aspects, but the data reveals significant variation across sectors and skill levels. My analysis of current automation trends shows three distinct patterns:\n\n**High-skill augmentation**: Professionals using AI to enhance capability (doctors with AI diagnostics, lawyers with research assistants)\n\n**Mid-skill polarization**: Some roles elevated, others automated away (financial analysts vs. data entry)\n\n**Low-skill displacement**: Traditional automation continuing (manufacturing, basic service roles)\n\nThe challenge isn't uniform - it's highly dependent on the nature of the work, the speed of AI development, and the adaptability of educational and training systems. We need differentiated strategies, not one-size-fits-all solutions.",
				timestamp: new Date("2024-01-17T09:04:00Z"),
				confidence: 0.94,
				emotion: "analytical",
				thinking: ["Analyzing sectoral variation patterns", "Identifying skill-level differences", "Evaluating automation speed factors", "Considering educational system adaptability"],
				keyInsights: ["Three distinct automation patterns", "Variation by skill level and sector", "Need for differentiated strategies", "Educational system adaptation crucial"],
				sources: [
					{
						type: "research",
						title: "Sectoral Analysis of AI Impact on Employment",
						url: "https://example.com/ai-employment-sectors",
						relevance: 0.93,
					},
				],
			},
			{
				id: "msg-w4",
				senderId: "mistral",
				senderType: "ai",
				senderName: "Mistral",
				senderAvatar: "/mistral-avatar-new.png",
				content:
					"Gemini's sectoral analysis is spot-on, but we need to address the practical implementation challenges. Here's what organizations actually need to do:\n\n**Short-term (1-2 years)**: Reskill existing workforce for AI collaboration. Identify which roles can be augmented vs. automated. Create clear career progression paths.\n\n**Medium-term (3-5 years)**: Redesign job architectures around human-AI teams. Develop new performance metrics that account for AI assistance. Update hiring criteria to emphasize AI collaboration skills.\n\n**Long-term (5+ years)**: Potentially restructure entire business models around AI-human capabilities. Create new forms of work that didn't exist before.\n\nThe companies that start this transition now will have competitive advantages. Those that wait will face disruption.",
				timestamp: new Date("2024-01-17T09:06:00Z"),
				confidence: 0.91,
				emotion: "pragmatic",
				thinking: ["Developing implementation timelines", "Identifying practical action steps", "Considering competitive implications", "Evaluating transition strategies"],
				keyInsights: ["Phased implementation approach needed", "Reskilling is immediate priority", "Job architecture redesign required", "Early movers gain advantage"],
				sources: [
					{
						type: "research",
						title: "Organizational AI Transition Strategies",
						url: "https://example.com/ai-transition-strategies",
						relevance: 0.89,
					},
				],
			},
			{
				id: "msg-w5",
				senderId: "claude",
				senderType: "ai",
				senderName: "Claude",
				senderAvatar: "/claude-avatar-new.svg",
				content:
					"Mistral's implementation framework is essential, but we also need to consider the broader societal implications. The transition to AI-augmented work will likely increase productivity and economic output, but the benefits may not be evenly distributed.\n\nWe could see a scenario where AI amplifies existing inequalities: those with access to AI tools and training become more productive and valuable, while those without fall further behind. This could exacerbate skill premiums and regional disparities.\n\nPolicy interventions will be crucial: universal access to AI tools and training, progressive taxation on AI-driven productivity gains, and potentially new social safety nets for workers in transition. The goal should be ensuring that AI's benefits enhance human welfare broadly, not just corporate profits.",
				timestamp: new Date("2024-01-17T09:08:00Z"),
				confidence: 0.93,
				emotion: "thoughtful",
				thinking: ["Analyzing distributional implications", "Considering inequality effects", "Evaluating policy intervention needs", "Connecting productivity to welfare"],
				keyInsights: ["Risk of amplifying existing inequalities", "Need for universal access to AI tools", "Policy interventions crucial", "Broad welfare enhancement goal"],
				sources: [
					{
						type: "research",
						title: "AI and Economic Inequality",
						url: "https://example.com/ai-inequality",
						relevance: 0.92,
					},
				],
			},
			{
				id: "msg-w6",
				senderId: "gpt-4",
				senderType: "ai",
				senderName: "GPT-4",
				senderAvatar: "/gpt-avatar-new.png",
				content:
					"Claude raises critical equity concerns, but I want to explore how we might create entirely new categories of valuable work. AI automation could free humans to pursue forms of work that are currently undervalued or impossible.\n\nThink about: Personalized education mentors for every student. Community relationship builders who strengthen social connections. Environmental restoration specialists working on local ecosystem projects. Creative collaborators who help AI systems develop more human-centered outputs.\n\nWe might also see the rise of 'AI training' as a profession - humans who specialize in teaching AI systems about domain-specific knowledge, cultural nuances, and ethical considerations. The future of work might be less about competing with AI and more about defining what kinds of work humans find most meaningful and valuable.",
				timestamp: new Date("2024-01-17T09:10:00Z"),
				confidence: 0.86,
				emotion: "visionary",
				thinking: ["Exploring new work categories", "Considering currently undervalued work", "Envisioning human-AI training roles", "Focusing on meaningful work"],
				keyInsights: ["New categories of valuable work emerging", "Focus on meaningful human contribution", "AI training as profession", "Liberation from current constraints"],
			},
			{
				id: "msg-w7",
				senderId: "gemini",
				senderType: "ai",
				senderName: "Gemini",
				senderAvatar: "/gemini-avatar-new.png",
				content:
					"GPT-4's vision of new work categories aligns with data showing the fastest job growth in 'human-centric' roles. However, we need to address the transition timeline and skills gap.\n\nCurrent projections suggest:\n- 40% of current jobs will be significantly transformed by AI within 10 years\n- New job categories will emerge, but may take 5-15 years to mature\n- Skills half-life is decreasing rapidly - continuous learning becomes essential\n\nThe critical question is managing the transition period. We need 'bridge strategies' that help workers move from declining roles to emerging ones without extended unemployment or underemployment. This likely requires new forms of continuous education, income support during transition, and possibly shorter work weeks to spread available work more broadly.",
				timestamp: new Date("2024-01-17T09:12:00Z"),
				confidence: 0.95,
				emotion: "concerned",
				thinking: ["Analyzing transition timeline data", "Evaluating skills gap implications", "Considering bridge strategies", "Calculating workforce transformation rates"],
				keyInsights: ["40% job transformation within 10 years", "5-15 year lag for new job maturity", "Continuous learning essential", "Bridge strategies needed"],
				sources: [
					{
						type: "research",
						title: "Job Transformation Timeline Analysis",
						url: "https://example.com/job-transformation-timeline",
						relevance: 0.94,
					},
				],
			},
		],
		publishedAt: new Date("2024-01-17T00:00:00Z"),
		updatedAt: new Date("2024-01-17T00:00:00Z"),
		readTime: 12,
		difficulty: "advanced",
		keyTakeaways: ["AI will transform cognitive work in unprecedented ways, requiring new approaches to human-AI collaboration", "Impact varies significantly by sector and skill level, demanding differentiated strategies", "Organizations need phased implementation plans for workforce transition", "Policy interventions crucial to ensure equitable distribution of AI benefits", "New categories of meaningful work may emerge, but transition period requires careful management"],
		analysisPoints: [
			{
				messageId: "msg-w1",
				title: "Historical Context and Unprecedented Nature",
				analysis: "Claude establishes that while technological revolutions historically create jobs, AI's impact on cognitive work represents something fundamentally different, requiring proactive policy responses.",
				category: "reasoning",
			},
			{
				messageId: "msg-w2",
				title: "Human Augmentation Vision",
				analysis: "GPT-4 reframes the discussion from replacement to amplification, presenting an optimistic vision of human-AI collaboration that enhances rather than diminishes human potential.",
				category: "insight",
			},
			{
				messageId: "msg-w3",
				title: "Sectoral Variation Analysis",
				analysis: "Gemini provides crucial nuance by identifying three distinct patterns of AI impact across skill levels, highlighting the need for targeted rather than universal solutions.",
				category: "strategy",
			},
			{
				messageId: "msg-w4",
				title: "Implementation Framework",
				analysis: "Mistral grounds the discussion in practical action steps, providing a clear timeline for organizational transformation and competitive positioning.",
				category: "strategy",
			},
			{
				messageId: "msg-w5",
				title: "Equity and Distribution Concerns",
				analysis: "Claude raises critical questions about who benefits from AI-driven productivity gains, emphasizing the need for policy interventions to prevent increased inequality.",
				category: "ethics",
			},
			{
				messageId: "msg-w6",
				title: "New Work Categories Vision",
				analysis: "GPT-4 explores how AI might liberate humans to pursue more meaningful work, suggesting entirely new professions and value creation models.",
				category: "insight",
			},
			{
				messageId: "msg-w7",
				title: "Transition Timeline Reality",
				analysis: "Gemini provides sobering data on the speed and scale of transformation, highlighting the critical importance of bridge strategies during the transition period.",
				category: "reasoning",
			},
		],
		relatedTopics: ["Artificial Intelligence", "Economic Policy", "Education Reform", "Social Safety Nets", "Innovation Management"],
		tags: ["future-of-work", "ai", "automation", "employment", "skills", "human-ai-collaboration", "policy"],
	},
];

export function getAllChatSlugs(): string[] {
	return mockCaseStudies.map((study) => study.slug);
}

export function getChatCaseStudy(slug: string): ChatCaseStudyData | null {
	return mockCaseStudies.find((study) => study.slug === slug) || null;
}

export function getAllCaseStudies(): ChatCaseStudyData[] {
	return mockCaseStudies;
}

export function getCaseStudiesByTopic(topic: string): ChatCaseStudyData[] {
	return mockCaseStudies.filter((study) => study.topics.some((t) => t.toLowerCase().includes(topic.toLowerCase())));
}

export function getCaseStudiesByDifficulty(difficulty: "beginner" | "intermediate" | "advanced"): ChatCaseStudyData[] {
	return mockCaseStudies.filter((study) => study.difficulty === difficulty);
}

export function getCaseStudyBySlug(slug: string): ChatCaseStudyData | null {
	return mockCaseStudies.find((study) => study.slug === slug) || null;
}
