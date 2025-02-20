
// Types for document comparison and analysis
export type Document = {
  content: string;
  type: "cv" | "jd";
  format: "pdf" | "docx" | "text";
  filename?: string;
};

export type MatchResult = {
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
  recommendations: string[];
};

export type UploadState = {
  isDragging: boolean;
  file: File | null;
  content: string;
};
