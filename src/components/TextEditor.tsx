
import { useState } from "react";

// Rich text editor component for manual CV/JD input
// Supports basic text formatting and content editing
const TextEditor = ({
  type,
  onChange,
}: {
  type: "cv" | "jd";
  onChange: (content: string) => void;
}) => {
  const [content, setContent] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    onChange(e.target.value);
  };

  return (
    <div className="w-full">
      <textarea
        className="w-full min-h-[300px] p-4 rounded-lg border bg-background resize-y
          focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200"
        placeholder={`Enter your ${type.toUpperCase()} content here...`}
        value={content}
        onChange={handleChange}
      />
    </div>
  );
};

export default TextEditor;
