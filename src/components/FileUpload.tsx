
import { useState, useCallback } from "react";
import { FileText, Upload } from "lucide-react";
import { type UploadState } from "@/types";

// FileUpload component handles drag & drop and click file uploads
// Supports PDF and DOCX files with a modern, animated interface
const FileUpload = ({
  type,
  dataType,
  onUpload,
}: {
  type: "cv" | "jd";
  dataType: "file";
  onUpload: (content: string, file: File) => void;
}) => {
  const [state, setState] = useState<UploadState>({
    isDragging: false,
    file: null,
    content: "",
  });

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setState(prev => ({ ...prev, isDragging: true }));
    } else if (e.type === "dragleave") {
      setState(prev => ({ ...prev, isDragging: false }));
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setState(prev => ({ ...prev, isDragging: false }));

    const files = Array.from(e.dataTransfer.files);
    if (files?.[0]) {
      handleFiles(files[0]);
    }
  }, []);

  const handleFiles = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setState(prev => ({ ...prev, file, content }));
      onUpload(content, file);
    };
    reader.readAsText(file);
  };

  return (
    <div
      className={`upload-zone rounded-xl p-8 border-2 border-dashed transition-all duration-200 ease-in-out
        ${state.isDragging ? "border-primary bg-primary/5" : "border-border"}
        ${state.file ? "bg-secondary/50" : "hover:bg-secondary/50"}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center justify-center gap-4">
        {state.file ? (
          <>
            <FileText className="w-12 h-12 text-primary" />
            <p className="text-sm font-medium">{state.file.name}</p>
          </>
        ) : (
          <>
            <Upload className="w-12 h-12 text-muted-foreground" />
            <div className="text-center">
              <p className="text-sm font-medium">
                Drop your {type.toUpperCase()} here
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                or click to browse
              </p>
            </div>
          </>
        )}
      </div>
      <input
        type="file"
        className="hidden"
        accept=".pdf,.docx,.doc"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFiles(file);
        }}
      />
    </div>
  );
};

export default FileUpload;
