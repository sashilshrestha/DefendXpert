'use client';

import { useState, useEffect } from 'react';

export default function StepsProgress({
  currentStep = 0,
  steps = ['Upload', 'Scanning', 'Analyzing', 'Complete'],
}) {
  const [activeStep, setActiveStep] = useState(currentStep);

  // Update active step when currentStep prop changes
  useEffect(() => {
    setActiveStep(currentStep);
  }, [currentStep]);

  return (
    <div className="w-full px-2 py-4">
      <ul className="steps w-full">
        {steps.map((step, index) => (
          <li
            key={index}
            className={`step ${index <= activeStep ? 'step-info' : ''}`}
            data-content={index <= activeStep ? '✓' : index + 1}
          >
            <span
              className={`text-sm md:text-base ${
                index === activeStep ? 'font-medium' : ''
              }`}
            >
              {step}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
