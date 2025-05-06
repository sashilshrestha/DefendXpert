import Navbar from './Navbar';
import { Link } from 'react-router';
import {
  AlertTriangle,
  FileWarning,
  ShieldAlert,
  Download,
  FileSearch,
} from 'lucide-react';


export default function ScanComplete({ onScanAnother }) {

  // if (!resultData) 
  //   return <p>Scan result not available.</p>;
  
  //Getting scan data
  const scanResult = JSON.parse(localStorage.getItem('scanResult'));

  //Scan Result
  const isMalicious = scanResult?.message !== 'benign';
  const details = scanResult?.technical_details || {};
  
  const malwareDetails = scanResult?.scan_details || {};
  


  //__________________________New Report________________________________//

  const handleDownloadReport = () => {
    const reportContent = `
SCAN REPORT
===========
Date: ${new Date().toLocaleString()}

STATUS
------
${scanResult.message.toUpperCase()}
Confidence: ${scanResult.confidence}%
Threshold: ${scanResult.threshold_confidence}%

TECHNICAL DETAILS
-----------------
File Name: ${details.file_name}
File Size: ${details.file_size}
File Type: ${details.file_type}
SHA-256: ${details.sha_hash}
Engine Version: ${details.engine_version}

RECOMMENDED ACTION
------------------
${isMalicious ? 'Delete the file and scan the system with antivirus.' : 'No malicious content detected. File is safe.'}
    `.trim();

    
  //____________________________________________________________________________//

//   // This function would handle downloading the report
//   const handleDownloadReport = () => {
//     // Create a sample report content
//     const reportContent = `
// SCAN REPORT
// ===========
// Date: ${new Date().toLocaleString()}

// MALICIOUS CONTENT
// ----------------
// Malware Type: Trojan
// Threat Level: High
// Detection Method: Signature-based and Behavioral Analysis

// PREDICTED BEHAVIOR
// -----------------
// - Attempts to establish persistence on system startup
// - Collects sensitive information from the system
// - Communicates with command and control servers
// - May attempt to encrypt files for ransom

// RECOMMENDED ACTION
// ----------------
// Immediate deletion recommended. Do not open or execute this file.
// Scan your system with a full antivirus scan to ensure no components were installed.
//     `.trim();

    // Create a blob and download it
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'scan-report.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="shadow-md bg-dxprimary">
        <div className="mx-auto max-w-7xl">
          <Navbar />
        </div>
      </div>
      <div className="bg-base-500">
        <div className="mx-auto max-w-7xl">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <h2 className="card-title text-2xl font-bold">Scan Complete</h2>
              <ShieldAlert className="h-8 w-8 text-error" />
            </div>

            <div className="divider"></div>

            {isMalicious ? (
              <div className="bg-error/10 rounded-lg p-4 mb-4">
                <h3 className="text-lg font-bold text-error">
                  Malicious Content Detected
                </h3>
                <p>
                  This file was identified as <strong>{scanResult.message}</strong> with{' '}
                  <strong>{scanResult.confidence}% confidence</strong>.
                </p>
              </div>
            ) : (
              <div className="bg-success/10 rounded-lg p-4 mb-4">
                <h3 className="text-lg font-bold text-success">No Threat Detected</h3>
                <p>
                  This file appears <strong>benign</strong> with{' '}
                  <strong>{scanResult.confidence}% confidence</strong>. No action is
                  needed.
                </p>
              </div>
            )}

            {/* Predicted Behavior Section */}
            {isMalicious && scanResult.predicted_behaviour?.length > 0 && (
              <div className="bg-warning/10 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-3 mb-2">
                  <FileWarning className="h-6 w-6 text-warning" />
                  <h3 className="text-lg font-bold text-warning">
                    Predicted Behavior
                  </h3>
                </div>
                <ul className="pl-9 list-disc ml-4 space-y-1">
                  {scanResult.predicted_behaviour.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommended Action Section */}
            {isMalicious && scanResult.recommended_action?.length > 0 && (
              <div className="bg-info/10 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <ShieldAlert className="h-6 w-6 text-info" />
                  <h3 className="text-lg font-bold text-info">
                    Recommended Action
                  </h3>
                </div>
                <ul className="pl-9 list-disc ml-4 space-y-1">
                  {scanResult.recommended_action.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}


            {/* Technical Details Collapse */}
            <div className="collapse collapse-arrow bg-base-200 mb-6 text-white">
              <input type="checkbox" />
              <div className="collapse-title font-medium">
                Technical Details
              </div>
              <div className="collapse-content">
                <div className="overflow-x-auto">
                  <table className="table table-xs">
                    <tbody>
                      <tr>
                        <td className="font-semibold">File Name</td>
                        <td>{details.file_name}</td>
                      </tr>
                      <tr>
                        <td className="font-semibold">File Size</td>
                        <td>{details.file_size}</td>
                      </tr>
                      <tr>
                        <td className="font-semibold">File Type</td>
                        <td>{details.file_size}</td>
                      </tr>
                      <tr>
                        <td className="font-semibold">SHA-256</td>
                        <td className="text-xs">
                        {details.sha_hash}
                        </td>
                      </tr>

                      {isMalicious ? (
                        <tr>
                          <td className="font-semibold">Detection Name</td>
                          <td>{malwareDetails.malware_description}</td>
                        </tr>
                       ) : (
                        <tr>
                          <td className="font-semibold">Detection Name</td>
                          <td>None</td>
                        </tr>
                        )}
                        
                      <tr>
                        <td className="font-semibold">Detection Engine</td>
                        <td>v12.5.302</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="card-actions justify-center gap-4">
              <Link to="/">
                <button
                  className="btn bg-dxsecondary border-dxsecondary text-white"
                  onClick={onScanAnother}
                >
                  <FileSearch className="h-5 w-5 mr-2" />
                  Scan Another File
                </button>
              </Link>
              <button
                className="btn btn-outline"
                onClick={handleDownloadReport}
              >
                <Download className="h-5 w-5 mr-2" />
                Download Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
