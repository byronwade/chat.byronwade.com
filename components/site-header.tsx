"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { MessageSquare, BookOpen, Users, Zap, Menu, X, ArrowLeft } from "lucide-react";
import { useState } from "react";

export function SiteHeader() {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const pathname = usePathname();

	// Check if we're on a case study detail page (not the index)
	const isCaseStudyDetail = pathname?.startsWith("/blog/") && pathname !== "/blog";

	const navigation = [
		{ name: "Home", href: "/", icon: MessageSquare },
		{ name: "Debates", href: "/debate", icon: Users },
		{ name: "Case Studies", href: "/blog", icon: BookOpen },
	];

	// Case study detail header layout
	if (isCaseStudyDetail) {
		return (
			<header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-sm">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							{/* Back button */}
							<Button variant="outline" size="sm" className="bg-background/50 border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-colors" asChild>
								<Link href="/blog">
									<ArrowLeft className="h-4 w-4" />
									<span className="hidden sm:inline">Back to Case Studies</span>
								</Link>
							</Button>

							{/* Separator */}
							<div className="h-4 w-px bg-border hidden sm:block" />

							{/* Navigation links */}
							<nav className="hidden sm:flex items-center gap-3">
								{navigation.map((item) => {
									const Icon = item.icon;
									const isActive = pathname === item.href;
									return (
										<Button key={item.name} variant="ghost" size="sm" className={`text-muted-foreground hover:text-foreground transition-colors ${isActive ? "text-primary" : ""}`} asChild>
											<Link href={item.href}>
												<Icon className="h-4 w-4" />
												<span className="hidden md:inline">{item.name}</span>
											</Link>
										</Button>
									);
								})}
							</nav>

							{/* Mobile menu button for case study detail */}
							<Button variant="ghost" size="sm" className="sm:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
								{isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
								<span className="sr-only">Toggle Menu</span>
							</Button>
						</div>

						<div className="flex items-center gap-4">
							<div className="text-sm text-muted-foreground hidden md:block">15m read</div>
							<ThemeToggle />
						</div>
					</div>

					{/* Mobile Navigation Menu for case study detail */}
					{isMobileMenuOpen && (
						<div className="sm:hidden border-t border-border/50 mt-4 pt-4">
							<nav className="flex flex-col space-y-2">
								{navigation.map((item) => {
									const Icon = item.icon;
									const isActive = pathname === item.href;
									return (
										<Link key={item.name} href={item.href} className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`} onClick={() => setIsMobileMenuOpen(false)}>
											<Icon className="h-4 w-4" />
											<span>{item.name}</span>
										</Link>
									);
								})}
							</nav>
						</div>
					)}
				</div>
			</header>
		);
	}

	// Default header layout for all other pages (including case studies index)
	return (
		<header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur-xl shadow-sm">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex h-16 items-center justify-between">
					{/* Logo and Brand */}
					<div className="flex items-center">
						<Link href="/" className="flex items-center space-x-3">
							<div className="flex items-center justify-center w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
								<Zap className="h-5 w-5 text-white" />
							</div>
							<span className="hidden sm:inline-block text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">AI Chat Platform</span>
						</Link>
					</div>

					{/* Desktop Navigation - Centered */}
					<nav className="hidden md:flex items-center space-x-8">
						{navigation.map((item) => {
							const Icon = item.icon;
							const isActive = pathname === item.href;
							return (
								<Link key={item.name} href={item.href} className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}>
									<Icon className="h-4 w-4" />
									<span>{item.name}</span>
								</Link>
							);
						})}
					</nav>

					{/* Right side - Theme toggle and mobile menu */}
					<div className="flex items-center space-x-2">
						<ThemeToggle />

						{/* Mobile menu button */}
						<Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
							{isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
							<span className="sr-only">Toggle Menu</span>
						</Button>
					</div>
				</div>

				{/* Mobile Navigation Menu */}
				{isMobileMenuOpen && (
					<div className="md:hidden border-t border-border/50 py-4">
						<nav className="flex flex-col space-y-2">
							{navigation.map((item) => {
								const Icon = item.icon;
								const isActive = pathname === item.href;
								return (
									<Link key={item.name} href={item.href} className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`} onClick={() => setIsMobileMenuOpen(false)}>
										<Icon className="h-4 w-4" />
										<span>{item.name}</span>
									</Link>
								);
							})}
						</nav>
					</div>
				)}
			</div>
		</header>
	);
}
