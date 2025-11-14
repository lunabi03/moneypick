import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");
  const name = searchParams.get("name");
  const provider = searchParams.get("provider");

  if (!email || !name) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/login?error=사용자 정보를 받지 못했습니다`
    );
  }

  // 사용자 정보를 쿼리 파라미터로 전달하여 클라이언트에서 처리
  const params = new URLSearchParams({
    email,
    name,
    provider: provider || "unknown",
  });

  // 클라이언트 사이드에서 처리할 수 있도록 리다이렉트
  return NextResponse.redirect(
    `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/auth/social?${params.toString()}`
  );
}

