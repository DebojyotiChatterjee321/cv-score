
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
      className={`upload-zone rounded-xl p-8 transition-all duration-300 ease-in-out
        ${state.isDragging ? "shadow-lg scale-[1.02] border-2 border-dashed border-blue-400" : "border border-gray-200"}
        ${state.file ? "bg-blue-50/50" : "hover:bg-gray-50 hover:shadow-md"}
        ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}
        bg-gradient-to-br from-white to-gray-50`}
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
              <div className="p-4 bg-blue-100 rounded-full">
                <FileText className="w-10 h-10 text-blue-600" />
              </div>
              <button 
                onClick={handleRemoveFile}
                className="absolute -top-2 -right-2 bg-white hover:bg-gray-100 rounded-full p-1 shadow-md transition-colors duration-200"
                aria-label="Remove file"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            <p className="text-sm font-medium mt-3 text-gray-900">{state.file.name}</p>
            <p className="text-xs text-gray-500 mt-1">Click to change file</p>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-4 py-6">
            <div className="p-4 bg-blue-50 rounded-full">
              <Upload className="w-10 h-10 text-blue-600" />
            </div>
            <div className="text-center space-y-2">
              <p className="text-base font-medium text-gray-900">
                Drop your {type.toUpperCase()} here
              </p>
              <p className="text-sm text-gray-500">
                or click to browse files
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Supports PDF, DOCX, DOC
              </p>
            </div>
          </div>
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
