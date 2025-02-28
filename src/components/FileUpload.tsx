
import { useState, useCallback, useRef } from "react";
import { FileText, Upload, X } from "lucide-react";
import { type UploadState } from "@/types";

// FileUpload component handles drag & drop and click file uploads
// Supports PDF and DOCX files with a modern, animated interface
const FileUpload = ({
  type,
  dataType,
  onUpload,
  onRemove,
  disabled,
}: {
  type: "cv" | "jd";
  dataType: "file";
  onUpload: (content: string, file: File) => void;
  onRemove: () => void;
  disabled: boolean;
}) => {
  const [state, setState] = useState<UploadState>({
    isDragging: false,
    file: null,
    content: "",
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    if (disabled) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setState(prev => ({ ...prev, isDragging: true }));
    } else if (e.type === "dragleave") {
      setState(prev => ({ ...prev, isDragging: false }));
    }
  }, [disabled]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    if (disabled) return;
    
    e.preventDefault();
    e.stopPropagation();
    setState(prev => ({ ...prev, isDragging: false }));

    const files = Array.from(e.dataTransfer.files);
    if (files?.[0]) {
      handleFiles(files[0]);
    }
  }, [disabled]);

  const handleFiles = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setState(prev => ({ ...prev, file, content }));
      onUpload(content, file);
    };
    reader.readAsText(file);
  };

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setState({ isDragging: false, file: null, content: "" });
    onRemove();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClickUpload = () => {
    if (disabled) return;
    fileInputRef.current?.click();
  };

  return (
    <div
      className={`upload-zone rounded-xl p-8 border-2 border-dashed transition-all duration-200 ease-in-out
        ${state.isDragging ? "border-primary bg-primary/5" : "border-border"}
        ${state.file ? "bg-secondary/50" : "hover:bg-secondary/50"}
        ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={handleClickUpload}
    >
      <div className="flex flex-col items-center justify-center gap-4">
        {state.file ? (
          <div className="flex flex-col items-center">
            <div className="relative">
              <FileText className="w-12 h-12 text-primary" />
              <button 
                onClick={handleRemoveFile}
                className="absolute -top-2 -right-2 bg-gray-200 hover:bg-gray-300 rounded-full p-1"
                aria-label="Remove file"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm font-medium mt-2">{state.file.name}</p>
          </div>
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
              <button
                type="button"
                onClick={handleClickUpload}
                disabled={disabled}
                className={`mt-4 px-4 py-2 bg-primary text-white rounded-md text-sm font-medium
                  transition-colors duration-200
                  ${disabled ? 'opacity-60 cursor-not-allowed' : 'hover:bg-primary/90'}`}
              >
                Upload {type.toUpperCase()}
              </button>
            </div>
          </>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".pdf,.docx,.doc"
        disabled={disabled}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFiles(file);
        }}
      />
    </div>
  );
};

export default FileUpload;
