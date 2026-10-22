"use client"

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

//admin에서 헤더와 푸터 숨김
export default function HideOnAdmin({children}:{children:ReactNode}){
    const pathname = usePathname();
    if (pathname.startsWith("/admin")) return null;
    return<>{children}</>
}