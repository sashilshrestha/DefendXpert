import { useState, useRef } from 'react';
import { Upload } from 'lucide-react';

const ModelTrain = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState([]);
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
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
      e.target.value = '';
    }
  };

  const addFiles = (newFiles) => {
    const newFilesWithPreview = newFiles.map((file) => ({
      file,
      id: `${file.name}-${Date.now()}`,
    }));

    setFiles((prevFiles) => [...prevFiles, ...newFilesWithPreview]);
  };

  const removeFile = (id) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.id !== id));
  };

  const clearAllFiles = () => {
    setFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const startTraining = () => {
    if (files.length === 0) return;

    setIsTraining(true);
    setTrainingProgress(0);

    // Simulate training progress
    const interval = setInterval(() => {
      setTrainingProgress((prev) => {
        const newProgress = prev + Math.random() * 5;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsTraining(false);
            setTrainingProgress(0);
            // Add new model to history (in a real app)
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, 500);
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

  return (
    <div>
      {/* Upload Dataset Card */}
      <div className="card shadow-sm">
        <div className="card-body">
          <h3 className="card-title">Upload Training Dataset</h3>

          <div className="mt-6">
            <h4 className="font-semibold mb-4">Training Configuration</h4>

            <div className="form-control mb-3">
              <label className="label">
                <span className="label-text">Model Name</span>
              </label>
              <input
                type="text"
                placeholder="model-v1.*"
                className="input input-bordered w-full bg-white"
              />
            </div>

            {/* <div className="form-control mb-3">
              <label className="label">
                <span className="label-text">Epochs</span>
              </label>
              <input
                type="number"
                placeholder="50"
                className="input input-bordered w-full"
              />
            </div>

            <div className="form-control mb-3">
              <label className="label">
                <span className="label-text">Learning Rate</span>
              </label>
              <input
                type="number"
                placeholder="0.001"
                step="0.001"
                className="input input-bordered w-full"
              />
            </div>

            <div className="form-control mb-3">
              <label className="label">
                <span className="label-text">Batch Size</span>
              </label>
              <select className="select select-bordered w-full">
                <option>16</option>
                <option>32</option>
                <option>64</option>
                <option>128</option>
              </select>
            </div> */}
          </div>
          
          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-300 mt-4 ${
              isDragging ? 'border-primary /5' : 'border-base-300'
            }`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="flex flex-col items-center justify-center gap-4">
              <Upload className="h-12 w-12 text-primary" />
              <div>
                <h3 className="text-lg font-semibold">
                  Drag & Drop dataset files
                </h3>
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
                className="btn btn-primary btn-sm mt-2"
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
          {files.length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Selected Files</h4>
              <div className="rounded-lg p-4 max-h-[200px] overflow-y-auto">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-2 border-b border-base-300 last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="badge badge-primary">
                        {file.file.name.split('.').pop().toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium truncate max-w-[150px]">
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Training Configuration */}
          <div className="mt-6">
            <h4 className="font-semibold mb-4">Training Configuration</h4>

            <div className="form-control mb-3">
              <label className="label">
                <span className="label-text">Model Name</span>
              </label>
              <input
                type="text"
                placeholder="model-v1.*"
                className="input input-bordered w-full bg-white"
              />
            </div>

            {/* <div className="form-control mb-3">
              <label className="label">
                <span className="label-text">Epochs</span>
              </label>
              <input
                type="number"
                placeholder="50"
                className="input input-bordered w-full"
              />
            </div>

            <div className="form-control mb-3">
              <label className="label">
                <span className="label-text">Learning Rate</span>
              </label>
              <input
                type="number"
                placeholder="0.001"
                step="0.001"
                className="input input-bordered w-full"
              />
            </div>

            <div className="form-control mb-3">
              <label className="label">
                <span className="label-text">Batch Size</span>
              </label>
              <select className="select select-bordered w-full">
                <option>16</option>
                <option>32</option>
                <option>64</option>
                <option>128</option>
              </select>
            </div> */}
          </div>

          {/* Action Buttons */}
          <div className="card-actions justify-end mt-6">
            {isTraining ? (
              <div className="w-full">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">
                    Training in progress...
                  </span>
                  <span className="text-sm">
                    {Math.round(trainingProgress)}%
                  </span>
                </div>
                <progress
                  className="progress progress-primary w-full"
                  value={trainingProgress}
                  max="100"
                ></progress>
              </div>
            ) : (
              <>
                <button className="btn btn-outline" onClick={clearAllFiles}>
                  Clear
                </button>
                <button
                  className="btn btn-primary"
                  disabled={files.length === 0}
                  onClick={startTraining}
                >
                  Start Training
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelTrain;
