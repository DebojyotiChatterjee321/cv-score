
// Document service for API calls
// Handles communication with backend for document comparison and analysis

import { ENDPOINTS } from "./config";
import { Document, MatchResult } from "@/types";
import { CVScoreResponse } from "./types";

/**
 * Sends CV and JD to backend for comparison and scoring
 * @param cv CV document content and metadata
 * @param jd Job description content and metadata
 * @param cvFile Optional CV file for multipart upload
 * @param jdFile Optional JD file for multipart upload
 * @returns Match result with score and analysis
 */
export const computeCVScore = async (
  cv: Document,
  jd: Document,
  cvFile?: File | null,
  jdFile?: File | null
): Promise<MatchResult> => {
  try {
    // Create FormData for multipart request
    const formData = new FormData();

    // Add document content
    if (cv.dataType != "file")
      formData.append("cv_content", cv.content);
    if (jd.dataType != "file")
      formData.append("jd_content", jd.content);

    // Add document types
    // formData.append("cv_type", cv.type);
    // formData.append("jd_type", jd.type);

    // Add files if available
    if (cvFile) {
      formData.append("cv_file", cvFile);
    }
    if (jdFile) {
      formData.append("jd_file", jdFile);
    }

    // Make API request
    const response = await fetch(ENDPOINTS.COMPUTE_CV_SCORE, {
      method: "POST",
      body: formData,
    });


    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }

    // Parse response to JSON object
    const data: CVScoreResponse = await response.json();

    // Transform backend response to our frontend model
    return {
      score: data.cv_score,
      matchedSkills: data.matching_keywords,
      missingSkills: data.missing_keywords,
      recommendations: [data.summary], // Use summary as recommendation
    };
  } catch (error) {
    console.error("Error computing CV score:", error);
    throw error;
  }
};
