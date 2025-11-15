import { NextResponse } from "next/server";
import { collectGovernmentPrograms } from "@/lib/data-collector";
import { savePrograms, loadPrograms, isDataFresh } from "@/lib/data-storage";
import { GovernmentProgramsResponse } from "@/lib/types";

export const dynamic = "force-dynamic";
export const revalidate = 3600; // 1시간마다 재검증

/**
 * GET /api/government-programs
 * 정부 지원금/보조금 데이터를 반환합니다.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const forceRefresh = searchParams.get("refresh") === "true";

    let programs: GovernmentProgram[] = [];

    // Vercel 환경에서는 항상 새로 수집 (파일 시스템 제한)
    // 로컬 환경에서는 캐시된 데이터 사용
    if (process.env.VERCEL || forceRefresh || !(await isDataFresh())) {
      console.log("새로운 데이터 수집 시작...");
      try {
        programs = await collectGovernmentPrograms();
        // 파일 저장은 실패해도 계속 진행 (서버리스 환경 대응)
        await savePrograms(programs).catch(err => {
          console.warn("파일 저장 실패 (무시됨):", err);
        });
      } catch (collectError) {
        console.error("데이터 수집 오류:", collectError);
        // 수집 실패 시 기존 데이터 로드 시도
        programs = await loadPrograms();
      }
    } else {
      // 기존 데이터 로드 시도
      programs = await loadPrograms();
      
      // 데이터가 없으면 수집
      if (programs.length === 0) {
        console.log("캐시된 데이터 없음, 새로 수집...");
        try {
          programs = await collectGovernmentPrograms();
          await savePrograms(programs).catch(err => {
            console.warn("파일 저장 실패 (무시됨):", err);
          });
        } catch (collectError) {
          console.error("데이터 수집 오류:", collectError);
          // 수집 실패 시 빈 배열 반환
          programs = [];
        }
      }
    }

    const response: GovernmentProgramsResponse = {
      programs,
      lastUpdated: new Date().toISOString(),
      total: programs.length,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("API 오류:", error);
    // 에러 상세 정보 로깅
    if (error instanceof Error) {
      console.error("에러 메시지:", error.message);
      console.error("에러 스택:", error.stack);
    }
    return NextResponse.json(
      { 
        error: "데이터를 가져오는 중 오류가 발생했습니다.",
        details: process.env.NODE_ENV === "development" ? (error instanceof Error ? error.message : String(error)) : undefined
      },
      { status: 500 }
    );
  }
}

