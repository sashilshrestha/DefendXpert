'use client';

import { useEffect, useRef } from 'react';
import { Calendar, CheckCircle, Info } from 'lucide-react';

export default function ModelAccuracy() {
  const accuracyChartRef = useRef(null);
  const detectionChartRef = useRef(null);

  // Mock data for the charts
  const weeklyData = {
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    accuracy: [92, 93, 95, 94, 96, 93, 94],
    falsePositives: [8, 7, 5, 6, 4, 7, 6],
  };

  const detectionData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    truePositives: [124, 136, 142, 128, 145, 132, 138],
    falsePositives: [12, 10, 8, 9, 6, 10, 9],
  };

  // Draw accuracy chart
  useEffect(() => {
    const canvas = accuracyChartRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw background grid
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;

    // Horizontal lines
    for (let i = 0; i <= 5; i++) {
      const y = (i * height) / 5;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw accuracy line
    ctx.strokeStyle = '#10b981'; // success color
    ctx.lineWidth = 3;
    ctx.beginPath();
    weeklyData.accuracy.forEach((value, index) => {
      const x = (index * width) / (weeklyData.accuracy.length - 1);
      // Scale to 80-100% for better visualization
      const y = height - ((value - 80) * height) / 20;
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // Draw false positives line
    ctx.strokeStyle = '#ef4444'; // error color
    ctx.lineWidth = 3;
    ctx.beginPath();
    weeklyData.falsePositives.forEach((value, index) => {
      const x = (index * width) / (weeklyData.falsePositives.length - 1);
      const y = height - (value * height) / 20;
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // Draw dots for accuracy
    weeklyData.accuracy.forEach((value, index) => {
      const x = (index * width) / (weeklyData.accuracy.length - 1);
      const y = height - ((value - 80) * height) / 20;
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw dots for false positives
    weeklyData.falsePositives.forEach((value, index) => {
      const x = (index * width) / (weeklyData.falsePositives.length - 1);
      const y = height - (value * height) / 20;
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
    });
  }, []);

  // Draw detection vs false positives chart
  useEffect(() => {
    const canvas = detectionChartRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Calculate bar width and spacing
    const barCount = detectionData.labels.length;
    const barWidth = width / (barCount * 3);
    const groupWidth = barWidth * 2 + 10;
    const maxValue = Math.max(...detectionData.truePositives) * 1.2;

    // Draw background grid
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;

    // Horizontal lines
    for (let i = 0; i <= 5; i++) {
      const y = height - (i * height) / 5;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw bars
    detectionData.labels.forEach((label, index) => {
      const x = index * groupWidth + (width - barCount * groupWidth) / 2;

      // True positives bar
      const tpHeight = (detectionData.truePositives[index] / maxValue) * height;
      ctx.fillStyle = '#3b82f6'; // primary color
      ctx.fillRect(x, height - tpHeight, barWidth, tpHeight);

      // False positives bar
      const fpHeight =
        (detectionData.falsePositives[index] / maxValue) * height;
      ctx.fillStyle = '#ef4444'; // error color
      ctx.fillRect(x + barWidth + 5, height - fpHeight, barWidth, fpHeight);
    });
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      {/* Accuracy Overview Card */}
      <div className="card dxprimary shadow-sm">
        <div className="card-body">
          <h3 className="card-title flex justify-between">
            <span>Model Accuracy</span>
            <div className="badge badge-success gap-1">
              <CheckCircle size={14} />
              Good
            </div>
          </h3>

          <div className="stats shadow mt-4">
            <div className="stat">
              <div className="stat-title">User Confirmed Accuracy</div>
              <div className="stat-value text-success">94%</div>
              <div className="stat-desc">↗︎ 2% from last week</div>
            </div>

            <div className="stat">
              <div className="stat-title">False Positives</div>
              <div className="stat-value text-error">6%</div>
              <div className="stat-desc">↘︎ 2% from last week</div>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold">Weekly Performance</h4>
              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-sm btn-ghost"
                >
                  <Calendar size={16} />
                  <span className="ml-1">This Week</span>
                </div>
                <ul
                  tabIndex={0}
                  className="dropdown-content z-[1] menu p-2 shadow dxprimary rounded-box w-52"
                >
                  <li>
                    <a>This Week</a>
                  </li>
                  <li>
                    <a>Last Week</a>
                  </li>
                  <li>
                    <a>This Month</a>
                  </li>
                  <li>
                    <a>Last Month</a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="alert alert-info mb-4">
              <Info size={16} />
              <span>
                Model accuracy is calculated based on user feedback and
                validation.
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="table table-xs">
                <thead>
                  <tr>
                    <th>Day</th>
                    <th>Scans</th>
                    <th>Accuracy</th>
                    <th>False Positives</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Monday</td>
                    <td>136</td>
                    <td>92%</td>
                    <td>8%</td>
                  </tr>
                  <tr>
                    <td>Tuesday</td>
                    <td>146</td>
                    <td>93%</td>
                    <td>7%</td>
                  </tr>
                  <tr>
                    <td>Wednesday</td>
                    <td>150</td>
                    <td>95%</td>
                    <td>5%</td>
                  </tr>
                  <tr>
                    <td>Thursday</td>
                    <td>137</td>
                    <td>94%</td>
                    <td>6%</td>
                  </tr>
                  <tr>
                    <td>Friday</td>
                    <td>151</td>
                    <td>96%</td>
                    <td>4%</td>
                  </tr>
                  <tr>
                    <td>Saturday</td>
                    <td>142</td>
                    <td>93%</td>
                    <td>7%</td>
                  </tr>
                  <tr>
                    <td>Sunday</td>
                    <td>147</td>
                    <td>94%</td>
                    <td>6%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Accuracy Chart */}
      <div className="card dxprimary shadow-sm lg:col-span-2">
        <div className="card-body">
          <h3 className="card-title">Accuracy Trends</h3>

          <div className="flex items-center mb-4">
            <div className="flex items-center mr-4">
              <span className="inline-block w-3 h-3 bg-success rounded-full mr-2"></span>
              <span className="text-sm text-base-content/70">Accuracy %</span>
            </div>
            <div className="flex items-center">
              <span className="inline-block w-3 h-3 bg-error rounded-full mr-2"></span>
              <span className="text-sm text-base-content/70">
                False Positives %
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <canvas
              ref={accuracyChartRef}
              width="800"
              height="300"
              className="w-full h-full"
            ></canvas>
          </div>

          <div className="grid grid-cols-7 gap-2 mt-2 text-xs text-center text-base-content/70">
            {weeklyData.days.map((day, index) => (
              <div key={index}>{day}</div>
            ))}
          </div>

          <div className="mt-6">
            <h4 className="font-semibold mb-4">Detection vs False Positives</h4>
            <div className="flex items-center mb-4">
              <div className="flex items-center mr-4">
                <span className="inline-block w-3 h-3 bg-primary rounded-full mr-2"></span>
                <span className="text-sm text-base-content/70">
                  True Detections
                </span>
              </div>
              <div className="flex items-center">
                <span className="inline-block w-3 h-3 bg-error rounded-full mr-2"></span>
                <span className="text-sm text-base-content/70">
                  False Positives
                </span>
              </div>
            </div>

            <div className="h-48 w-full">
              <canvas
                ref={detectionChartRef}
                width="800"
                height="200"
                className="w-full h-full"
              ></canvas>
            </div>

            <div className="grid grid-cols-7 gap-2 mt-2 text-xs text-center text-base-content/70">
              {detectionData.labels.map((day, index) => (
                <div key={index}>{day}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
