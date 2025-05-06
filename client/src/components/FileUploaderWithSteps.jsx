import { useState, useRef } from 'react';
import { X, Upload } from 'lucide-react';
import StepsProgress from './StepsProgress';
import { useNavigate } from 'react-router';

export default function FileUploadWithSteps() {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  // Only allow single file
  const addFiles = (newFiles) => {
    const file = newFiles[0];
    if (!file) return;
    setFiles([{
      file,
      id: `${file.name}-${Date.now()}`,
      progress: 0,
    }]);
    setCurrentStep(0);
    setUploadProgress(0);
    setError('');
  };

  const removeFile = (id) => {
    setFiles([]);
    setCurrentStep(0);
    setUploadProgress(0);
    setError('');
  };

  const clearAllFiles = () => {
    setFiles([]);
    setCurrentStep(0);
    setUploadProgress(0);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle file input
  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(Array.from(e.target.files));
      e.target.value = '';
    }
  };

  // Drag and drop handlers
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

  // Format file size
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

  // Step status message
  const getStepStatusMessage = () => {
    switch (currentStep) {
      case 0:
        return uploadProgress > 0 ? `Uploading file... ${uploadProgress}%` : '';
      case 1:
        return 'Scanning file for viruses...';
      case 2:
        return 'Analyzing file contents...';
      case 3:
        return 'Process completed successfully!';
      default:
        return '';
    }
  };

  // Upload and scan process
  const processFiles = async () => {
    if (files.length === 0) return;

    setCurrentStep(0);
    setUploadProgress(0);
    setError('');

    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      setFiles((currentFiles) =>
        currentFiles.map((file) => ({
          ...file,
          progress: progress,
        }))
      );
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setCurrentStep(1);
          setTimeout(() => {
            setCurrentStep(2);
            // API call after simulated scanning/analyzing
            callApi(files[0].file);
          }, 1200);
        }, 800);
      }
    }, 80);
  };

  // API call with fetch and FormData
  const callApi = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/predict-pe', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to scan file');
      }
      const data = await response.json();
      setCurrentStep(3);
      // Pass API data to /scan-complete using navigation state
      navigate('/scan-complete', { state: { scanResult: data } });
    } catch (err) {
      setError('Failed to scan file. Please try again.');
      setCurrentStep(0);
      setUploadProgress(0);
    }
  };

  // Steps
  const steps = ['Upload', 'Scanning', 'Analyzing', 'Complete'];

  return (
    <div className="card w-full">
      <div className="card-body mx-auto w-3xl">
        <h2 className="card-title text-2xl font-bold text-center mb-2">
          File Upload
        </h2>

        <StepsProgress currentStep={currentStep} steps={steps} />

        {error && (
          <div className="alert alert-error mt-2">
            <span>{error}</span>
          </div>
        )}

        {files.length > 0 && currentStep >= 0 && uploadProgress > 0 && (
          <div
            className={`alert ${currentStep === 3 ? 'alert-success' : 'alert-info'} mt-2`}
          >
            <span>{getStepStatusMessage()}</span>
          </div>
        )}

        {/* Upload Area */}
        {currentStep === 0 && uploadProgress === 0 && (
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300 mt-4 ${
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
                <h3 className="text-lg font-semibold">
                  Drag & Drop a file here
                </h3>
                <p className="text-sm text-base-content/70 mt-1">
                  or click to browse file
                </p>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                multiple={false}
                onChange={handleFileInputChange}
              />
              <button
                className="btn btn-dxprimary mt-2"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
              >
                Select File
              </button>
            </div>
          </div>
        )}

        {/* File List */}
        {files.length > 0 && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">File</h3>
            <div className="rounded-lg bg-gray-100 p-4 max-h-[200px] overflow-y-auto">
              <div className="space-y-3">
                {files.map((file) => (
                  <div key={file.id} className="mb-3 last:mb-0">
                    <div className="flex justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div className="badge badge-dxprimary">
                          {getFileExtension(file.file.name)}
                        </div>
                        <span className="text-sm font-medium truncate max-w-[60%]">
                          {file.file.name}
                        </span>
                        <span className="text-xs text-base-content/70">
                          {formatFileSize(file.file.size)}
                        </span>
                      </div>
                      {currentStep === 0 && uploadProgress === 0 && (
                        <button
                          className="btn btn-circle btn-xs btn-ghost"
                          onClick={() => removeFile(file.id)}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    {currentStep === 0 && uploadProgress > 0 && (
                      <progress
                        className="progress progress-dxprimary w-full"
                        value={file.progress}
                        max="100"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="card-actions justify-end mt-6">
          {currentStep === 0 && uploadProgress === 0 && (
            <button
              className="btn btn-dxprimary"
              disabled={files.length === 0}
              onClick={processFiles}
            >
              Start Scanning
            </button>
          )}
          {currentStep === 3 && (
            <button className="btn btn-dxprimary" onClick={clearAllFiles}>
              Start New Upload
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
