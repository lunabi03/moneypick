"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const categories = [
  { id: "government", name: "정부지원", path: "/category/government", icon: "🏛️" },
  { id: "sidejob", name: "부업", path: "/category/sidejob", icon: "💼" },
  { id: "investment", name: "투자", path: "/category/investment", icon: "📈" },
  { id: "selfdev", name: "자기계발", path: "/category/selfdev", icon: "📚" },
  { id: "discount", name: "할인", path: "/category/discount", icon: "🎁" },
];

export const Navigation: React.FC = () => {
  const pathname = usePathname();

  return (
    <nav className="bg-surface border-b border-border">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
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

        {/* 모바일 상단 네비게이션 */}
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
    </nav>
  );
};

