import { GovernmentProgram } from "./types";
import fs from "fs/promises";
import path from "path";

const DATA_FILE_PATH = path.join(process.cwd(), "data", "government-programs.json");

/**
 * 데이터를 파일에 저장
 * Vercel 서버리스 환경에서는 파일 시스템 쓰기가 제한적이므로
 * 저장 실패 시에도 에러를 throw하지 않고 로그만 남깁니다.
 */
export async function savePrograms(programs: GovernmentProgram[]): Promise<void> {
  try {
    // Vercel 서버리스 환경에서는 /tmp 디렉토리만 쓰기 가능
    // 프로덕션에서는 파일 저장을 건너뛰고 메모리에서만 처리
    if (process.env.VERCEL) {
      console.log("Vercel 환경: 파일 저장 건너뜀 (서버리스 환경 제한)");
      return;
    }

    // 로컬 개발 환경에서만 파일 저장
    const dataDir = path.dirname(DATA_FILE_PATH);
    await fs.mkdir(dataDir, { recursive: true });

    const data = {
      programs,
      lastUpdated: new Date().toISOString(),
      total: programs.length,
    };

    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(data, null, 2), "utf-8");
    console.log("데이터 저장 완료:", programs.length, "개 프로그램");
  } catch (error) {
    // 파일 저장 실패해도 에러를 throw하지 않음 (서버리스 환경 대응)
    console.warn("데이터 저장 실패 (무시됨):", error);
  }
}

/**
 * 파일에서 데이터 로드
 * Vercel 서버리스 환경에서는 파일이 없을 수 있으므로 빈 배열 반환
 */
export async function loadPrograms(): Promise<GovernmentProgram[]> {
  try {
    // Vercel 환경에서는 파일 로드 시도하지 않음
    if (process.env.VERCEL) {
      console.log("Vercel 환경: 파일 로드 건너뜀 (서버리스 환경 제한)");
      return [];
    }

    const fileContent = await fs.readFile(DATA_FILE_PATH, "utf-8");
    const data = JSON.parse(fileContent);
    return data.programs || [];
  } catch (error) {
    // 파일이 없거나 읽기 실패 시 빈 배열 반환
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }
    console.warn("데이터 로드 실패 (빈 배열 반환):", error);
    return [];
  }
}

/**
 * 데이터가 최신인지 확인 (24시간 이내)
 * Vercel 서버리스 환경에서는 항상 false 반환 (항상 새로 수집)
 */
export async function isDataFresh(): Promise<boolean> {
  try {
    // Vercel 환경에서는 항상 새로 수집
    if (process.env.VERCEL) {
      return false;
    }

    const fileContent = await fs.readFile(DATA_FILE_PATH, "utf-8");
    const data = JSON.parse(fileContent);
    const lastUpdated = new Date(data.lastUpdated);
    const now = new Date();
    const hoursSinceUpdate = (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60);
    
    return hoursSinceUpdate < 24; // 24시간 이내면 최신
  } catch (error) {
    return false; // 파일이 없거나 오류 시 항상 새로 수집
  }
}

