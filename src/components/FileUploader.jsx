import { useState, useRef } from 'react';
import { X, Upload } from 'lucide-react';

export default function FileUploader() {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length === 0) return;

    addFiles(droppedFiles);
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(Array.from(e.target.files));
      // Reset the input value so the same file can be selected again
      e.target.value = '';
    }
  };

  const addFiles = (newFiles) => {
    const newFilesWithPreview = newFiles.map((file) => ({
      file,
      id: `${file.name}-${Date.now()}`,
      progress: 0,
    }));

    setFiles((prevFiles) => [...prevFiles, ...newFilesWithPreview]);
    setUploadComplete(false);
  };

  const removeFile = (id) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.id !== id));
  };

  const clearAllFiles = () => {
    setFiles([]);
    setUploadComplete(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const simulateUpload = () => {
    if (files.length === 0) return;

    setIsUploading(true);

    // Create a copy of files to update progress
    const updatingFiles = [...files];

    // Simulate progress updates for each file
    const intervals = updatingFiles.map((file) => {
      return setInterval(() => {
        setFiles((currentFiles) => {
          const newFiles = [...currentFiles];
          const fileIndex = newFiles.findIndex((f) => f.id === file.id);

          if (fileIndex !== -1) {
            const progressIncrement = Math.random() * 10;
            let newProgress = newFiles[fileIndex].progress + progressIncrement;

            if (newProgress > 100) newProgress = 100;

            newFiles[fileIndex] = {
              ...newFiles[fileIndex],
              progress: newProgress,
            };
          }

          return newFiles;
        });
      }, 200 + Math.random() * 300); // Randomize the interval slightly
    });

    // Check if all uploads are complete
    const checkCompletion = setInterval(() => {
      setFiles((currentFiles) => {
        const allComplete = currentFiles.every((file) => file.progress === 100);

        if (allComplete) {
          clearInterval(checkCompletion);
          intervals.forEach(clearInterval);

          setTimeout(() => {
            setIsUploading(false);
            setUploadComplete(true);
          }, 500);
        }

        return currentFiles;
      });
    }, 200);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    );
  };

  const getFileExtension = (filename) => {
    return filename.split('.').pop()?.toUpperCase() || '';
  };

  return (
    <div className="card w-full max-w-2xl mx-auto">
      <div className="card-body">
        <h2 className="text-2xl font-bold text-center mb-6 text-dxprimary">
          Check Malware
        </h2>

        {/* Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300 hover:bg-blue-50 ${
            isDragging ? 'border-dxprimary bg-dxprimary/5' : 'border-base-300'
          }`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="flex flex-col items-center justify-center gap-4">
            <Upload className="h-16 w-16 text-dxprimary" />
            <div>
              <h3 className="text-lg font-semibold">Drag & Drop files here</h3>
              <p className="text-sm text-base-content/70 mt-1">
                or click to browse files
              </p>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              multiple
              onChange={handleFileInputChange}
            />
            <button
              className="btn btn-dxprimary mt-2"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
            >
              Select Files
            </button>
          </div>
        </div>

        {/* File List */}
        <div className="mt-8">
          <h3 className="font-semibold mb-2">Uploaded Files</h3>
          <div className="rounded-lg max-h-[200px] overflow-y-auto">
            {uploadComplete ? (
              <div className="alert alert-success bg-dxsecondary text-white border-dxsecondary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 shrink-0 stroke-current"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>All files uploaded successfully!</span>
              </div>
            ) : files.length === 0 ? (
              <div className="text-center text-base-content/70 py-4">
                No files uploaded yet
              </div>
            ) : isUploading ? (
              <div className="space-y-3">
                {files.map((file) => (
                  <div key={file.id} className="mb-3 last:mb-0">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium truncate max-w-[80%]">
                        {file.file.name}
                      </span>
                      <span className="text-sm">
                        {Math.round(file.progress)}%
                      </span>
                    </div>
                    <progress
                      className="progress progress-primary w-full"
                      value={file.progress}
                      max="100"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div>
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-2 border-b border-base-300 last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="badge badge-primary">
                        {getFileExtension(file.file.name)}
                      </div>
                      <div>
                        <div className="font-medium truncate max-w-xs">
                          {file.file.name}
                        </div>
                        <div className="text-xs text-base-content/70">
                          {formatFileSize(file.file.size)}
                        </div>
                      </div>
                    </div>
                    <button
                      className="btn btn-circle btn-xs btn-ghost"
                      onClick={() => removeFile(file.id)}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Upload Button */}
        <div className="card-actions justify-center mt-6">
          {/* disabled={files.length === 0 || isUploading || uploadComplete} */}
          <button
            className="btn bg-dxsecondary text-white border-dxsecondary"
            onClick={simulateUpload}
          >
            Start Analysing
          </button>
          <button
            className="btn btn-outline"
            disabled={isUploading}
            onClick={clearAllFiles}
          >
            Clear All
          </button>
        </div>
      </div>
    </div>
  );
}
