import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const errorParam = requestUrl.searchParams.get("error");
  const errorDescription = requestUrl.searchParams.get("error_description");
  const origin = requestUrl.origin;

  // OAuth 오류가 있는 경우
  if (errorParam) {
    console.error("❌ OAuth 콜백 오류:", errorParam);
    console.error("오류 설명:", errorDescription);
    const errorMessage = errorDescription 
      ? decodeURIComponent(errorDescription)
      : "인증 중 오류가 발생했습니다";
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(errorMessage)}`);
  }

  if (code) {
    console.log("✅ OAuth 코드 수신됨, 세션 교환 시도...");
    const supabase = createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error("❌ 세션 교환 오류:", error);
      console.error("오류 메시지:", error.message);
      return NextResponse.redirect(
        `${origin}/login?error=${encodeURIComponent(error.message || "세션 교환 중 오류가 발생했습니다")}`
      );
    }
    
    if (data?.user) {
      console.log("✅ 세션 교환 성공, 사용자 프로필 확인 중...");
      // 사용자 프로필 확인 및 생성
      const { data: user } = await supabase.auth.getUser();
      
      if (user?.user) {
        // 프로필이 있는지 확인
        const { data: profile, error: profileError } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("id", user.user.id)
          .single();

        if (profileError && profileError.code !== "PGRST116") {
          console.error("⚠️ 프로필 조회 오류:", profileError);
        }

        // 프로필이 없으면 생성
        if (!profile) {
          console.log("📝 사용자 프로필 생성 중...");
          const { error: insertError } = await supabase
            .from("user_profiles")
            .insert({
              id: user.user.id,
              email: user.user.email,
              name: user.user.user_metadata?.name || user.user.user_metadata?.full_name || user.user.email?.split("@")[0] || "사용자",
              avatar_url: user.user.user_metadata?.avatar_url,
            });

          if (insertError) {
            console.error("⚠️ 프로필 생성 오류:", insertError);
          } else {
            console.log("✅ 사용자 프로필 생성 완료");
          }
        } else {
          console.log("✅ 기존 프로필 확인됨");
        }
      }

      console.log("✅ 인증 완료, 홈으로 리다이렉트");
      return NextResponse.redirect(`${origin}/`);
    }
  }

  // 코드가 없는 경우
  console.error("❌ OAuth 코드가 없습니다");
  return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent("인증 코드를 받지 못했습니다")}`);
}

