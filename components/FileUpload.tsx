import React, { useCallback, useState } from 'react';
import { Upload, FileText, X, AlertCircle } from 'lucide-react';
import { MAX_FILE_SIZE_MB, ALLOWED_FILE_TYPES } from '../constants';

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, selectedFile }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): boolean => {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setError("Only PDF or Text documents are allowed.");
      return false;
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError(`File size exceeds ${MAX_FILE_SIZE_MB}MB limit.`);
      return false;
    }
    setError(null);
    return true;
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && validateFile(file)) {
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validateFile(file)) {
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFileSelect(null);
    setError(null);
  };

  return (
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative flex flex-col items-center justify-center w-full h-48 
          rounded-xl border-2 border-dashed transition-all duration-200 ease-in-out
          ${isDragging ? 'border-emerald-500 bg-emerald-50' : 'border-slate-300 bg-white'}
          ${selectedFile ? 'border-emerald-500 bg-white' : 'hover:border-emerald-400 hover:bg-slate-50'}
        `}
      >
        {selectedFile ? (
          <div className="flex flex-col items-center animate-fade-in">
            <div className="bg-emerald-100 p-3 rounded-full mb-3">
              <FileText className="w-8 h-8 text-emerald-600" />
            </div>
            <p className="text-sm font-medium text-slate-700 max-w-xs truncate text-center px-4">
              {selectedFile.name}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
            <button
              onClick={handleRemoveFile}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <>
            <div className={`bg-emerald-50 p-3 rounded-full mb-3 transition-transform duration-200 ${isDragging ? 'scale-110' : ''}`}>
              <Upload className="w-8 h-8 text-emerald-500" />
            </div>
            <p className="text-sm font-medium text-slate-700">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-slate-400 mt-1">
              PDF or Txt documents only (MAX. {MAX_FILE_SIZE_MB}MB)
            </p>
            <input
              type="file"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              accept=".pdf,.txt"
              onChange={handleFileInput}
            />
          </>
        )}
      </div>
      {error && (
        <div className="flex items-center mt-3 text-red-500 text-sm animate-pulse">
          <AlertCircle className="w-4 h-4 mr-1.5" />
          {error}
        </div>
      )}
    </div>
  );
};

export default FileUpload;