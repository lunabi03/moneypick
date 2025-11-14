import { GovernmentProgram } from "./types";
import * as cheerio from "cheerio";

/**
 * 정부24 및 공공데이터포털에서 지원금/보조금 데이터를 수집하는 함수
 */
export async function collectGovernmentPrograms(): Promise<GovernmentProgram[]> {
  const programs: GovernmentProgram[] = [];

  try {
    // 1. 공공데이터포털 API 호출 (예시)
    // 실제 API 키는 환경변수로 관리해야 합니다
    const publicDataApiKey = process.env.PUBLIC_DATA_API_KEY;
    
    if (publicDataApiKey) {
      // 공공데이터포털 API 호출 예시
      // const response = await fetch(`https://apis.data.go.kr/...?serviceKey=${publicDataApiKey}`);
      // const data = await response.json();
      // programs.push(...parsePublicData(data));
    }

    // 2. 정부24 데이터 수집 (웹 스크래핑 또는 RSS)
    const gov24Programs = await collectGov24Programs();
    programs.push(...gov24Programs);

    // 3. 실제 정부24 데이터 파싱 시도
    try {
      const { parseGov24RealData } = await import("./gov24-parser");
      const realData = await parseGov24RealData();
      if (realData.length > 0) {
        programs.push(...realData);
      }
    } catch (error) {
      console.log("실제 데이터 파싱 실패, 기본 데이터 사용");
    }

    // 4. 데이터 정규화 및 중복 제거
    const uniquePrograms = removeDuplicates(programs);

    return uniquePrograms;
  } catch (error) {
    console.error("데이터 수집 중 오류 발생:", error);
    // 오류 발생 시 기본 샘플 데이터 반환
    return getDefaultPrograms();
  }
}

/**
 * 정부24에서 지원금 데이터 수집
 */
async function collectGov24Programs(): Promise<GovernmentProgram[]> {
  try {
    // 정부24 API 엔드포인트 확인 필요
    // 정부24는 동적 로딩을 사용하므로 직접 HTML 파싱이 어려울 수 있음
    // 대안: 공공데이터포털 API 또는 정부24 RSS 피드 활용
    
    // 방법 1: 정부24 API 호출 시도 (여러 엔드포인트 시도)
    const apiUrls = [
      "https://www.gov.kr/portal/rcvfvrSvc/svcFind/list.json",
      "https://www.gov.kr/portal/rcvfvrSvc/main/list.json",
      "https://www.gov.kr/portal/rcvfvrSvc/svcFind/signgu/list.json?srchType=sido&sidoCode=",
    ];

    for (const apiUrl of apiUrls) {
      try {
        const response = await fetch(apiUrl, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "Accept": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data && (Array.isArray(data) || (data.list && Array.isArray(data.list)))) {
            const programs = parseGov24API(Array.isArray(data) ? data : data.list);
            if (programs.length > 0) {
              return programs;
            }
          }
        }
      } catch (apiError) {
        // 다음 URL 시도
        continue;
      }
    }

    // 방법 2: HTML 파싱 시도
    const response = await fetch("https://www.gov.kr/portal/rcvfvrSvc/main/nonLogin", {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });

    if (!response.ok) {
      throw new Error("정부24 데이터 수집 실패");
    }

    const html = await response.text();
    const programs = parseGov24HTML(html);

    if (programs.length > 0) {
      return programs;
    }

    // 데이터 수집 실패 시 기본 샘플 데이터 반환
    console.warn("정부24 데이터 수집 실패, 샘플 데이터 사용");
    return getDefaultPrograms();
  } catch (error) {
    console.error("정부24 데이터 수집 오류:", error);
    return getDefaultPrograms();
  }
}

/**
 * 정부24 HTML 파싱 (실제 페이지 구조 기반)
 */
