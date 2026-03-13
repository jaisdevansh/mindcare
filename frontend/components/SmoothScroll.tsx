"use client";

import { ReactLenis } from "lenis/react";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";

interface SmoothScrollProps {
    children: ReactNode;
}

/**
 * SmoothScroll component using Lenis for butter-smooth scrolling.
 * Wrapped around the main layout to provide consistent smooth scrolling across the app.
 */
export const SmoothScroll = ({ children }: SmoothScrollProps) => {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith('/admin');

    if (isAdmin) return <>{children}</>;

    return (
        <ReactLenis
            root
            options={{
                duration: 1.8,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                orientation: "vertical",
                gestureOrientation: "vertical",
                smoothWheel: true,
                wheelMultiplier: 1.1,
                touchMultiplier: 1.5,
                infinite: false,
            }}
        >
            {children}
        </ReactLenis>
    );
};

