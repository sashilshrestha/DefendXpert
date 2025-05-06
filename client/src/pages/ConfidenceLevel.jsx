'use client';

import { useState } from 'react';
import {
  AlertTriangle,
  Shield,
  ShieldAlert,
  Bug,
  WormIcon as Virus,
} from 'lucide-react';

const malwareData = [
  {
    confidence: 20,
    description: 'Trojan Downloader',
    id: 1,
    malware_class: 'Ramnit',
    threat_level: 'high',
  },
  {
    confidence: 50,
    description: 'Adware',
    id: 2,
    malware_class: 'Lollipop',
    threat_level: 'intermediate',
  },
  {
    confidence: 0,
    description: 'Botnet Malware',
    id: 3,
    malware_class: 'Kelihos_ver3',
    threat_level: 'high',
  },
  {
    confidence: 90,
    description: 'Spyware',
    id: 4,
    malware_class: 'Vundo',
    threat_level: 'intermediate',
  },
  {
    confidence: 0,
    description: 'Worm',
    id: 5,
    malware_class: 'Simda',
    threat_level: 'extreme',
  },
  {
    confidence: 0,
    description: 'Trojan Dropper',
    id: 6,
    malware_class: 'Tracur',
    threat_level: 'intermediate',
  },
  {
    confidence: 0,
    description: 'Botnet Variant',
    id: 7,
    malware_class: 'Kelihos_ver1',
    threat_level: 'high',
  },
  {
    confidence: 0,
    description: 'Obfuscation Tool',
    id: 8,
    malware_class: 'Obfuscator.ACY',
    threat_level: 'low',
  },
  {
    confidence: 0,
    description: 'Backdoor Trojan',
    id: 9,
    malware_class: 'Gatak',
    threat_level: 'extreme',
  },
];

export default function ConfidenceLevel() {
  const [selectedMalware, setSelectedMalware] = useState(malwareData[0]);
  const [confidenceLevels, setConfidenceLevels] = useState(
    malwareData.reduce((acc, item) => {
      acc[item.id] = item.confidence;
      return acc;
    }, {})
  );

  const handleMalwareChange = (e) => {
    const selected = malwareData.find(
      (m) => m.id === Number.parseInt(e.target.value)
    );
    setSelectedMalware(selected);
  };

  const handleConfidenceChange = (value) => {
    setConfidenceLevels({
      ...confidenceLevels,
      [selectedMalware.id]: value,
    });
  };

  const getThreatIcon = (threatLevel) => {
    switch (threatLevel) {
      case 'extreme':
        return <ShieldAlert className="w-6 h-6 text-error" />;
      case 'high':
        return <AlertTriangle className="w-6 h-6 text-warning" />;
      case 'intermediate':
        return <Bug className="w-6 h-6 text-warning-content" />;
      case 'low':
        return <Shield className="w-6 h-6 text-info" />;
      default:
        return <Virus className="w-6 h-6 text-secondary" />;
    }
  };

  const getThreatColor = (threatLevel) => {
    switch (threatLevel) {
      case 'extreme':
        return 'bg-error text-error-content';
      case 'high':
        return 'bg-warning text-warning-content';
      case 'intermediate':
        return 'bg-amber-400 text-amber-900';
      case 'low':
        return 'bg-info text-info-content';
      default:
        return 'bg-secondary text-secondary-content';
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <h2 className="card-title mb-4">Malware Confidence Levels</h2>

        <div className="div">
          <div className="grid grid-cols-12 gap-8">
            <div className=" col-span-6 flex flex-col">
              <div className="form-control w-full max-w-xs mb-6">
                <label className="label">
                  <span className="label-text">Select Malware Class</span>
                </label>
                <select
                  className="select  bg-blue-100 select-bordered w-full"
                  value={selectedMalware.id}
                  onChange={handleMalwareChange}
                >
                  {malwareData.map((malware) => (
                    <option key={malware.id} value={malware.id}>
                      {malware.malware_class} - {malware.description}
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-gray-100 p-4 rounded-lg mb-6">
                <div className="flex items-center gap-3 mb-2">
                  {getThreatIcon(selectedMalware.threat_level)}
                  <div>
                    <h3 className="font-bold">
                      {selectedMalware.malware_class}
                    </h3>
                    <div className="text-sm opacity-80">
                      {selectedMalware.description}
                    </div>
                  </div>
                </div>

                {/* <div className="badge badge-lg my-2 ${getThreatColor(selectedMalware.threat_level)}">
            Threat Level: {selectedMalware.threat_level}
          </div> */}

                <div className="mt-4 flex flex-col">
                  <label className="label">
                    <span className="label-text">
                      Confidence Level: {confidenceLevels[selectedMalware.id]}%
                    </span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={confidenceLevels[selectedMalware.id]}
                    onChange={(e) =>
                      handleConfidenceChange(Number.parseInt(e.target.value))
                    }
                    className="range-primary w-full range"
                  />
                  <div className="w-full flex justify-between text-xs px-2 mt-1">
                    <span>0%</span>
                    <span>25%</span>
                    <span>50%</span>
                    <span>75%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-6 overflow-x-auto">
              <table className="table w-full">
                <thead className='bg-base-200 border-rounded-tr-lg'>
                  <tr>
                    <th>ID</th>
                    <th>Malware Class</th>
                    <th>Threat Level</th>
                    <th>Confidence</th>
                  </tr>
                </thead>
                <tbody>
                  {malwareData.map((malware) => (
                    <tr
                      key={malware.id}
                      className={
                        selectedMalware.id === malware.id ? 'bg-blue-200' : ''
                      }
                    >
                      <td>{malware.id}</td>
                      <td>{malware.malware_class}</td>
                      <td>
                        <div
                          className={`badge ${getThreatColor(
                            malware.threat_level
                          )}`}
                        >
                          {malware.threat_level}
                        </div>
                      </td>
                      <td>
                        <progress
                          className="progress progress-primary w-20"
                          value={confidenceLevels[malware.id]}
                          max="100"
                        ></progress>
                        <span className="ml-2">
                          {confidenceLevels[malware.id]}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