function parseGov24HTML(html: string): GovernmentProgram[] {
  const programs: GovernmentProgram[] = [];
  const $ = cheerio.load(html);

  try {
    // 정부24 실제 페이지 구조: .main-box-title, .main-box-desc, .main-hover-desc
    $(".main-box, .swiper-slide").each((index, element) => {
      const $el = $(element);
      
      const title = $el.find(".main-box-title").first().text().trim();
      const description = $el.find(".main-box-desc").first().text().trim();
      const hoverDesc = $el.find(".main-hover-desc").first().text().trim();
      const link = $el.find("a").first().attr("href");
      const chip = $el.find(".chip").first().text().trim();

      if (title && title.length > 2) {
        // 상세 설명이 있으면 사용, 없으면 기본 설명 사용
        const fullDescription = hoverDesc || description || title;
        
        // 금액 정보 추출 시도
        let amount: string | undefined;
        if (fullDescription.includes("억") || fullDescription.includes("만원") || fullDescription.includes("원")) {
          const amountMatch = fullDescription.match(/(\d+억?\s*\d*만?\s*원?|최대\s*\d+[억만원]+)/);
          if (amountMatch) {
            amount = amountMatch[0];
          }
        }

        programs.push({
          id: `gov24-${index + 1}`,
          title,
          category: chip ? `${chip} · 정부·공공 지원금` : "정부·공공 지원금",
          description: fullDescription.substring(0, 200), // 설명이 너무 길면 자름
          amount: amount,
          deadline: "상시", // 정부24에서 마감일 정보가 명확하지 않으면 기본값
          difficulty: "보통",
          matchRate: undefined,
          sourceUrl: link ? (link.startsWith("http") ? link : `https://www.gov.kr${link}`) : "https://www.gov.kr/portal/rcvfvrSvc/main/nonLogin",
          applicationUrl: link ? (link.startsWith("http") ? link : `https://www.gov.kr${link}`) : undefined,
          updatedAt: new Date().toISOString(),
        });
      }
    });

    // 추가: 다른 형태의 지원금 목록도 찾기
    $(".service-item, .benefit-item, [class*='support'], [class*='subsidy']").each((index, element) => {
      const $el = $(element);
      const title = $el.find("h3, h4, .title, strong").first().text().trim();
      const description = $el.find("p, .desc, .summary").first().text().trim();
      const link = $el.find("a").first().attr("href");

      if (title && title.length > 3 && !programs.some(p => p.title === title)) {
        programs.push({
          id: `gov24-alt-${index + 1}`,
          title,
          category: "정부·공공 지원금",
          description: description || title,
          sourceUrl: link ? (link.startsWith("http") ? link : `https://www.gov.kr${link}`) : undefined,
          applicationUrl: link ? (link.startsWith("http") ? link : `https://www.gov.kr${link}`) : undefined,
          updatedAt: new Date().toISOString(),
        });
      }
    });
  } catch (error) {
    console.error("HTML 파싱 오류:", error);
  }

  return programs;
}

/**
 * 정부24 API 응답 파싱
 */
function parseGov24API(data: any[]): GovernmentProgram[] {
  return data.map((item, index) => ({
    id: `gov24-${item.id || index + 1}`,
    title: item.title || item.serviceName || item.name || "",
    category: "정부·공공 지원금",
    description: item.description || item.summary || item.content || "",
    amount: item.amount || item.supportAmount || undefined,
    deadline: item.deadline ? calculateDeadline(item.deadline) : undefined,
    difficulty: "보통",
    matchRate: undefined,
    sourceUrl: item.url || item.link || undefined,
    applicationUrl: item.applicationUrl || item.applyUrl || undefined,
    updatedAt: new Date().toISOString(),
  })).filter((p) => p.title);
}

/**
 * 마감일 문자열을 D-X 형식으로 변환
 */
function calculateDeadline(deadlineStr: string): string {
  try {
    // "2024-12-31" 형식의 날짜를 D-X 형식으로 변환
    const deadlineDate = new Date(deadlineStr);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return "마감";
    if (diffDays === 0) return "D-Day";
    return `D-${diffDays}`;
  } catch {
    return deadlineStr;
  }
}

