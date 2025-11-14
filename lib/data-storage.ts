import { GovernmentProgram } from "./types";
import fs from "fs/promises";
import path from "path";

const DATA_FILE_PATH = path.join(process.cwd(), "data", "government-programs.json");

/**
 * 데이터를 파일에 저장
 */
export async function savePrograms(programs: GovernmentProgram[]): Promise<void> {
  try {
    // data 디렉토리가 없으면 생성
    const dataDir = path.dirname(DATA_FILE_PATH);
    await fs.mkdir(dataDir, { recursive: true });

    const data = {
      programs,
      lastUpdated: new Date().toISOString(),
      total: programs.length,
    };

    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("데이터 저장 오류:", error);
    throw error;
  }
}

/**
 * 파일에서 데이터 로드
 */
export async function loadPrograms(): Promise<GovernmentProgram[]> {
  try {
    const fileContent = await fs.readFile(DATA_FILE_PATH, "utf-8");
    const data = JSON.parse(fileContent);
    return data.programs || [];
  } catch (error) {
    // 파일이 없으면 빈 배열 반환
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }
    console.error("데이터 로드 오류:", error);
    throw error;
  }
}

/**
 * 데이터가 최신인지 확인 (24시간 이내)
 */
export async function isDataFresh(): Promise<boolean> {
  try {
    const fileContent = await fs.readFile(DATA_FILE_PATH, "utf-8");
    const data = JSON.parse(fileContent);
    const lastUpdated = new Date(data.lastUpdated);
    const now = new Date();
    const hoursSinceUpdate = (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60);
    
    return hoursSinceUpdate < 24; // 24시간 이내면 최신
  } catch (error) {
    return false;
  }
}

