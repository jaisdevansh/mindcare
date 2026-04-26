"use client";

import { ReactLenis } from "lenis/react";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";

interface SmoothScrollProps {
    children: ReactNode;
}

// Routes where body/document is the natural scroll container — Lenis works great here
const LENIS_ROUTES = ['/', '/about', '/support', '/plans', '/share-space', '/talk-to-helper',
    '/login', '/signup', '/verify-email', '/forgot-password', '/reset-password', '/choose-mode', '/apply-helper'];

/**
 * SmoothScroll using Lenis — only active on public/auth pages.
 * Dashboard/app pages use overflow-y-auto on an inner div (h-screen layout),
 * so Lenis root mode would conflict and break scrolling there.
 */
export const SmoothScroll = ({ children }: SmoothScrollProps) => {
    const pathname = usePathname();
    const useLenis = LENIS_ROUTES.includes(pathname);

    if (!useLenis) {
        return <>{children}</>;
    }

    return (
        <ReactLenis
            root
            options={{
                duration: 0.8,
                easing: (t) => 1 - Math.pow(1 - t, 4),
                orientation: "vertical",
                gestureOrientation: "vertical",
                smoothWheel: true,
                wheelMultiplier: 1.2,
                touchMultiplier: 1.5,
                infinite: false,
            }}
        >
            {children}
        </ReactLenis>
    );
};
