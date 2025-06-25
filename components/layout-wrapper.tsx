"use client";

import { usePathname } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

interface LayoutWrapperProps {
	children: React.ReactNode;
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
	const pathname = usePathname();

	// Exclude header and footer from debate pages
	const isDebatePage = pathname?.startsWith("/debate");

	if (isDebatePage) {
		return <>{children}</>;
	}

	return (
		<div className="relative flex min-h-screen flex-col">
			<SiteHeader />
			<main className="flex-1">{children}</main>
			<SiteFooter />
		</div>
	);
}
