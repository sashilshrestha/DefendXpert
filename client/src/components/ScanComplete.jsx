import Navbar from './Navbar';
import { Link } from 'react-router';
import {
  AlertTriangle,
  FileWarning,
  ShieldAlert,
  Download,
  FileSearch,
} from 'lucide-react';


export default function ScanComplete({ onScanAnother, resultData }) {

  if (!resultData) 
    return <p>Scan result not available.</p>;
  

  // This function would handle downloading the report
  const handleDownloadReport = () => {
    // Create a sample report content
    const reportContent = `
SCAN REPORT
===========
Date: ${new Date().toLocaleString()}

MALICIOUS CONTENT
----------------
Malware Type: Trojan
Threat Level: High
Detection Method: Signature-based and Behavioral Analysis

PREDICTED BEHAVIOR
-----------------
- Attempts to establish persistence on system startup
- Collects sensitive information from the system
- Communicates with command and control servers
- May attempt to encrypt files for ransom

RECOMMENDED ACTION
----------------
Immediate deletion recommended. Do not open or execute this file.
Scan your system with a full antivirus scan to ensure no components were installed.
    `.trim();

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

            {/* Malicious Content Section */}
            <div className="bg-error/10 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-3 mb-2">
                <AlertTriangle className="h-6 w-6 text-error" />
                <h3 className="text-lg font-bold text-error">
                  Malicious Content Detected
                </h3>
              </div>
              <p className="pl-9">
                This file contains malicious code identified as a{' '}
                <span className="font-semibold">Trojan</span> with a{' '}
                <span className="font-semibold">high threat level</span>. The
                file has been quarantined to prevent any damage to your system.
              </p>
            </div>

            {/* Predicted Behavior Section */}
            <div className="bg-warning/10 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-3 mb-2">
                <FileWarning className="h-6 w-6 text-warning" />
                <h3 className="text-lg font-bold text-warning">
                  Predicted Behavior
                </h3>
              </div>
              <ul className="pl-9 list-disc ml-4 space-y-1">
                <li>Attempts to establish persistence on system startup</li>
                <li>Collects sensitive information from the system</li>
                <li>Communicates with command and control servers</li>
                <li>May attempt to encrypt files for ransom</li>
              </ul>
            </div>

            {/* Recommended Action Section */}
            <div className="bg-info/10 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3 mb-2">
                <ShieldAlert className="h-6 w-6 text-info" />
                <h3 className="text-lg font-bold text-info">
                  Recommended Action
                </h3>
              </div>
              <ul className="pl-9 list-disc ml-4 space-y-1">
                <li>
                  <span className="font-semibold">
                    Immediate deletion recommended.
                  </span>{' '}
                  Do not open or execute this file.
                </li>
                <li>
                  Scan your system with a full antivirus scan to ensure no
                  components were installed.
                </li>
                <li>
                  Update your antivirus definitions to the latest version.
                </li>
                <li>
                  Check other files from the same source for potential threats.
                </li>
              </ul>
            </div>

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
                        <td>malicious_document.pdf</td>
                      </tr>
                      <tr>
                        <td className="font-semibold">File Size</td>
                        <td>1.24 MB</td>
                      </tr>
                      <tr>
                        <td className="font-semibold">File Type</td>
                        <td>PDF (with embedded JavaScript)</td>
                      </tr>
                      <tr>
                        <td className="font-semibold">SHA-256</td>
                        <td className="text-xs">
                          8a9f8e7d6c5b4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0
                        </td>
                      </tr>
                      <tr>
                        <td className="font-semibold">Detection Name</td>
                        <td>Trojan.PDF.Dropper</td>
                      </tr>
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
