"use client";
import { Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
import { FC, useMemo } from "react";
import "react-quill/dist/quill.snow.css";

interface TextEditorProps {
  onChange?: () => void;
  value: string;
  theme?: "snow" | "bubble";
  readOnly?: boolean;
}

const TextEditor: FC<TextEditorProps> = ({
  theme,
  value,
  onChange,
  readOnly,
}) => {
  const ReactQuill = useMemo(
    () =>
      dynamic(() => import("react-quill"), {
        ssr: false,
        loading: () => (
          <div className="w-full h-[6rem] flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-sky-500 animate-spin" />
          </div>
        ),
      }),
    []
  );

  return (
    <ReactQuill
      className="bg-white"
      onChange={onChange}
      value={value}
      theme={theme || "snow"}
      readOnly={readOnly}
    />
  );
};

export default TextEditor;
