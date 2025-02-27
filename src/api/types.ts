
// API service type definitions
// Defines request and response types for API calls

import { Document, MatchResult } from "@/types";

export type CVScoreRequest = {
  cv: Document;
  jd: Document;
};

export type CVScoreResponse = {
  result: MatchResult;
  success: boolean;
  message?: string;
};
