import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { createServerClient } from "@/shared/lib/supabase";
import { createDreambigApi } from "@/util/api";

// 관리자 확인 (role)
export default async function AdminGuard({children}:{children:ReactNode}){
    await connection(); 
    const api = createDreambigApi(createServerClient());

//지금 쿠키로 로그인 한 사람이 누군지 확인. 아니면 로그인 페이지로 돌려보낸다
const user = await api.auth.getCurrentUser();
if (!user) redirect("/login?redirectTo=%2Fadmin")

//role확인. 운영자가 아니면 메인으로 이동
const profile = await api.auth.getMyProfile();
if (profile?.role!== "admin") redirect("/")

    return<>{children}</>

}