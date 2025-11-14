export interface GovernmentProgram {
  id: string;
  title: string;
  category: string;
  description: string;
  tags?: string[];
  amount?: string;
  deadline?: string;
  difficulty?: string;
  matchRate?: number;
  sourceUrl?: string;
  applicationUrl?: string;
  updatedAt: string;
}

export interface GovernmentProgramsResponse {
  programs: GovernmentProgram[];
  lastUpdated: string;
  total: number;
}

