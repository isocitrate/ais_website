"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import styles from "./Header.module.css";

// Main menu (based on the Figma mockup).
// Main menu, in the homepage's order (who we are, what we do, what we've made,
// what's on, join). The logo links home, so there's no "Home" item.
// Only items with real pages: add Resources back once it has one.
const navItems = [
	{ label: "About", href: "/about-us" },
	{
		label: "Programs",
		children: [
			{ label: "Fellowships", href: "/fellowships" },
			{ label: "Working Groups", href: "/working-groups" },
			{ label: "Writing Room", href: "/writing-room" },
			{ label: "XLab Summer Research Fellowship", href: "https://xrisk.uchicago.edu/fellowship.html" },
		],
	},
	{ label: "Research", href: "/research" },
	{ label: "Events", href: "/events" },
	// A plain link like the rest: the hero carries the one loud call to action.
	{ label: "Get involved", href: "/get-involved" },
];

// Fellowship track pages aren't in the menu any more; keep "Programs" marked
// as current on them.
const programPaths = [
	"/fellowships",
	"/working-groups",
	"/writing-room",
	"/ai-safety-fundamentals",
	"/policy-governance",
	"/economics-of-transformative-ai",
	"/strategy-group",
];

// Menu link: internal pages use Next's <Link>; external URLs open in a new tab
// (and get the site-wide ↗ automatically).
function MenuLink({ href, className, children }) {
	if (href.startsWith("http")) {
		return (
			<a href={href} target="_blank" rel="noopener noreferrer" className={className}>
				{children}
			</a>
		);
	}
	return (
		<Link href={href} className={className}>
			{children}
		</Link>
	);
}

const Header = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const pathname = usePathname();
	// At the top of the page the menu floats over the content with no background.
	// Once scrolled it becomes a compact bar with a background that hides while
	// scrolling down and slides back in when scrolling up.
	const [isScrolled, setIsScrolled] = useState(false);
	const [isHidden, setIsHidden] = useState(false);
	// Programs dropdown: opens on hover, keyboard focus, or click.
	const [isProgramsOpen, setIsProgramsOpen] = useState(false);

	useEffect(() => {
		setIsProgramsOpen(false);
	}, [pathname]);

	useEffect(() => {
		let lastY = window.scrollY;
		let frame = 0;
		const update = () => {
			frame = 0;
			const y = window.scrollY;
			const delta = y - lastY;
			setIsScrolled(y > 8);
			if (y <= 8) setIsHidden(false);
			else if (delta > 4) setIsHidden(true);
			else if (delta < -4) setIsHidden(false);
			if (Math.abs(delta) > 4 || y <= 8) lastY = y;
		};
		const onScroll = () => {
			if (!frame) frame = requestAnimationFrame(update);
		};
		update();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => {
			window.removeEventListener("scroll", onScroll);
			if (frame) cancelAnimationFrame(frame);
		};
	}, []);

	useEffect(() => {
		setIsMenuOpen(false);
	}, [pathname]);

	useEffect(() => {
		if (isMenuOpen) {
			document.body.classList.add("menu-open");
		} else {
			document.body.classList.remove("menu-open");
		}

		return () => {
			document.body.classList.remove("menu-open");
		};
	}, [isMenuOpen]);

	useEffect(() => {
		if (!isMenuOpen) return;
		const onKeyDown = (e) => {
			if (e.key === "Escape") setIsMenuOpen(false);
		};
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [isMenuOpen]);

	const isActive = (item) =>
		item.children ? programPaths.includes(pathname) : pathname === item.href;

	return (
		<>
			<header
				className={`${styles.header} ${isScrolled || isMenuOpen ? styles.scrolled : ""} ${
					isHidden && !isMenuOpen ? styles.hidden : ""
				}`}
				// Keyboard users tabbing into a hidden menu bring it back.
				onFocus={() => setIsHidden(false)}>
				<div className={styles.container}>
					<Link
						href="/"
						className={styles.headerHomeMark}
						aria-label="AI Safety Group home">
						<Image
							src="/home/x-lab-mark.png"
							alt=""
							width={561}
							height={561}
							priority
						/>
					</Link>
					<nav className={styles.desktopNav} aria-label="Main navigation">
						<ul className={styles.navList}>
							{navItems.map((item) => (
								<li
									key={item.label}
									className={`${styles.navItem} ${
										item.children && isProgramsOpen ? styles.dropdownOpen : ""
									}`}
									{...(item.children
										? {
												onMouseEnter: () => setIsProgramsOpen(true),
												onMouseLeave: () => setIsProgramsOpen(false),
												onBlur: (e) => {
													if (!e.currentTarget.contains(e.relatedTarget)) setIsProgramsOpen(false);
												},
												onKeyDown: (e) => {
													if (e.key === "Escape") setIsProgramsOpen(false);
												},
										  }
										: {})}>
									{item.children ? (
										<button
											type="button"
											aria-expanded={isProgramsOpen}
											aria-controls="programs-menu"
											onClick={() => setIsProgramsOpen((open) => !open)}
											className={`${styles.navLink} ${styles.navButton} ${
												isActive(item) ? styles.navLinkActive : ""
											}`}>
											{item.label}
										</button>
									) : (
										<Link
											href={item.href}
											aria-current={isActive(item) ? "page" : undefined}
											className={`${styles.navLink} ${
												isActive(item) ? styles.navLinkActive : ""
											}`}>
											{item.label}
										</Link>
									)}
									{item.children && (
										<ul id="programs-menu" className={styles.dropdown}>
											{item.children.map((child) => (
												<li key={child.label}>
													<MenuLink href={child.href} className={styles.dropdownLink}>
														{child.label}
													</MenuLink>
												</li>
											))}
										</ul>
									)}
								</li>
							))}
						</ul>
					</nav>

					<button
						className={`${styles.mobileMenuButton} ${
							isMenuOpen ? styles.open : ""
						}`}
						onClick={() => setIsMenuOpen(!isMenuOpen)}
						aria-label="Toggle menu"
						aria-expanded={isMenuOpen}>
						<span></span>
						<span></span>
						<span></span>
					</button>
				</div>
			</header>

			{/* The header is fixed; this keeps page content from starting underneath it.
          The homepage hero pulls itself up under the floating menu. */}
			<div className={styles.spacer} aria-hidden="true" />

			{/* Rendered outside <header>: its backdrop-filter would otherwise trap this
          fixed overlay inside the header's box instead of the viewport. */}
			{isMenuOpen && (
				<nav className={styles.mobileNav} aria-label="Mobile navigation">
					<ul className={styles.mobileNavList}>
						{navItems.map((item) => (
							<li key={item.label}>
								{item.href ? (
									<Link
										href={item.href}
										className={styles.mobileNavLink}>
										{item.label}
									</Link>
								) : (
									<span className={styles.mobileNavLink}>{item.label}</span>
								)}
								{item.children && (
									<ul className={styles.mobileSubList}>
										{item.children.map((child) => (
											<li key={child.label}>
												<MenuLink href={child.href} className={styles.mobileSubLink}>
													{child.label}
												</MenuLink>
											</li>
										))}
									</ul>
								)}
							</li>
						))}
					</ul>
				</nav>
			)}
		</>
	);
};

export default Header;
