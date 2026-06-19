"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthRoutesLayout({ children }: { children: ReactNode; }) {
    
    const router = useRouter();

    useEffect(() => { router.refresh(); }, [router]);
    
    return children;
}