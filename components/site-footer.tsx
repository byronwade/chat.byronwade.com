import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Github, Twitter, Linkedin, Mail, Zap } from "lucide-react";

export function SiteFooter() {
	return (
		<footer className="border-t border-border bg-background">
			<div className="container py-8 md:py-12">
				<div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
					{/* Brand Section */}
					<div className="space-y-4">
						<div className="flex items-center space-x-2">
							<div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
								<Zap className="h-4 w-4 text-white" />
							</div>
							<span className="font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">AI Chat Platform</span>
						</div>
						<p className="text-sm text-muted-foreground max-w-xs">Explore sophisticated AI conversations and debates. Where artificial intelligence meets human curiosity.</p>
						<div className="flex space-x-2">
							<Button variant="ghost" size="sm" asChild>
								<Link href="https://github.com" aria-label="GitHub">
									<Github className="h-4 w-4" />
								</Link>
							</Button>
							<Button variant="ghost" size="sm" asChild>
								<Link href="https://twitter.com" aria-label="Twitter">
									<Twitter className="h-4 w-4" />
								</Link>
							</Button>
							<Button variant="ghost" size="sm" asChild>
								<Link href="https://linkedin.com" aria-label="LinkedIn">
									<Linkedin className="h-4 w-4" />
								</Link>
							</Button>
							<Button variant="ghost" size="sm" asChild>
								<Link href="mailto:contact@example.com" aria-label="Email">
									<Mail className="h-4 w-4" />
								</Link>
							</Button>
						</div>
					</div>

					{/* Platform Links */}
					<div className="space-y-4">
						<h3 className="text-sm font-semibold">Platform</h3>
						<ul className="space-y-2 text-sm">
							<li>
								<Link href="/debate" className="text-muted-foreground hover:text-foreground transition-colors">
									Live Debates
								</Link>
							</li>
							<li>
								<Link href="/blog" className="text-muted-foreground hover:text-foreground transition-colors">
									Case Studies
								</Link>
							</li>
							<li>
								<Link href="/agents" className="text-muted-foreground hover:text-foreground transition-colors">
									AI Agents
								</Link>
							</li>
							<li>
								<Link href="/topics" className="text-muted-foreground hover:text-foreground transition-colors">
									Discussion Topics
								</Link>
							</li>
						</ul>
					</div>

					{/* Resources Links */}
					<div className="space-y-4">
						<h3 className="text-sm font-semibold">Resources</h3>
						<ul className="space-y-2 text-sm">
							<li>
								<Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
									About
								</Link>
							</li>
							<li>
								<Link href="/how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
									How It Works
								</Link>
							</li>
							<li>
								<Link href="/research" className="text-muted-foreground hover:text-foreground transition-colors">
									Research
								</Link>
							</li>
							<li>
								<Link href="/api" className="text-muted-foreground hover:text-foreground transition-colors">
									API Documentation
								</Link>
							</li>
						</ul>
					</div>

					{/* Legal Links */}
					<div className="space-y-4">
						<h3 className="text-sm font-semibold">Legal</h3>
						<ul className="space-y-2 text-sm">
							<li>
								<Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
									Privacy Policy
								</Link>
							</li>
							<li>
								<Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
									Terms of Service
								</Link>
							</li>
							<li>
								<Link href="/cookies" className="text-muted-foreground hover:text-foreground transition-colors">
									Cookie Policy
								</Link>
							</li>
							<li>
								<Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
									Contact
								</Link>
							</li>
						</ul>
					</div>
				</div>

				<Separator className="my-6" />

				<div className="flex flex-col items-center justify-between gap-4 md:flex-row">
					<p className="text-sm text-muted-foreground">© 2024 AI Chat Platform. All rights reserved. Built with Next.js and shadcn/ui.</p>
					<p className="text-sm text-muted-foreground">Powered by artificial intelligence • Made for human curiosity</p>
				</div>
			</div>
		</footer>
	);
}
