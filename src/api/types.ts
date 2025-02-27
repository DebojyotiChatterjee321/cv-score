
// API service type definitions
// Defines request and response types for API calls

import { Document, MatchResult } from "@/types";

export type CVScoreRequest = {
  cv: Document;
  jd: Document;
};

export type CVScoreResponse = {
  cv_score: number;
  summary: string;
  matching_keywords: string[];
  missing_keywords: string[];
  success: boolean;
  message?: string;
};

