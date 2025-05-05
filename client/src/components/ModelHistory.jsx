import {
  Upload,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart2,
  RefreshCw,
  Download,
} from 'lucide-react';

const ModelHistory = () => {
  const trainingHistory = [
    {
      id: 'model-v1.5',
      date: '2023-05-01',
      accuracy: 91.2,
      dataset: 'baseline-dataset-v1',
      epochs: 50,
      status: 'completed',
    },
    {
      id: 'model-v1.4',
      date: '2023-04-15',
      accuracy: 89.7,
      dataset: 'baseline-dataset-v1',
      epochs: 45,
      status: 'completed',
    },
    {
      id: 'model-v1.3',
      date: '2023-03-28',
      accuracy: 87.5,
      dataset: 'initial-dataset',
      epochs: 40,
      status: 'completed',
    },
    {
      id: 'model-v1.2',
      date: '2023-03-10',
      accuracy: 85.2,
      dataset: 'initial-dataset',
      epochs: 35,
      status: 'completed',
    },
    {
      id: 'model-v1.1',
      date: '2023-02-20',
      accuracy: 82.8,
      dataset: 'initial-dataset',
      epochs: 30,
      status: 'completed',
    },
    {
      id: 'model-v1.0',
      date: '2023-02-01',
      accuracy: 80.1,
      dataset: 'initial-dataset',
      epochs: 25,
      status: 'completed',
    },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return (
          <span className="badge badge-success gap-1 px-2">
            <CheckCircle size={12} />
            Completed
          </span>
        );
      case 'training':
        return (
          <span className="badge badge-warning gap-1">
            <RefreshCw size={12} className="animate-spin" />
            Training
          </span>
        );
      case 'failed':
        return (
          <span className="badge badge-error gap-1">
            <AlertTriangle size={12} />
            Failed
          </span>
        );
      case 'queued':
        return (
          <span className="badge badge-info gap-1">
            <Clock size={12} />
            Queued
          </span>
        );
      default:
        return <span className="badge">{status}</span>;
    }
  };
  return (
    <div>
      <div className="card shadow-sm lg:col-span-2">
        <div className="card-body ">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="stat bg-base-200 rounded-lg p-4">
              <div className="stat-title">Current Accuracy</div>
              <div className="stat-value text-primary">91.2%</div>
              <div className="stat-desc">↗︎ 1.5% from previous model</div>
            </div>
            <div className="stat bg-base-200 rounded-lg p-4">
              <div className="stat-title">False Positive Rate</div>
              <div className="stat-value text-secondary">5.3%</div>
              <div className="stat-desc">↘︎ 0.8% from previous model</div>
            </div>
            <div className="stat bg-base-200 rounded-lg p-4">
              <div className="stat-title">Training Time</div>
              <div className="stat-value">4.2h</div>
              <div className="stat-desc">Last training session</div>
            </div>
          </div>

          {/* Training History Table */}
          <div className="overflow-x-auto">
            <table className="table">
              <thead className="bg-base-200">
                <tr>
                  <th className="rounded-tl-lg rounded-bl-lg">Model ID</th>
                  <th>Date</th>
                  <th>Dataset</th>
                  <th>Epochs</th>
                  <th>Accuracy</th>
                  <th>Status</th>
                  <th className="rounded-tr-lg rounded-br-lg">Actions</th>
                </tr>
              </thead>
              <tbody>
                {trainingHistory.map((model, index) => (
                  <tr key={index}>
                    <td>{model.id}</td>
                    <td>{model.date}</td>
                    <td>{model.dataset}</td>
                    <td>{model.epochs}</td>
                    <td>
                      <div className="flex items-center">
                        <span className="font-medium">{model.accuracy}%</span>
                        {index > 0 && (
                          <span
                            className={`text-xs ml-2 ${
                              model.accuracy >
                              trainingHistory[index - 1].accuracy
                                ? 'text-success'
                                : 'text-error'
                            }`}
                          >
                            {model.accuracy >
                            trainingHistory[index - 1].accuracy
                              ? '↑'
                              : '↓'}
                            {Math.abs(
                              model.accuracy -
                                trainingHistory[index - 1].accuracy
                            ).toFixed(1)}
                            %
                          </span>
                        )}
                      </div>
                    </td>
                    <td>{getStatusBadge(model.status)}</td>
                    <td>
                      <div className="flex gap-1">
                        <button className="btn btn-ghost btn-sm gap-1 px-2">
                          <CheckCircle size={12} />
                          Active
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Performance Metrics */}
        </div>
      </div>
    </div>
  );
};

export default ModelHistory;
