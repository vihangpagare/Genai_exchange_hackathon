import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, AlertCircle, Cloud, Sparkles } from 'lucide-react';

const FileUpload = ({ onFileUpload, accept, maxSize }) => {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      onFileUpload(acceptedFiles[0]);
    }
  }, [onFileUpload]);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    fileRejections
  } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
      'application/vnd.ms-powerpoint': ['.ppt']
    },
    maxSize: maxSize || 10 * 1024 * 1024, // 10MB default
    multiple: false
  });

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 relative overflow-hidden
          ${isDragActive && !isDragReject ? 'border-blue-400 bg-gradient-to-br from-blue-50 to-purple-50 scale-105' : ''}
          ${isDragReject ? 'border-red-400 bg-gradient-to-br from-red-50 to-pink-50' : ''}
          ${!isDragActive && !isDragReject ? 'border-gray-300 hover:border-blue-400 hover:bg-gradient-to-br hover:from-gray-50 hover:to-blue-50 hover:scale-102' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-4 left-4 w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full blur-xl" />
          <div className="absolute bottom-4 right-4 w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full blur-xl" />
        </div>
        
        <div className="flex flex-col items-center gap-6 relative z-10">
          <div className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-300 ${
            isDragActive 
              ? 'bg-gradient-to-br from-blue-500 to-purple-600 scale-110' 
              : 'bg-gradient-to-br from-gray-100 to-gray-200'
          }`}>
            {isDragActive ? (
              <Cloud className="w-10 h-10 text-white animate-bounce" />
            ) : (
              <FileText className="w-10 h-10 text-gray-600" />
            )}
          </div>
          
          <div className="space-y-2">
            <p className="text-xl font-bold text-gray-900">
              {isDragActive
                ? 'Drop your file here'
                : 'Drag & drop your document here'}
            </p>
            <p className="text-gray-600 text-lg">
              or click to browse files
            </p>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-500 bg-white/50 px-4 py-2 rounded-full">
            <div className="flex items-center gap-1">
              <FileText className="w-4 h-4" />
              <span>PDF, PPTX, PPT</span>
            </div>
            <div className="w-1 h-1 bg-gray-400 rounded-full" />
            <span>Max {formatFileSize(maxSize || 10 * 1024 * 1024)}</span>
          </div>
          
          {!isDragActive && (
            <div className="flex items-center gap-2 text-blue-600">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">AI-powered analysis</span>
            </div>
          )}
        </div>
      </div>

      {fileRejections.length > 0 && (
        <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h4 className="font-semibold text-red-800 text-lg">File Upload Error</h4>
              <ul className="mt-2 text-sm text-red-700 space-y-1">
                {fileRejections.map(({ file, errors }) => (
                  <li key={file.name} className="flex items-center gap-2">
                    <span className="font-medium">{file.name}</span>
                    <span>•</span>
                    <span>{errors.map(e => e.message).join(', ')}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
