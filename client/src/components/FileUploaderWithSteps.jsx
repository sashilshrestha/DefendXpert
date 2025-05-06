import { useState, useRef, useEffect } from 'react';
import { X, Upload } from 'lucide-react';
import StepsProgress from './StepsProgress';
import { useNavigate } from 'react-router';


// Assuming you have a way to access the token, for example, from local storage
// const getToken = () => localStorage.getItem('authToken'); // Replace with your actual token retrieval method
const getToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc0NjM3MjY5MywianRpIjoiYWI2NzIwZTItMmQ4Yi00MzEwLWE1Y2MtNTFhZjg4NjJiNDRhIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6IjEiLCJuYmYiOjE3NDYzNzI2OTMsImNzcmYiOiIyZjM0NzNhYi02YjIzLTQ4NjUtYjk2NS1iNjk3NzY1OTQyZjYiLCJleHAiOjE3NDYzNzM1OTN9.SpxgaHWd-OOcNZcxo6UvHISgTpyVjsHPYrT6b2nxJ_Y"; 
export default function FileUploadWithSteps() {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (currentStep === 3) {
      // Redirect to /scan-complete
      navigate('/scan-complete');
    }
  }, [currentStep, navigate]);

  // Step definitions
  const steps = ['Upload', 'Scanning', 'Analyzing', 'Complete'];

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
    // Reset to upload step when new files are added
    setCurrentStep(0);
    setUploadProgress(0);
  };

  const removeFile = (id) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.id !== id));
    if (files.length <= 1) {
      // Reset steps if removing the last file
      setCurrentStep(0);
      setUploadProgress(0);
    }
  };

  const clearAllFiles = () => {
    setFiles([]);
    setCurrentStep(0);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // const processFiles = () => {
  //   if (files.length === 0) return;

  //   // Start the upload process (step 0)
  //   setCurrentStep(0);

  //   // Simulate upload progress
  //   let progress = 0;
  //   const uploadInterval = setInterval(() => {
  //     progress += 5;
  //     setUploadProgress(progress);

  //     // Update files progress
  //     setFiles((currentFiles) =>
  //       currentFiles.map((file) => ({
  //         ...file,
  //         progress: progress,
  //       }))
  //     );

  //     if (progress >= 100) {
  //       clearInterval(uploadInterval);

  //       // Move to scanning step
  //       setTimeout(() => {
  //         setCurrentStep(1);

  //         // Simulate scanning step
  //         setTimeout(() => {
  //           // Move to analyzing step
  //           setCurrentStep(2);

  //           // Simulate analyzing step
  //           setTimeout(() => {
  //             // Complete the process
  //             setCurrentStep(3);
  //           }, 2000);
  //         }, 2000);
  //       }, 500);
  //     }
  //   }, 100);
  // };

  //_____________________________________Upload to Send Files to Flask___________________________________________//
  const processFiles = async () => {
    if (files.length === 0) return;
  
    setCurrentStep(0); // Upload step
    setUploadProgress(0);

    // const token = getToken; // Get the JWT
  
    for (const fileObj of files) {
      const formData = new FormData();
      console.log('Uploading file:', fileObj.file);
      formData.append('file', fileObj.file);
  
      try {
        const response = await fetch('http://localhost:5000/predict-pe', {
          method: 'POST',
          // headers: {
          //   'Authorization': `Bearer ${token}`, // Include the JWT in the Authorization header
          // }, 
          body: formData,
        });
  
        if (!response.ok) {
          throw new Error(`Server error: ${response.statusText}`);
        }
  
        const result = await response.json();
        console.log('Scan result:', result);
  
        // You can handle the result here, e.g., update state or navigate
        // For example, navigate to a results page with the data
        // navigate('/scan-complete', { state: { result } });

        //This might be temporary but it saves result locally
        localStorage.setItem('scanResult', JSON.stringify(result));
        navigate('/scan-complete');
  
      } catch (error) {
        console.error('Error uploading file:', error);
        // Handle error appropriately
      }
    }
  
    // Update steps after processing
    setCurrentStep(3); // Complete
  };
  
  //_____________________________________________________________________________________________________________________________//
  

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

  // Get step status message
  const getStepStatusMessage = () => {
    switch (currentStep) {
      case 0:
        // return `Uploading files... ${uploadProgress}%`;
        return `${
          uploadProgress > 0 ? `Uploading files... ${uploadProgress}%` : ''
        }`;
      case 1:
        return 'Scanning files for viruses...';
      case 2:
        return 'Analyzing file contents...';
      case 3:
        return 'Process completed successfully!';
      default:
        return '';
    }
  };

  return (
    <div className="card w-full">
      <div className="card-body mx-auto w-3xl">
        <h2 className="card-title text-2xl font-bold text-center mb-2">
          File Upload
        </h2>

        {/* Steps Progress Indicator */}
        <StepsProgress currentStep={currentStep} steps={steps} />

        {/* Status Message */}
        {files.length > 0 && currentStep >= 0 && uploadProgress > 0 && (
          <div
            className={`alert ${
              currentStep === 3 ? 'alert-success' : 'alert-info'
            } mt-2`}
          >
            <span>{getStepStatusMessage()}</span>
          </div>
        )}

        {/* Upload Area - Only show if in initial step or no files */}
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
                  Drag & Drop files here
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
        )}

        {/* File List */}
        {files.length > 0 && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Files</h3>
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
            <>
              <button
                className="btn btn-dxprimary"
                disabled={files.length === 0}
                onClick={processFiles}
              >
                Start Scanning
              </button>
              {/* <button className="btn btn-outline" onClick={clearAllFiles}>
                Clear All
              </button> */}
            </>
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
