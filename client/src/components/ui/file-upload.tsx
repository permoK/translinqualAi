import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { PaperclipIcon, X, File, FileText, FileImage, Upload } from "lucide-react";
import { uploadFile } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface FileUploadProps {
  onUpload: (fileUrl: string, fileName: string) => void;
}

export function FileUpload({ onUpload }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<{ name: string, size: number, type: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 5MB",
        variant: "destructive"
      });
      return;
    }

    // Check file type
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png",
      "text/plain"
    ];

    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Unsupported file type",
        description: "Please upload a PDF, DOC, DOCX, JPG, PNG, or TXT file",
        variant: "destructive"
      });
      return;
    }

    setPreview({
      name: file.name,
      size: file.size,
      type: file.type
    });

    try {
      setIsUploading(true);
      const result = await uploadFile(file);
      onUpload(result.fileUrl, file.name);
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "An error occurred while uploading the file",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) {
      return <FileImage className="text-blue-500" />;
    } else if (type === "application/pdf") {
      return <File className="text-red-500" />;
    } else if (type.includes("word") || type === "application/msword") {
      return <FileText className="text-blue-700" />;
    } else {
      return <FileText className="text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  const handleCancelUpload = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
      />
      
      {preview ? (
        <div className="mb-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {getFileIcon(preview.type)}
              <span className="ml-2 font-medium">{preview.name}</span>
              <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                ({formatFileSize(preview.size)})
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCancelUpload}
              className="text-gray-500 hover:text-red-500"
              disabled={isUploading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          {isUploading && (
            <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
              <div className="bg-primary h-1.5 rounded-full animate-pulse w-full"></div>
            </div>
          )}
        </div>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleButtonClick}
          className="text-gray-500 hover:text-primary"
          disabled={isUploading}
        >
          <PaperclipIcon className="h-5 w-5" />
        </Button>
      )}
    </>
  );
}
