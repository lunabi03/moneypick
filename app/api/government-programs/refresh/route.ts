import { NextResponse } from "next/server";
import { collectGovernmentPrograms } from "@/lib/data-collector";
import { savePrograms } from "@/lib/data-storage";

export const dynamic = "force-dynamic";

/**
 * POST /api/government-programs/refresh
 * 데이터를 강제로 새로고침합니다.
 * Vercel Cron Jobs에서 호출할 수 있습니다.
 */
export async function POST(request: Request) {
  try {
    // 인증 확인 (선택사항)
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("데이터 새로고침 시작...");
    const programs = await collectGovernmentPrograms();
    await savePrograms(programs);

    return NextResponse.json({
      success: true,
      message: "데이터가 성공적으로 새로고침되었습니다.",
      total: programs.length,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("데이터 새로고침 오류:", error);
    return NextResponse.json(
      { error: "데이터 새로고침 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

