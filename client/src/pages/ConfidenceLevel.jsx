'use client';

import { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Shield,
  ShieldAlert,
  Bug,
  WormIcon as Virus,
} from 'lucide-react';
import { useLoading } from '../hooks/useLoading';
import { useToast } from '../hooks/useToast';
import Loader from '../components/Loader';
import Toast from '../components/Toast';

export default function ConfidenceLevel() {
  const { loading, startLoading, stopLoading } = useLoading();
  const { toast, showToast } = useToast();
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const [malwareData, setMalwareData] = useState([]);
  const [selectedMalware, setSelectedMalware] = useState('1');
  const [confidenceLevels, setConfidenceLevels] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('token');
    startLoading();
    fetch('http://localhost:5000/admin/confidence', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setMalwareData(data.confidence);
        setSelectedMalware(data.confidence[0]);
        const levels = data.confidence.reduce((acc, item) => {
          acc[item.id] = item.confidence;
          return acc;
        }, {});
        setConfidenceLevels(levels);
        stopLoading();
      })
      .catch((err) => {
        console.error('Failed to fetch malware data:', err);
        stopLoading();
      });
  }, []);

  const handleMalwareChange = (e) => {
    const selected = malwareData.find(
      (m) => m.id === Number.parseInt(e.target.value)
    );
    setSelectedMalware(selected);
  };

  const handleConfidenceChange = (value) => {
    const id = selectedMalware.id;

    // Update UI immediately
    setConfidenceLevels((prev) => ({
      ...prev,
      [id]: value,
    }));

    // Debounce API call
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    const timeout = setTimeout(() => {
      updateConfidenceToAPI(id, value);
    }, 500); // delay in milliseconds

    setDebounceTimeout(timeout);
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

  const updateConfidenceToAPI = (id, value) => {
    const token = localStorage.getItem('token');
    startLoading();
    fetch('http://localhost:5000/admin/update-confidence', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ [id]: value }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to update confidence');
        }
        return res.json();
      })
      .then((data) => {
        console.log('Confidence updated successfully:', data);
        stopLoading();
        showToast('Confidence updated sucesfully', 'success');
      })
      .catch((err) => {
        console.error('Error updating confidence:', err);
      });
  };

  // if (!selectedMalware)
  //   return <div className="p-4">No malware data found.</div>;

  return (
    <div className="card">
      {loading && <Loader />}
      <Toast toast={toast} />
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
                  className="select bg-blue-100 select-bordered w-full"
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
                <thead className="bg-base-200 border-rounded-tr-lg">
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
