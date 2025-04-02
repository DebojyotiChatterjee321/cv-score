
import { useState, useEffect } from "react";

// Rich text editor component for manual CV/JD input
// Supports basic text formatting and content editing
const TextEditor = ({
  type,
  dataType,
  onChange,
  disabled,
  resetContent,
}: {
  type: "cv" | "jd";
  dataType: "text";
  onChange: (content: string) => void;
  disabled: boolean;
  resetContent: boolean;
}) => {
  const [content, setContent] = useState("");

  useEffect(() => {
    if (resetContent) {
      setContent("");
    }
  }, [resetContent]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    onChange(e.target.value);
  };

  return (
    <div className="w-full">
      <textarea
        className={`w-full min-h-[300px] p-4 rounded-lg border bg-background resize-y
          transition-all duration-200
          ${disabled 
            ? 'bg-gray-100 cursor-not-allowed opacity-70' 
            : 'focus:outline-none focus:ring-2 focus:ring-primary/20'}`}
        placeholder={`Enter your ${type.toUpperCase()} content here...`}
        value={content}
        onChange={handleChange}
        disabled={disabled}
      />
    </div>
  );
};

export default TextEditor;
