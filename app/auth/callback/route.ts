import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // 사용자 프로필 확인 및 생성
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // 프로필이 있는지 확인
        const { data: profile } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        // 프로필이 없으면 생성
        if (!profile) {
          await supabase
            .from("user_profiles")
            .insert({
              id: user.id,
              email: user.email,
              name: user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split("@")[0] || "사용자",
              avatar_url: user.user_metadata?.avatar_url,
            });
        }
      }

      return NextResponse.redirect(`${origin}/`);
    }
  }

  // 오류 발생 시 로그인 페이지로 리다이렉트
  return NextResponse.redirect(`${origin}/login?error=인증 중 오류가 발생했습니다`);
}

