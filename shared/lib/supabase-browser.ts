// 정기 서버 전용 코드가 들어오지 않게 브라우저용 연결 파일
import { createBrowserClient } from "@supabase/ssr";
import { Database } from "@/util/types";
const supabaseUrl = 
process.env.NEXT_PUBLIC_SUPABASE_URL || "";

const supabasePublishableKey =
process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "";

export const supabase = createBrowserClient<Database>(
    supabaseUrl,
    supabasePublishableKey
);