/**
 * 중복 제거 (제목 기준)
 */
function removeDuplicates(programs: GovernmentProgram[]): GovernmentProgram[] {
  const seen = new Set<string>();
  return programs.filter((program) => {
    const key = program.title.toLowerCase().trim();
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

/**
 * 기본 샘플 데이터 (정부24 실제 페이지에서 확인한 정보 기반)
 * 정부24 메인 페이지에 실제로 표시되는 지원금 정보를 기반으로 작성
 */
function getDefaultPrograms(): GovernmentProgram[] {
  return [
    {
      id: "gov-001",
      title: "국민취업지원제도",
      category: "정부·공공 지원금",
      description: "구직자 대상 취업지원서비스 및 생계안정 지원. 중위소득 60% 이하, 최근 2년 이내 취업경험 필수",
      tags: ["구직", "청년", "취업", "생계지원"],
      amount: "월 최대 60만원",
      deadline: "상시",
      difficulty: "보통",
      matchRate: 70,
      sourceUrl: "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/149200005007",
      applicationUrl: "https://www.work24.go.kr",
      updatedAt: new Date().toISOString(),
    },
    {
      id: "gov-002",
      title: "내집마련 디딤돌 대출",
      category: "정부·공공 지원금",
      description: "무주택자 대상 주택구입 대출. 최대 2.5억원, 연 2.45~3.55% 금리. 연소득 6천만원 이하(신혼가구 8.5천만원 이하)",
      tags: ["신혼부부", "주거", "대출", "주택구입"],
      amount: "최대 2.5억원",
      deadline: "상시",
      difficulty: "보통",
      matchRate: 80,
      sourceUrl: "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/B55140800003",
      applicationUrl: "https://www.hf.go.kr",
      updatedAt: new Date().toISOString(),
    },
    {
      id: "gov-003",
      title: "근로·자녀장려금",
      category: "정부·공공 지원금",
      description: "소득과 재산이 적은 근로소득자에게 근로장려금을, 자녀가 있을 경우 자녀장려금 지급",
      tags: ["근로자", "자녀", "장려금", "소득지원"],
      amount: "가구당 최대 300만원",
      deadline: "상시",
      difficulty: "쉬움",
      matchRate: 85,
      sourceUrl: "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/105100000001",
      applicationUrl: "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/105100000001",
      updatedAt: new Date().toISOString(),
    },
    {
      id: "gov-004",
      title: "국민내일배움카드",
      category: "정부·공공 지원금",
      description: "직업훈련을 희망하는 국민에게 직업능력개발훈련비와 훈련장려금 지원",
      tags: ["직업훈련", "교육", "장려금"],
      amount: "연 최대 300만원",
      deadline: "상시",
      difficulty: "보통",
      matchRate: 75,
      sourceUrl: "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/149200000026",
      applicationUrl: "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/149200000026",
      updatedAt: new Date().toISOString(),
    },
    {
      id: "gov-005",
      title: "출산전후(유산ㆍ사산)휴가 급여",
      category: "정부·공공 지원금",
      description: "출산전후(유산ㆍ사산)휴가 기간에 대한 급여 지원",
      tags: ["출산", "휴가", "급여", "임신부"],
      amount: "일당 최대 8만원",
      deadline: "상시",
      difficulty: "쉬움",
      matchRate: 90,
      sourceUrl: "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/WII000001460",
      applicationUrl: "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/WII000001460",
      updatedAt: new Date().toISOString(),
    },
    {
      id: "gov-006",
      title: "치매 치료관리비 지원",
      category: "정부·공공 지원금",
      description: "치매 어르신에게 약제비와 진료비의 본인부담금 지원 (최대 월 3만 원)",
      tags: ["치매", "의료비", "노인", "건강"],
      amount: "월 최대 3만원",
      deadline: "상시",
      difficulty: "보통",
      matchRate: 80,
      sourceUrl: "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/135200000125",
      applicationUrl: "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/135200000125",
      updatedAt: new Date().toISOString(),
    },
  ];
}

