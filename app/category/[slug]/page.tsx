"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { InfoCard } from "@/components/cards/InfoCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

const categoryData: Record<string, {
  title: string;
  description: string;
  icon: string;
  programs: Array<{
    title: string;
    category: string;
    description: string;
    tags?: string[];
    amount?: string;
    deadline?: string;
    difficulty?: string;
    matchRate?: number;
  }>;
}> = {
  government: {
    title: "정부·공공 지원금 / 보조금",
    description: "정부와 공공기관에서 제공하는 다양한 지원금과 보조금 정보",
    icon: "🏛️",
    programs: [
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
        title: "신혼부부 주거지원금",
        category: "정부·공공 지원금",
        description: "혼인신고 후 7년 이내 부부 대상 주거비 지원",
        tags: ["신혼부부", "주거", "지원금"],
        amount: "최대 100만원",
        deadline: "D-15",
        difficulty: "쉬움",
        matchRate: 85,
      },
      {
        title: "소상공인 경영안정자금",
        category: "정부·공공 지원금",
        description: "영세 소상공인 대상 경영안정 자금 대출 지원",
        tags: ["소상공인", "대출", "경영안정"],
        amount: "최대 3,000만원",
        deadline: "D-20",
        difficulty: "어려움",
        matchRate: 65,
      },
      {
        title: "청년 창업 지원금",
        category: "정부·공공 지원금",
        description: "39세 이하 청년 창업자 대상 창업 자금 지원",
        tags: ["청년", "창업", "자금"],
        amount: "최대 5,000만원",
        deadline: "D-30",
        difficulty: "어려움",
        matchRate: 60,
      },
      {
        title: "농어민 재해 복구 지원금",
        category: "정부·공공 지원금",
        description: "자연재해로 피해를 입은 농어민 대상 복구 지원",
        tags: ["농어민", "재해", "복구"],
        amount: "피해 규모에 따라",
        deadline: "D-10",
        difficulty: "보통",
        matchRate: 70,
      },
    ],
  },
  sidejob: {
    title: "부업 / 재택근무 / 프리랜스 수익",
    description: "부업, 재택근무, 프리랜스로 수익을 창출할 수 있는 다양한 기회",
    icon: "💼",
    programs: [
      {
        title: "온라인 강의 제작 및 판매",
        category: "부업 / 재택근무",
        description: "전문 지식을 활용한 온라인 강의 제작 및 판매 플랫폼",
        tags: ["재택", "온라인", "지식"],
        amount: "월 50~200만원",
        difficulty: "보통",
      },
      {
        title: "번역 및 통역 프리랜스",
        category: "부업 / 프리랜스",
        description: "외국어 능력을 활용한 번역 및 통역 프리랜스 업무",
        tags: ["프리랜스", "번역", "외국어"],
        amount: "건당 10~50만원",
        difficulty: "보통",
      },
      {
        title: "온라인 쇼핑몰 대행 운영",
        category: "부업 / 재택근무",
        description: "중국 직구 상품 대행 판매 및 고객 관리",
        tags: ["재택", "판매", "대행"],
        amount: "월 30~150만원",
        difficulty: "쉬움",
      },
      {
        title: "웹툰 작가 데뷔",
        category: "부업 / 프리랜스",
        description: "웹툰 플랫폼에 작품을 연재하여 수익 창출",
        tags: ["웹툰", "창작", "연재"],
        amount: "월 100~500만원",
        difficulty: "보통",
      },
      {
        title: "온라인 상담사",
        category: "부업 / 재택근무",
        description: "심리 상담, 법률 상담 등 전문 분야 온라인 상담",
        tags: ["재택", "상담", "전문가"],
        amount: "시간당 3~10만원",
        difficulty: "어려움",
      },
    ],
  },
  investment: {
    title: "투자·자산·리셀 (실물 경제형 수익)",
    description: "투자와 자산 관리, 리셀을 통한 실물 경제형 수익 창출",
    icon: "📈",
    programs: [
      {
        title: "부동산 투자 리츠(REITs)",
        category: "투자·자산",
        description: "부동산 간접투자를 통한 배당 수익 창출",
        tags: ["부동산", "배당", "투자"],
        amount: "연 5~8% 수익률",
        difficulty: "보통",
      },
      {
        title: "중고 명품 리셀 비즈니스",
        category: "리셀",
        description: "명품 가방, 시계 등 중고 명품 구매 후 재판매",
        tags: ["리셀", "명품", "중고"],
        amount: "건당 10~30% 마진",
        difficulty: "어려움",
      },
      {
        title: "크라우드펀딩 투자",
        category: "투자·자산",
        description: "스타트업 크라우드펀딩을 통한 투자 수익",
        tags: ["투자", "스타트업", "펀딩"],
        amount: "연 7~15% 수익률",
        difficulty: "보통",
      },
      {
        title: "골동품 및 수집품 투자",
        category: "투자·자산",
        description: "골동품, 예술품, 수집품 투자를 통한 가치 상승 수익",
        tags: ["투자", "골동품", "수집품"],
        amount: "장기 수익률 변동",
        difficulty: "어려움",
      },
      {
        title: "중고차 리셀",
        category: "리셀",
        description: "중고차 구매 후 정비 및 판매를 통한 수익",
        tags: ["리셀", "중고차", "자동차"],
        amount: "건당 50~200만원",
        difficulty: "보통",
      },
    ],
  },
  selfdev: {
    title: "자기계발·자격증 기반 수익",
    description: "자격증 취득과 자기계발을 통한 수익 창출 기회",
    icon: "📚",
    programs: [
      {
        title: "공인회계사(CPA) 자격증",
        category: "자격증",
        description: "회계 전문가 자격증 취득 후 회계사무소 취업",
        tags: ["자격증", "회계", "전문가"],
        amount: "연봉 3,000~5,000만원",
        difficulty: "어려움",
      },
      {
        title: "정보처리기사 자격증",
        category: "자격증",
        description: "IT 분야 기본 자격증으로 개발자 취업 기회 확대",
        tags: ["자격증", "IT", "개발"],
        amount: "연봉 3,500~6,000만원",
        difficulty: "보통",
      },
      {
        title: "온라인 마케팅 전문가 과정",
        category: "자기계발",
        description: "디지털 마케팅 스킬 습득 후 프리랜스 또는 취업",
        tags: ["마케팅", "디지털", "스킬"],
        amount: "월 200~500만원",
        difficulty: "보통",
      },
      {
        title: "변리사 자격증",
        category: "자격증",
        description: "특허 및 지적재산권 전문가 자격증",
        tags: ["자격증", "특허", "법률"],
        amount: "연봉 4,000~8,000만원",
        difficulty: "어려움",
      },
      {
        title: "데이터 분석가 양성 과정",
        category: "자기계발",
        description: "빅데이터 분석 스킬 습득 후 데이터 분석가 취업",
        tags: ["데이터", "분석", "빅데이터"],
        amount: "연봉 4,000~7,000만원",
        difficulty: "보통",
      },
    ],
  },
  discount: {
    title: "할인·리워드·절약 정보",
    description: "다양한 할인 혜택, 리워드 프로그램, 절약 정보",
    icon: "🎁",
    programs: [
      {
        title: "신용카드 캐시백 이벤트",
        category: "리워드",
        description: "주요 신용카드사 캐시백 및 적립 이벤트 정보",
        tags: ["카드", "캐시백", "적립"],
        amount: "월 최대 10만원",
        deadline: "D-5",
      },
      {
        title: "통신비 할인 프로모션",
        category: "할인",
        description: "통신사 요금제 변경 시 제공되는 할인 혜택",
        tags: ["통신", "할인", "요금제"],
        amount: "월 2~5만원 절약",
        deadline: "상시",
      },
      {
        title: "공공요금 자동납부 할인",
        category: "절약",
        description: "전기, 가스, 수도 요금 자동납부 시 할인 혜택",
        tags: ["공공요금", "자동납부", "할인"],
        amount: "월 1~3만원 절약",
        deadline: "상시",
      },
      {
        title: "온라인 쇼핑몰 적립금 이벤트",
        category: "리워드",
        description: "온라인 쇼핑몰 적립금 및 쿠폰 이벤트 정보",
        tags: ["쇼핑", "적립금", "쿠폰"],
        amount: "구매액의 5~10%",
        deadline: "D-7",
      },
      {
        title: "공연 및 영화 할인 정보",
        category: "할인",
        description: "공연, 영화, 문화시설 이용 시 할인 혜택",
        tags: ["문화", "할인", "공연"],
        amount: "최대 50% 할인",
        deadline: "상시",
      },
    ],
  },
};

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const category = categoryData[slug] || categoryData.government;

  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("recommended");

  const filters = [
    { id: "all", label: "전체" },
    { id: "easy", label: "쉬움" },
    { id: "normal", label: "보통" },
    { id: "hard", label: "어려움" },
  ];

  const sortOptions = [
    { id: "recommended", label: "추천 순" },
    { id: "deadline", label: "마감 임박" },
    { id: "amount", label: "지원 금액" },
    { id: "difficulty", label: "난이도" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-5 md:px-8 py-6 md:py-8">
        {/* 카테고리 헤더 */}
        <section className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">{category.icon}</span>
            <div>
              <h1 className="text-display font-bold text-text-primary">
                {category.title}
              </h1>
              <p className="text-body-m text-text-secondary mt-2">
                {category.description}
              </p>
            </div>
          </div>
        </section>

        {/* 필터 및 정렬 */}
        <section className="mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            {/* 필터 */}
            <div className="flex items-center gap-2 flex-wrap">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setSelectedFilter(filter.id)}
                  className={`px-4 py-2 rounded-xl text-body-m font-medium transition-colors ${
                    selectedFilter === filter.id
                      ? "bg-primary text-white"
                      : "bg-badge text-text-secondary hover:bg-primary/10"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {/* 정렬 */}
            <div className="flex items-center gap-2">
              <span className="text-body-s text-text-muted">정렬:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 rounded-xl border border-border bg-surface text-body-m focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {sortOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* 프로그램 리스트 */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {category.programs.map((program, index) => (
              <InfoCard key={index} {...program} />
            ))}
          </div>
        </section>

        {/* 빈 상태 (필터 적용 시) */}
        {selectedFilter !== "all" && (
          <div className="text-center py-12">
            <p className="text-body-m text-text-muted">
              선택한 필터에 해당하는 정보가 없습니다.
            </p>
            <Button
              variant="ghost"
              size="md"
              className="mt-4"
              onClick={() => setSelectedFilter("all")}
            >
              필터 초기화
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}

