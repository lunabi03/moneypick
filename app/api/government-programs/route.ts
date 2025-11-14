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

    let programs;

    // 강제 새로고침이거나 데이터가 오래되었으면 새로 수집
    if (forceRefresh || !(await isDataFresh())) {
      console.log("새로운 데이터 수집 시작...");
      programs = await collectGovernmentPrograms();
      await savePrograms(programs);
    } else {
      // 기존 데이터 로드
      programs = await loadPrograms();
      
      // 데이터가 없으면 수집
      if (programs.length === 0) {
        programs = await collectGovernmentPrograms();
        await savePrograms(programs);
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
    return NextResponse.json(
      { error: "데이터를 가져오는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

