
import { useState } from "react";
import FileUpload from "@/components/FileUpload";
import TextEditor from "@/components/TextEditor";
import MatchScore from "@/components/MatchScore";
import { type Document, type MatchResult } from "@/types";
import { toast } from "sonner";
import { computeCVScore } from "@/api/documentService";

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

  const [files, setFiles] = useState<{
    cv: File | null;
    jd: File | null;
  }>({
    cv: null,
    jd: null,
  });

  const [result, setResult] = useState<MatchResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleDocumentUpdate = (type: "cv" | "jd", dataType: "file" | "text", content: string) => {
    setDocuments((prev) => ({
      ...prev,
      [type]: {
        content,
        type,
        dataType,
        format: "text",
      },
    }));
  };

  const handleFileUpload = (type: "cv" | "jd", dataType: "file", content: string, file: File) => {
    setFiles(prev => ({
      ...prev,
      [type]: file
    }));

    handleDocumentUpdate(type, dataType, content);
  };

  // Send documents to backend for comparison
  const compareDocuments = async () => {
    if (!documents.cv || !documents.jd) {
      toast.error("Please provide both CV and JD");
      return;
    }

    setLoading(true);

    try {
      const result = await computeCVScore(
        documents.cv,
        documents.jd,
        files.cv,
        files.jd
      );

      setResult(result);
      toast.success("Analysis complete!");
    } catch (error) {
      console.error("Error comparing documents:", error);
      toast.error("Failed to analyze documents. Please try again.");
    } finally {
      setLoading(false);
    }
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
                dataType="file"
                onUpload={(content, file) => handleFileUpload("cv", "file", content, file)}
              />
              <div className="mt-6">
                <p className="text-sm text-gray-600 mb-2">Or enter manually:</p>
                <TextEditor
                  type="cv"
                  dataType="text"
                  onChange={(content) => handleDocumentUpdate("cv", "text", content)}
                />
              </div>
            </div>
          </div>

          <div className="space-y-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="glass rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Upload Job Description</h2>
              <FileUpload
                type="jd"
                dataType="file"
                onUpload={(content, file) => handleFileUpload("jd", "file", content, file)}
              />
              <div className="mt-6">
                <p className="text-sm text-gray-600 mb-2">Or enter manually:</p>
                <TextEditor
                  type="jd"
                  dataType="text"
                  onChange={(content) => handleDocumentUpdate("jd", "text", content)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center mb-12">
          <button
            onClick={compareDocuments}
            disabled={loading}
            className={`px-8 py-3 bg-primary text-white rounded-full font-medium
              transition-colors duration-200 animate-fade-in
              ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-primary/90'}`}
            style={{ animationDelay: "0.4s" }}
          >
            {loading ? "Analyzing..." : "Compare Documents"}
          </button>
        </div>

        {result && <MatchScore result={result} />}
      </div>
    </div>
  );
};

export default Index;
