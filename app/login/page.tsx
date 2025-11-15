"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useAuth } from "@/lib/auth-context";

function LoginContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signInWithGoogle } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // URL 파라미터에서 에러 메시지 확인
    const errorParam = searchParams.get("error");
    if (errorParam) {
      setError(decodeURIComponent(errorParam));
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      console.log("📝 로그인 폼 제출:", email);
      const { error } = await signIn(email, password);
      if (error) {
        console.error("로그인 페이지에서 오류 수신:", error);
        setError(error.message || "이메일과 비밀번호를 확인해주세요.");
      } else {
        console.log("✅ 로그인 성공, 홈으로 이동");
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      console.error("로그인 예외 발생:", err);
      setError(err instanceof Error ? err.message : "로그인 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async () => {
    try {
      console.log("🔐 Google 로그인 버튼 클릭");
      setError("");
      await signInWithGoogle();
    } catch (err) {
      console.error("Google 로그인 예외:", err);
      setError("Google 로그인 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-md mx-auto px-5 md:px-8 py-12">
        <Card className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-heading-l font-bold text-text-primary mb-2">로그인</h1>
            <p className="text-body-s text-text-secondary">
              MoneyPick에 오신 것을 환영합니다
            </p>
          </div>

          {/* 소셜 로그인 */}
          <div className="space-y-3 mb-6">
            <Button
              variant="secondary"
              size="lg"
              className="w-full flex items-center justify-center gap-3 whitespace-nowrap"
              onClick={handleSocialLogin}
            >
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>구글로 로그인</span>
            </Button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-surface text-text-muted">또는</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-body-s font-medium text-text-primary mb-2">
                이메일
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일을 입력하세요"
                required
                className="w-full h-[52px] px-4 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-body-m"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-body-s font-medium text-text-primary mb-2">
                비밀번호
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력하세요"
                required
                className="w-full h-[52px] px-4 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-body-m"
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-error/10 border border-error/20">
                <p className="text-body-s text-error">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "로그인 중..." : "로그인"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-body-s text-text-muted">
              계정이 없으신가요?{" "}
              <button
                onClick={() => router.push("/signup")}
                className="text-primary hover:underline font-medium"
              >
                회원가입
              </button>
            </p>
          </div>
        </Card>
      </main>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-md mx-auto px-5 md:px-8 py-12">
          <Card className="p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-body-m text-text-secondary">로딩 중...</p>
            </div>
          </Card>
        </main>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}

