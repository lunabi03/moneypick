"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { InfoCard } from "@/components/cards/InfoCard";
import { Button } from "@/components/ui/Button";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const [searchQuery, setSearchQuery] = useState(query);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    minAmount: "",
    maxAmount: "",
    difficulty: "",
    deadline: "",
  });

  const categories = [
    "정부·공공 지원금",
    "부업 / 재택근무",
    "투자·자산",
    "자기계발",
    "할인·리워드",
  ];

  // 검색 결과 샘플 데이터
  const searchResults = [
    {
      title: "청년 월세 특별지원",
      category: "정부·공공 지원금",
      description: "19~34세 무주택자, 월세 70만원 이하 대상",
      tags: ["청년", "월세", "무주택자"],
      amount: "최대 30만원/3개월",
      deadline: "D-7",
      difficulty: "보통",
      matchRate: 78,
    },
    {
      title: "온라인 강의 제작 및 판매",
      category: "부업 / 재택근무",
      description: "전문 지식을 활용한 온라인 강의 제작 및 판매 플랫폼",
      tags: ["재택", "온라인", "지식"],
      amount: "월 50~200만원",
      difficulty: "보통",
    },
  ];

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-5 md:px-8 py-6 md:py-8">
        {/* 검색 헤더 */}
        <section className="mb-8">
          <h1 className="text-heading-l font-bold text-text-primary mb-6">
            검색 결과
          </h1>

          {/* 검색바 */}
          <div className="relative mb-6">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="지원금, 부업, 할인 정보 검색..."
              className="w-full h-[52px] px-4 pr-12 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-body-m"
            />
            <svg
              className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted"
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
          </div>
        </section>

        <div className="flex flex-col md:flex-row gap-6">
          {/* 필터 사이드바 */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <div className="bg-surface rounded-card p-6 shadow-card sticky top-24">
              <h2 className="text-heading-m font-bold text-text-primary mb-4">
                필터
              </h2>

              {/* 카테고리 */}
              <div className="mb-6">
                <h3 className="text-body-m font-semibold text-text-primary mb-3">
                  카테고리
                </h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label
                      key={category}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={() => handleCategoryToggle(category)}
                        className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                      />
                      <span className="text-body-s text-text-secondary">
                        {category}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 지원 금액 */}
              <div className="mb-6">
                <h3 className="text-body-m font-semibold text-text-primary mb-3">
                  지원 금액
                </h3>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="최소"
                    value={filters.minAmount}
                    onChange={(e) =>
                      setFilters({ ...filters, minAmount: e.target.value })
                    }
                    className="w-full h-10 px-3 rounded-lg border border-border text-body-s focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input
                    type="number"
                    placeholder="최대"
                    value={filters.maxAmount}
                    onChange={(e) =>
                      setFilters({ ...filters, maxAmount: e.target.value })
                    }
                    className="w-full h-10 px-3 rounded-lg border border-border text-body-s focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {/* 난이도 */}
              <div className="mb-6">
                <h3 className="text-body-m font-semibold text-text-primary mb-3">
                  난이도
                </h3>
                <select
                  value={filters.difficulty}
                  onChange={(e) =>
                    setFilters({ ...filters, difficulty: e.target.value })
                  }
                  className="w-full h-10 px-3 rounded-lg border border-border text-body-s focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">전체</option>
                  <option value="easy">쉬움</option>
                  <option value="normal">보통</option>
                  <option value="hard">어려움</option>
                </select>
              </div>

              {/* 필터 적용/초기화 */}
              <div className="flex gap-2">
                <Button variant="primary" size="sm" className="flex-1">
                  적용
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    setSelectedCategories([]);
                    setFilters({
                      minAmount: "",
                      maxAmount: "",
                      difficulty: "",
                      deadline: "",
                    });
                  }}
                >
                  초기화
                </Button>
              </div>
            </div>
          </aside>

          {/* 검색 결과 */}
          <section className="flex-1">
            {searchQuery && (
              <div className="mb-6">
                <p className="text-body-m text-text-secondary">
                  &quot;{searchQuery}&quot; 검색 결과 {searchResults.length}개
                </p>
              </div>
            )}

            {searchResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.map((result, index) => (
                  <InfoCard key={index} {...result} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-body-l text-text-secondary mb-4">
                  검색 결과가 없습니다
                </p>
                <p className="text-body-m text-text-muted mb-6">
                  다른 키워드로 검색해보세요
                </p>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategories([]);
                    setFilters({
                      minAmount: "",
                      maxAmount: "",
                      difficulty: "",
                      deadline: "",
                    });
                  }}
                >
                  검색 초기화
                </Button>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

