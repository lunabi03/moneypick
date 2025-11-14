"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function SocialAuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { socialLogin } = useAuth();

  useEffect(() => {
    const email = searchParams.get("email");
    const name = searchParams.get("name");
    const provider = searchParams.get("provider");

    if (email && name) {
      socialLogin(email, name).then((success) => {
        if (success) {
          router.push("/");
        } else {
          router.push("/login?error=소셜 로그인 중 오류가 발생했습니다");
        }
      });
    } else {
      router.push("/login?error=사용자 정보를 받지 못했습니다");
    }
  }, [searchParams, socialLogin, router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-body-m text-text-secondary">로그인 중...</p>
      </div>
    </div>
  );
}

