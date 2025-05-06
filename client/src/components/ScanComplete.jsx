import Navbar from './Navbar';
import { Link, useLocation } from 'react-router';
import {
  AlertTriangle,
  CheckIcon,
  FileWarning,
  ShieldAlert,
  Download,
  FileSearch,
} from 'lucide-react';

export default function ScanComplete({ onScanAnother }) {
  const location = useLocation();
  const scanResult = location.state?.scanResult;

  // Helper for technical details table
  const renderTechnicalDetails = (details) => (
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
            <td>{details.file_type}</td>
          </tr>
          <tr>
            <td className="font-semibold">SHA-256</td>
            <td className="text-xs">{details.sha_hash}</td>
          </tr>
          {details.engine_version && (
            <tr>
              <td className="font-semibold">Engine Version</td>
              <td>{details.engine_version}</td>
            </tr>
          )}
          {scanResult?.scan_details?.malware_class && (
            <tr>
              <td className="font-semibold">Detection Name</td>
              <td>{scanResult.scan_details.malware_class}</td>
            </tr>
          )}
          {scanResult?.scan_details?.threat_level && (
            <tr>
              <td className="font-semibold">Threat Level</td>
              <td>{scanResult.scan_details.threat_level}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  // Download report with API data
  const handleDownloadReport = () => {
    let reportContent = `SCAN REPORT\n===========\nDate: ${new Date().toLocaleString()}\n\n`;

    if (scanResult?.message === 'malware') {
      reportContent += `MALICIOUS CONTENT\n----------------\nMalware Type: ${scanResult.scan_details?.malware_class || 'Unknown'}\nThreat Level: ${scanResult.scan_details?.threat_level || 'Unknown'}\nMalware Description: ${scanResult.scan_details?.malware_description || 'N/A'}\n\n`;
      reportContent += `PREDICTED BEHAVIOR\n-----------------\n${(scanResult.predicted_behaviour || []).map(b => '- ' + b).join('\n')}\n\n`;
      reportContent += `RECOMMENDED ACTION\n------------------\n${(scanResult.recommended_action || []).map(a => '- ' + a).join('\n')}\n\n`;
    } else {
      reportContent += `MALICIOUS CONTENT\n----------------\nNo malware detected.\n\n`;
    }

    reportContent += `TECHNICAL DETAILS\n-----------------\n`;
    for (const [key, value] of Object.entries(scanResult?.technical_details || {})) {
      reportContent += `${key.replace(/_/g, ' ')}: ${value}\n`;
    }

    // Download as .txt
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

  // If no scanResult (user navigated directly)
  if (!scanResult) {
    return (
      <div className="card-body">
        <h2 className="card-title text-2xl font-bold">No Scan Data</h2>
        <p>No scan result found. Please upload and scan a file first.</p>
        <Link to="/">
          <button className="btn btn-dxprimary mt-4">
            <FileSearch className="h-5 w-5 mr-2" />
            Scan a File
          </button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="bg-base-500">
        <div className="mx-auto max-w-7xl">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <h2 className="card-title text-2xl font-bold">Scan Complete</h2>
              <ShieldAlert className="h-8 w-8 text-error" />
            </div>

            <div className="divider"></div>

            {/* Malicious Content Section */}
            <div className={`rounded-lg p-4 mb-4 ${scanResult.message === 'malware' ? 'bg-error/10' : 'bg-success/10'}`}>
              <div className="flex items-center gap-3 mb-2">
              {scanResult.message === 'malware' ? (
                  <AlertTriangle className="h-6 w-6 text-error" />
                ) : (
                  <CheckIcon className="h-6 w-6 text-success" />
                )}
                <h3 className={`text-lg font-bold ${scanResult.message === 'malware' ? 'text-error' : 'text-success'}`}>
                {scanResult.message === 'malware' ? (<p>Malicious Content Detected</p>)
                  : <p>No Malicious Content Detected</p>
                  }
                </h3>
              </div>
              <p className="pl-9">
                {scanResult.message === 'malware' ? (
                  <>
                    This file contains malicious code identified as{' '}
                    <span className="font-semibold">{scanResult.scan_details?.malware_class || 'Unknown'}</span>
                    {scanResult.scan_details?.malware_description && (
                      <> ({scanResult.scan_details.malware_description})</>
                    )}
                    {' '}with a{' '}
                    <span className="font-semibold">{scanResult.scan_details?.threat_level || 'Unknown'} threat level</span>.
                    Confidence: <span className="font-semibold">{scanResult.confidence}%</span>
                  </>
                ) : (
                  <>No malware detected.</>
                )}
              </p>
            </div>

            {/* Predicted Behavior Section */}
            {scanResult.message === 'malware' && (
              <div className="bg-warning/10 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-3 mb-2">
                  <FileWarning className="h-6 w-6 text-warning" />
                  <h3 className="text-lg font-bold text-warning">
                    Predicted Behavior
                  </h3>
                </div>
                <ul className="pl-9 list-disc ml-4 space-y-1">
                  {(scanResult.predicted_behaviour || []).map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommended Action Section */}
            {scanResult.message === 'malware' && (
              <div className="bg-info/10 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <ShieldAlert className="h-6 w-6 text-info" />
                  <h3 className="text-lg font-bold text-info">
                    Recommended Action
                  </h3>
                </div>
                <ul className="pl-9 list-disc ml-4 space-y-1">
                  {(scanResult.recommended_action || []).map((a, i) => (
                    <li key={i}>{a}</li>
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
                {renderTechnicalDetails(scanResult.technical_details || {})}
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
