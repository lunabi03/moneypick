"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { HighlightCard } from "@/components/cards/HighlightCard";
import { InfoCard } from "@/components/cards/InfoCard";
import { Button } from "@/components/ui/Button";
import { GovernmentProgram } from "@/lib/types";

export default function Home() {
  const [governmentPrograms, setGovernmentPrograms] = useState<GovernmentProgram[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 정부 지원금 데이터 가져오기
    fetch("/api/government-programs")
      .then((res) => res.json())
      .then((data) => {
        if (data.programs) {
          setGovernmentPrograms(data.programs);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("데이터 로드 오류:", error);
        setLoading(false);
      });
  }, []);

  const highlightData = {
    title: governmentPrograms[0]?.title || "국민취업지원제도",
    description: governmentPrograms[0]?.description || "구직자 대상 취업지원서비스 및 생계안정 지원. 중위소득 60% 이하, 최근 2년 이내 취업경험 필수",
    amount: governmentPrograms[0]?.amount || "월 최대 60만원",
    deadline: governmentPrograms[0]?.deadline || "상시",
    difficulty: governmentPrograms[0]?.difficulty || "보통",
    matchRate: governmentPrograms[0]?.matchRate || 70,
    tags: governmentPrograms[0]?.tags || ["구직", "청년", "취업", "생계지원"],
    badges: [{ label: "신규", variant: "new" as const }, { label: "인기", variant: "verified" as const }],
    sourceUrl: governmentPrograms[0]?.sourceUrl,
    applicationUrl: governmentPrograms[0]?.applicationUrl,
    size: "large" as const,
  };

  const sideJobPrograms = [
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
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-5 md:px-8 py-6 md:py-8">
        {/* 오늘의 하이라이트 */}
        <section className="mb-8 md:mb-12">
          <h2 className="text-heading-l font-bold text-text-primary mb-6">
            오늘의 하이라이트
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            <div className="md:col-span-2">
              <HighlightCard {...highlightData} className="h-full" />
            </div>
            <div className="flex flex-col gap-6 h-full">
              <HighlightCard
                title="마감 임박 알림"
                description="내가 저장한 지원금 중 3개가 이번 주 마감됩니다"
                badges={[{ label: "알림", variant: "urgent" as const }]}
                savedItems={[
                  { name: "청년 월세 특별지원", deadline: "D-7" },
                  { name: "신혼부부 주거지원금", deadline: "D-15" },
                  { name: "소상공인 경영안정자금", deadline: "D-20" },
                ]}
                ctaText="확인하기"
              />
              <div className="bg-surface rounded-card p-6 shadow-card flex-1 flex flex-col">
                <h3 className="text-body-l font-semibold text-text-primary mb-2">
                  1분 자격 진단
                </h3>
                <p className="text-body-s text-text-secondary mb-4 flex-1">
                  나에게 맞는 지원금을 빠르게 찾아보세요
                </p>
                <Button variant="primary" size="md" className="w-full">
                  진단 시작하기
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* 정부·공공 지원금 */}
        <section className="mb-8 md:mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-heading-l font-bold text-text-primary">
              정부·공공 지원금 / 보조금
            </h2>
            <Link href="/category/government">
              <Button variant="ghost" size="sm">
                더보기 →
              </Button>
            </Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-surface rounded-card p-6 shadow-card animate-pulse">
                  <div className="h-4 bg-badge rounded w-1/4 mb-4"></div>
                  <div className="h-6 bg-badge rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-badge rounded w-full mb-2"></div>
                  <div className="h-4 bg-badge rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {governmentPrograms.slice(0, 3).map((program) => (
                <InfoCard
                  key={program.id}
                  title={program.title}
                  category={program.category}
                  description={program.description}
                  tags={program.tags}
                  amount={program.amount}
                  deadline={program.deadline}
                  difficulty={program.difficulty}
                  matchRate={program.matchRate}
                  sourceUrl={program.sourceUrl}
                  applicationUrl={program.applicationUrl}
                />
              ))}
            </div>
          )}
        </section>

        {/* 부업 / 재택근무 / 프리랜스 */}
        <section className="mb-8 md:mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-heading-l font-bold text-text-primary">
              부업 / 재택근무 / 프리랜스 수익
            </h2>
            <Link href="/category/sidejob">
              <Button variant="ghost" size="sm">
                더보기 →
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sideJobPrograms.map((program, index) => (
              <InfoCard key={index} {...program} />
            ))}
          </div>
        </section>

        {/* 투자·자산·리셀 */}
        <section className="mb-8 md:mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-heading-l font-bold text-text-primary">
              투자·자산·리셀 (실물 경제형 수익)
            </h2>
            <Link href="/category/investment">
              <Button variant="ghost" size="sm">
                더보기 →
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <InfoCard
              title="부동산 투자 리츠(REITs)"
              category="투자·자산"
              description="부동산 간접투자를 통한 배당 수익 창출"
              tags={["부동산", "배당", "투자"]}
              amount="연 5~8% 수익률"
              difficulty="보통"
            />
            <InfoCard
              title="중고 명품 리셀 비즈니스"
              category="리셀"
              description="명품 가방, 시계 등 중고 명품 구매 후 재판매"
              tags={["리셀", "명품", "중고"]}
              amount="건당 10~30% 마진"
              difficulty="어려움"
            />
            <InfoCard
              title="크라우드펀딩 투자"
              category="투자·자산"
              description="스타트업 크라우드펀딩을 통한 투자 수익"
              tags={["투자", "스타트업", "펀딩"]}
              amount="연 7~15% 수익률"
              difficulty="보통"
            />
          </div>
        </section>

        {/* 자기계발·자격증 */}
        <section className="mb-8 md:mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-heading-l font-bold text-text-primary">
              자기계발·자격증 기반 수익
            </h2>
            <Link href="/category/selfdev">
              <Button variant="ghost" size="sm">
                더보기 →
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <InfoCard
              title="공인회계사(CPA) 자격증"
              category="자격증"
              description="회계 전문가 자격증 취득 후 회계사무소 취업"
              tags={["자격증", "회계", "전문가"]}
              amount="연봉 3,000~5,000만원"
              difficulty="어려움"
            />
            <InfoCard
              title="정보처리기사 자격증"
              category="자격증"
              description="IT 분야 기본 자격증으로 개발자 취업 기회 확대"
              tags={["자격증", "IT", "개발"]}
              amount="연봉 3,500~6,000만원"
              difficulty="보통"
            />
            <InfoCard
              title="온라인 마케팅 전문가 과정"
              category="자기계발"
              description="디지털 마케팅 스킬 습득 후 프리랜스 또는 취업"
              tags={["마케팅", "디지털", "스킬"]}
              amount="월 200~500만원"
              difficulty="보통"
            />
          </div>
        </section>

        {/* 할인·리워드·절약 */}
        <section className="mb-8 md:mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-heading-l font-bold text-text-primary">
              할인·리워드·절약 정보
            </h2>
            <Link href="/category/discount">
              <Button variant="ghost" size="sm">
                더보기 →
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <InfoCard
              title="신용카드 캐시백 이벤트"
              category="리워드"
              description="주요 신용카드사 캐시백 및 적립 이벤트 정보"
              tags={["카드", "캐시백", "적립"]}
              amount="월 최대 10만원"
              deadline="D-5"
            />
            <InfoCard
              title="통신비 할인 프로모션"
              category="할인"
              description="통신사 요금제 변경 시 제공되는 할인 혜택"
              tags={["통신", "할인", "요금제"]}
              amount="월 2~5만원 절약"
              deadline="상시"
            />
            <InfoCard
              title="공공요금 자동납부 할인"
              category="절약"
              description="전기, 가스, 수도 요금 자동납부 시 할인 혜택"
              tags={["공공요금", "자동납부", "할인"]}
              amount="월 1~3만원 절약"
              deadline="상시"
            />
          </div>
        </section>
      </main>
    </div>
  );
}
