
import { useState, useEffect } from "react";
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
  
  // Track input mode for CV and JD (file or text)
  const [inputMode, setInputMode] = useState<{
    cv: "file" | "text" | null;
    jd: "file" | "text" | null;
  }>({
    cv: null,
    jd: null,
  });

  // Reset flags for text editors
  const [resetTextEditors, setResetTextEditors] = useState<{
    cv: boolean;
    jd: boolean;
  }>({
    cv: false,
    jd: false,
  });

  // Reset the text editor flags after they've been consumed
  useEffect(() => {
    if (resetTextEditors.cv || resetTextEditors.jd) {
      setResetTextEditors({
        cv: false,
        jd: false,
      });
    }
  }, [resetTextEditors]);

  const handleDocumentUpdate = (type: "cv" | "jd", dataType: "file" | "text", content: string) => {
    // Only update input mode if there's content or if we're clearing a previous text input
    if (content || (dataType === "text" && inputMode[type] === "text")) {
      setInputMode(prev => ({
        ...prev,
        [type]: content ? dataType : null
      }));
    }

    setDocuments((prev) => ({
      ...prev,
      [type]: content ? {
        content,
        type,
        dataType,
        format: "text",
      } : null,
    }));

    // If switching to text input mode and there was a file, remove it
    if (dataType === "text" && files[type]) {
      setFiles(prev => ({
        ...prev,
        [type]: null
      }));
    }
  };

  const handleFileUpload = (type: "cv" | "jd", dataType: "file", content: string, file: File) => {
    setFiles(prev => ({
      ...prev,
      [type]: file
    }));

    handleDocumentUpdate(type, dataType, content);
    
    // Reset any text in the text editor when a file is uploaded
    setResetTextEditors(prev => ({
      ...prev,
      [type]: true
    }));
  };

  const handleFileRemove = (type: "cv" | "jd") => {
    setFiles(prev => ({
      ...prev,
      [type]: null
    }));

    setInputMode(prev => ({
      ...prev,
      [type]: null
    }));

    setDocuments(prev => ({
      ...prev,
      [type]: null
    }));
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
                onRemove={() => handleFileRemove("cv")}
                disabled={inputMode.cv === "text" && !!documents.cv?.content}
              />
              <div className="mt-6">
                <p className="text-sm text-gray-600 mb-2">Or enter manually:</p>
                <TextEditor
                  type="cv"
                  dataType="text"
                  onChange={(content) => handleDocumentUpdate("cv", "text", content)}
                  disabled={inputMode.cv === "file"}
                  resetContent={resetTextEditors.cv}
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
                onRemove={() => handleFileRemove("jd")}
                disabled={inputMode.jd === "text" && !!documents.jd?.content}
              />
              <div className="mt-6">
                <p className="text-sm text-gray-600 mb-2">Or enter manually:</p>
                <TextEditor
                  type="jd"
                  dataType="text"
                  onChange={(content) => handleDocumentUpdate("jd", "text", content)}
                  disabled={inputMode.jd === "file"}
                  resetContent={resetTextEditors.jd}
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
