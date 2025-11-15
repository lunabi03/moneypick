import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

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
    console.log("OAuth 코드:", code.substring(0, 20) + "...");
    
    // Request에서 직접 쿠키 읽기 (Next.js 14+ 쿠키 지연 평가 문제 해결)
    const requestHeaders = request.headers;
    const cookieHeader = requestHeaders.get("cookie") || "";
    console.log("요청 쿠키 헤더:", cookieHeader ? "있음" : "없음");
    
    // Next.js 14+ 쿠키 지연 평가 문제 해결: 쿠키를 강제로 평가
    const cookieStore = cookies();
    const allCookies = cookieStore.getAll(); // 쿠키를 강제로 평가하여 code verifier 쿠키가 읽히도록 함
    
    // PKCE code verifier 쿠키 확인 (Supabase는 sb-{project-ref}-auth-token-code-verifier 형식 사용)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const projectRef = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1] || "";
    const codeVerifierCookieName = `sb-${projectRef}-auth-token-code-verifier`;
    
    const codeVerifierCookie = allCookies.find(cookie => 
      cookie.name === codeVerifierCookieName || 
      cookie.name.includes('code-verifier') || 
      cookie.name.includes('verifier')
    );
    
    if (codeVerifierCookie) {
      console.log("✅ Code verifier 쿠키 발견:", codeVerifierCookie.name);
    } else {
      console.warn("⚠️ Code verifier 쿠키를 찾을 수 없습니다!");
      console.log("예상 쿠키 이름:", codeVerifierCookieName);
      console.log("사용 가능한 쿠키:", allCookies.map(c => c.name).join(", "));
      console.log("요청 쿠키 헤더에서 확인:", cookieHeader.includes('code-verifier') || cookieHeader.includes('verifier') ? "발견됨" : "없음");
    }
    
    // Request에서 직접 쿠키를 읽어서 Supabase 클라이언트 생성
    // 이렇게 하면 쿠키 지연 평가 문제를 완전히 우회할 수 있음
    const cookieStore = cookies();
    cookieStore.getAll(); // 쿠키 강제 평가
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            try {
              cookieStore.set({ name, value, ...options });
            } catch (error) {
              // Server Component에서 set 호출 시 무시
            }
          },
          remove(name: string, options: CookieOptions) {
            try {
              cookieStore.set({ name, value: '', ...options });
            } catch (error) {
              // Server Component에서 remove 호출 시 무시
            }
          },
        },
      }
    );
    
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error("❌ 세션 교환 오류:", error);
      console.error("오류 메시지:", error.message);
      console.error("오류 상태:", error.status);
      console.error("전체 오류 객체:", JSON.stringify(error, null, 2));
      
      // 더 자세한 오류 정보를 URL에 포함
      const errorDetails = error.message || "세션 교환 중 오류가 발생했습니다";
      return NextResponse.redirect(
        `${origin}/login?error=${encodeURIComponent(errorDetails)}`
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

