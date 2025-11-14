import { NextResponse } from "next/server";

export async function GET() {
  const clientId = process.env.KAKAO_CLIENT_ID;
  const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/auth/kakao/callback`;
  
  if (!clientId) {
    return NextResponse.json(
      { error: "Kakao OAuth가 설정되지 않았습니다." },
      { status: 500 }
    );
  }

  const authUrl = `https://kauth.kakao.com/oauth/authorize?${new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
  })}`;

  return NextResponse.redirect(authUrl);
}

