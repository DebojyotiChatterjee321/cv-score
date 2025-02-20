
import { useState } from "react";
import FileUpload from "@/components/FileUpload";
import TextEditor from "@/components/TextEditor";
import MatchScore from "@/components/MatchScore";
import { type Document, type MatchResult } from "@/types";
import { toast } from "sonner";

// Main page component orchestrating the CV-JD comparison flow
// Manages document states and triggers comparisons
const Index = () => {
  const [documents, setDocuments] = useState<{
    cv: Document | null;
    jd: Document | null;
  }>({
    cv: null,
    jd: null,
  });

  const [result, setResult] = useState<MatchResult | null>(null);

  const handleDocumentUpdate = (type: "cv" | "jd", content: string) => {
    setDocuments((prev) => ({
      ...prev,
      [type]: {
        content,
        type,
        format: "text",
      },
    }));
  };

  // Temporary mock comparison function
  // Will be replaced with actual API call to backend
  const compareDocuments = () => {
    if (!documents.cv || !documents.jd) {
      toast.error("Please provide both CV and JD");
      return;
    }

    // Mock result for demonstration
    setResult({
      score: 75,
      matchedSkills: ["React", "TypeScript", "Node.js", "API Development"],
      missingSkills: ["Python", "AWS"],
      recommendations: ["Consider learning Python", "Get AWS certification"],
    });

    toast.success("Analysis complete!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            CV-JD Matcher
          </h1>
          <p className="text-lg text-gray-600">
            Compare your CV with a job description to see how well you match
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="space-y-6 animate-fade-in">
            <div className="glass rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Upload CV</h2>
              <FileUpload
                type="cv"
                onUpload={(content) => handleDocumentUpdate("cv", content)}
              />
              <div className="mt-6">
                <p className="text-sm text-gray-600 mb-2">Or enter manually:</p>
                <TextEditor
                  type="cv"
                  onChange={(content) => handleDocumentUpdate("cv", content)}
                />
              </div>
            </div>
          </div>

          <div className="space-y-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="glass rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Upload Job Description</h2>
              <FileUpload
                type="jd"
                onUpload={(content) => handleDocumentUpdate("jd", content)}
              />
              <div className="mt-6">
                <p className="text-sm text-gray-600 mb-2">Or enter manually:</p>
                <TextEditor
                  type="jd"
                  onChange={(content) => handleDocumentUpdate("jd", content)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center mb-12">
          <button
            onClick={compareDocuments}
            className="px-8 py-3 bg-primary text-white rounded-full font-medium
              hover:bg-primary/90 transition-colors duration-200 animate-fade-in"
            style={{ animationDelay: "0.4s" }}
          >
            Compare Documents
          </button>
        </div>

        {result && <MatchScore result={result} />}
      </div>
    </div>
  );
};

export default Index;
