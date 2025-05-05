import { useState } from 'react';

import ModelHistory from '../components/ModelHistory';
import ModelTrain from '../components/ModelTrain';

export default function ModelTraining() {
  const [activeTab, setActiveTab] = useState('train');

  // Mock training history data

  return (
    <div className="">
      <div className="container mx-auto p-4">
        {/* Enhanced Toggle Bar */}
        <div className="flex justify-center mb-8">
          <div className=" p-1.5 rounded-full shadow-lg flex relative ">
            {/* Background Slider */}
            <div
              className="absolute h-full top-0 transition-all duration-300 ease-in-out rounded-full bg-primary"
              style={{
                width: '50%',
                left: activeTab === 'train' ? '0%' : '50%',
                opacity: 0.2,
              }}
            />

            {/* Toggle Buttons */}
            <button
              onClick={() => setActiveTab('train')}
              className={`relative px-6 py-2 rounded-full transition-all duration-300  cursor-pointer ${
                activeTab === 'train'
                  ? 'text-primary-content font-medium'
                  : 'text-base-content hover:text-primary'
              }`}
            >
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                    clipRule="evenodd"
                  />
                </svg>
                Train Model
              </div>
            </button>

            <button
              onClick={() => setActiveTab('list')}
              className={`relative px-6 py-2 rounded-full transition-all duration-300  cursor-pointer ${
                activeTab === 'list'
                  ? 'text-primary-content font-medium '
                  : 'text-base-content hover:text-primary '
              }`}
            >
              <div className="flex items-center gap-2 ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                </svg>
                List of Models
              </div>
            </button>
          </div>
        </div>

        {/* Content Area with Transition */}
        <div className="main-bhado">
          <div className="relative  w-full h-full">
            <div
              className="transition-all duration-500 ease-in-out absolute w-full"
              style={{
                opacity: activeTab === 'train' ? 1 : 0,
              }}
            >
              {activeTab === 'train' && <ModelTrain />}
            </div>

            <div
              className="transition-all duration-500 ease-in-out absolute w-full"
              style={{
                opacity: activeTab === 'list' ? 1 : 0,
              }}
            >
              {activeTab === 'list' && <ModelHistory />}
            </div>
          </div>
        </div>
      </div>

      {/* Training History Card */}
    </div>
  );
}
