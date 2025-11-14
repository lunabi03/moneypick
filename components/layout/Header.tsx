"use client";

import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

const categories = [
  { id: "government", name: "정부지원", path: "/category/government", icon: "🏛️" },
  { id: "sidejob", name: "부업", path: "/category/sidejob", icon: "💼" },
  { id: "investment", name: "투자", path: "/category/investment", icon: "📈" },
  { id: "selfdev", name: "자기계발", path: "/category/selfdev", icon: "📚" },
  { id: "discount", name: "할인", path: "/category/discount", icon: "🎁" },
];

export const Header: React.FC = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-surface border-b border-border">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        {/* 상단 헤더 */}
        <div className="flex items-center justify-between h-16">
          {/* 로고 */}
          <div className="flex items-center">
            <a href="/" className="text-heading-m font-bold text-primary hover:opacity-80 transition-opacity">
              MoneyPick
            </a>
          </div>

          {/* 검색바 (데스크톱) */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="지원금, 부업, 할인 정보 검색..."
                className="w-full h-[52px] px-4 pr-12 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-body-m"
              />
              <button
                type="submit"
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                <svg
                  className="w-5 h-5 text-text-muted"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </form>
          </div>

          {/* 우측 액션 */}
          <div className="flex items-center gap-3">
            {/* 검색 아이콘 (모바일) */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="md:hidden p-2 rounded-xl hover:bg-badge transition-colors"
            >
              <svg
                className="w-6 h-6 text-text-secondary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>

            {/* 알림 */}
            <button className="p-2 rounded-xl hover:bg-badge transition-colors relative">
              <svg
                className="w-6 h-6 text-text-secondary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
            </button>

            {/* 프로필 */}
            <button className="p-2 rounded-xl hover:bg-badge transition-colors">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary text-body-s font-medium">내</span>
              </div>
            </button>
          </div>
        </div>

        {/* 모바일 검색바 */}
        {searchOpen && (
          <div className="md:hidden pb-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="지원금, 부업, 할인 정보 검색..."
                className="w-full h-[52px] px-4 pr-12 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-body-m"
              />
              <button
                type="submit"
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                <svg
                  className="w-5 h-5 text-text-muted"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </form>
          </div>
        )}

        {/* 네비게이션 바 */}
        <div className="border-t border-border">
          {/* 데스크톱 네비게이션 */}
          <div className="hidden md:flex items-center gap-1 py-4">
            <Link
              href="/"
              className={`px-4 py-2 rounded-xl text-body-m font-medium transition-colors ${
                pathname === "/"
                  ? "bg-primary/10 text-primary"
                  : "text-text-secondary hover:bg-badge"
              }`}
            >
              홈
            </Link>
            {categories.map((category) => (
              <Link
                key={category.id}
                href={category.path}
                className={`px-4 py-2 rounded-xl text-body-m font-medium transition-colors ${
                  pathname === category.path
                    ? "bg-primary/10 text-primary"
                    : "text-text-secondary hover:bg-badge"
                }`}
              >
                {category.name}
              </Link>
            ))}
          </div>

          {/* 모바일 네비게이션 */}
          <div className="md:hidden flex items-center gap-1 py-3 overflow-x-auto scrollbar-hide">
            <Link
              href="/"
              className={`flex items-center gap-1 px-3 py-2 rounded-xl text-body-s font-medium transition-colors whitespace-nowrap ${
                pathname === "/"
                  ? "bg-primary/10 text-primary"
                  : "text-text-secondary hover:bg-badge"
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>홈</span>
            </Link>
            {categories.map((category) => (
              <Link
                key={category.id}
                href={category.path}
                className={`flex items-center gap-1 px-3 py-2 rounded-xl text-body-s font-medium transition-colors whitespace-nowrap ${
                  pathname === category.path
                    ? "bg-primary/10 text-primary"
                    : "text-text-secondary hover:bg-badge"
                }`}
              >
                <span className="text-lg">{category.icon}</span>
                <span>{category.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

