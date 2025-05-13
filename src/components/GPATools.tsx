'use client';

import { useState } from 'react';

interface GPAToolsProps {
  onCalculateGPA: () => void;
  onCalculateRequiredGPA: (targetGPA: number) => number;
  onSuggestCourses: (numSuggestions: number) => void;
  coursesHtml: string;
  totalCreditsCDDT: number;
}

export default function GPATools({
  onCalculateGPA,
  onCalculateRequiredGPA,
  onSuggestCourses,
  coursesHtml,
  totalCreditsCDDT
}: GPAToolsProps) {
  const [targetGPA, setTargetGPA] = useState<string>('3.5');
  const [numSuggestions, setNumSuggestions] = useState<string>('5');

  const handleCalculateRequiredGPA = (e: React.FormEvent) => {
    e.preventDefault();
    onCalculateRequiredGPA(parseFloat(targetGPA) || 3.5);
  };

  const handleSuggestCourses = (e: React.FormEvent) => {
    e.preventDefault();
    onSuggestCourses(parseInt(numSuggestions) || 5);
  };

  return (
    <div className="card fade-in mb-4">
      <div className="card-header bg-primary text-white">
        <i className="fas fa-tools me-2"></i>
        GPA Tools
      </div>
      <div className="card-body">
        <div className="row g-3">
          <div className="col-md-4">
            <button
              onClick={onCalculateGPA}
              className="btn btn-primary w-100"
            >
              <i className="fas fa-calculator me-2"></i>
              Calculate Current GPA
            </button>
          </div>
          
          <div className="col-md-4">
            <form onSubmit={handleCalculateRequiredGPA}>
              <div className="mb-2">
                <label htmlFor="target_gpa" className="form-label">
                  Target GPA
                </label>
                <input
                  type="number"
                  id="target_gpa"
                  step="0.001"
                  className="form-control"
                  value={targetGPA}
                  onChange={(e) => setTargetGPA(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="btn btn-outline-primary w-100"
              >
                <i className="fas fa-bullseye me-2"></i>
                Calculate Required GPA
              </button>
            </form>
          </div>
          
          <div className="col-md-4">
            <form onSubmit={handleSuggestCourses}>
              <div className="mb-2">
                <label htmlFor="num_suggestions" className="form-label">
                  Number of Suggestions
                </label>
                <input
                  type="number"
                  id="num_suggestions"
                  className="form-control"
                  value={numSuggestions}
                  onChange={(e) => setNumSuggestions(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="btn btn-outline-primary w-100"
              >
                <i className="fas fa-lightbulb me-2"></i>
                Suggest Courses to Improve
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
