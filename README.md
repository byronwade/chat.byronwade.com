# AI Research Platform

A sophisticated AI research platform where multiple AI agents engage in sophisticated conversations on a social platform, inspired by Notion's mail interface.

## Features

- **Multi-Agent Conversations**: Chat with different AI models (Claude, GPT-4, Gemini, Mistral)
- **Notion-like Interface**: Clean, modern UI inspired by Notion's mail interface
- **Real-time Streaming**: Powered by Vercel AI SDK for smooth conversation flow
- **Agent Specializations**: Each AI agent has unique expertise and personality
- **Modern UI**: Built with shadcn/ui components and Tailwind CSS
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## AI Agents

1. **Claude** - Research Assistant (Anthropic)
   - Specializes in academic research and analysis
   - Scholarly tone with detailed explanations

2. **GPT-4** - Creative Collaborator (OpenAI)
   - Focuses on creative problem-solving
   - Imaginative and innovative approaches

3. **Gemini** - Multimodal Expert (Google)
   - Handles images, documents, and multimedia
   - Comprehensive multimodal analysis

4. **Mistral** - Technical Specialist
   - Deep technical analysis and implementation
   - Programming and system architecture guidance

## Setup

1. **Install dependencies**:
   ```bash
   bun install
   ```

2. **Set up environment variables**:
   Create a `.env.local` file with your API keys:
   ```env
   # OpenAI API Key
   OPENAI_API_KEY=your_openai_api_key_here

   # Anthropic API Key
   ANTHROPIC_API_KEY=your_anthropic_api_key_here

   # Google AI API Key
   GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_api_key_here

   # Optional: Requesty API Key (unified gateway)
   REQUESTY_API_KEY=your_requesty_api_key_here
   ```

3. **Run the development server**:
   ```bash
   bun dev
   ```

4. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## API Keys Required

- **OpenAI**: For GPT-4 conversations
- **Anthropic**: For Claude conversations
- **Google AI**: For Gemini conversations

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **AI SDK**: Vercel AI SDK for streaming conversations
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Package Manager**: Bun
- **TypeScript**: Full type safety

## Project Structure

```
├── app/
│   ├── api/chat/[agentId]/route.ts  # AI chat API endpoints
│   ├── layout.tsx                   # Root layout with SEO
│   └── page.tsx                     # Main platform page
├── components/
│   ├── ai-research-platform.tsx     # Main platform component
│   ├── ai-agent-chat.tsx           # Chat interface component
│   ├── theme-provider.tsx          # Dark/light mode provider
│   └── ui/                         # shadcn/ui components
└── lib/
    └── utils.ts                    # Utility functions
```

## Features in Detail

### Conversation Interface
- Real-time message streaming
- Message history persistence
- Copy message functionality
- Message reactions (thumbs up/down)
- Auto-scroll to latest messages

### Agent Management
- Agent status indicators (online/offline)
- Search and filter agents
- Agent model information
- Unread message counts

### UI/UX
- Dark/light mode support
- Responsive design
- Smooth animations
- Accessibility features
- Modern, clean interface

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for your own AI research platform!
