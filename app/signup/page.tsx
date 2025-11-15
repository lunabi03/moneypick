"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useAuth } from "@/lib/auth-context";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signUp, signInWithGoogle } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (password.length < 6) {
      setError("비밀번호는 6자 이상이어야 합니다.");
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await signUp(email, password, name);
      if (error) {
        setError(error.message || "회원가입 중 오류가 발생했습니다.");
      } else {
        // 회원가입 성공 시 이메일 확인 안내
        setError("");
        alert("회원가입이 완료되었습니다. 이메일을 확인해주세요.");
        router.push("/login");
      }
    } catch (err) {
      setError("회원가입 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async () => {
    await signInWithGoogle();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-md mx-auto px-5 md:px-8 py-12">
        <Card className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-heading-l font-bold text-text-primary mb-2">회원가입</h1>
            <p className="text-body-s text-text-secondary">
              MoneyPick에 가입하고 다양한 혜택을 받아보세요
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
              <span>구글로 시작하기</span>
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
              <label htmlFor="name" className="block text-body-s font-medium text-text-primary mb-2">
                이름
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="이름을 입력하세요"
                required
                className="w-full h-[52px] px-4 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-body-m"
              />
            </div>

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
                placeholder="비밀번호를 입력하세요 (6자 이상)"
                required
                minLength={6}
                className="w-full h-[52px] px-4 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-body-m"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-body-s font-medium text-text-primary mb-2">
                비밀번호 확인
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="비밀번호를 다시 입력하세요"
                required
                minLength={6}
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
              {isLoading ? "가입 중..." : "회원가입"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-body-s text-text-muted">
              이미 계정이 있으신가요?{" "}
              <button
                onClick={() => router.push("/login")}
                className="text-primary hover:underline font-medium"
              >
                로그인
              </button>
            </p>
          </div>
        </Card>
      </main>
    </div>
  );
}

