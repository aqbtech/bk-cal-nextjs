'use client';
// a modal for user to input course data, which they want to improve
// and this data will be used for recalculating the GPA


import { useState } from 'react';
import { Course, GPACalculator } from '@/lib/calculator';

interface ImproveCourseProps {
  courses: Course[];
  onCalculate: (improvements: {[key: string]: number}) => void;
  isOpen: boolean;
  onClose: () => void;
}

interface CourseImprovement {
  code: string;
  newScore: string;
}

export default function ImproveCourse({ courses, onCalculate, isOpen, onClose }: ImproveCourseProps) {
  const [improvements, setImprovements] = useState<CourseImprovement[]>([{ code: '', newScore: '' }]);
  const [error, setError] = useState<string | null>(null);

  // Add a new empty improvement field
  const addImprovement = () => {
    setImprovements([...improvements, { code: '', newScore: '' }]);
  };

  // Remove an improvement field
  const removeImprovement = (index: number) => {
    if (improvements.length > 1) {
      const newImprovements = [...improvements];
      newImprovements.splice(index, 1);
      setImprovements(newImprovements);
    }
  };

  // Update improvement data
  const handleChange = (index: number, field: 'code' | 'newScore', value: string) => {
    const newImprovements = [...improvements];
    newImprovements[index][field] = value;
    setImprovements(newImprovements);
  };

  // Submit improvements
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate the inputs
    const improvementMap: {[key: string]: number} = {};
    
    for (const item of improvements) {
      if (!item.code.trim() || !item.newScore.trim()) continue;
      
      // Check if course exists
      const courseExists = courses.some(course => course.code === item.code);
      if (!courseExists) {
        setError(`Course code ${item.code} doesn't exist in your course list.`);
        return;
      }
      
      // Validate score is a number between 0-10
      const score = parseFloat(item.newScore);
      if (isNaN(score) || score < 0 || score > 10) {
        setError(`Score for ${item.code} must be a number between 0 and 10.`);
        return;
      }
      
      // Check for duplicate course codes
      if (improvementMap[item.code] !== undefined) {
        setError(`Duplicate course code: ${item.code}`);
        return;
      }
      
      improvementMap[item.code] = score;
    }
    
    // Make sure we have at least one valid improvement
    if (Object.keys(improvementMap).length === 0) {
      setError('Please enter at least one valid course improvement.');
      return;
    }
    
    // Call parent component with improvement data
    onCalculate(improvementMap);
  };

  if (!isOpen) return null;

  return (
    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">
              <i className="fas fa-chart-line me-2"></i>
              Improve Your Grades
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose} aria-label="Close"></button>
          </div>
          
          <div className="modal-body">
            <p className="text-muted mb-3">
              Enter course codes and hypothetical improved scores to see how they would affect your GPA.
            </p>
            
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              {improvements.map((improvement, index) => (
                <div className="row mb-2" key={index}>
                  <div className="col-6">
                    <select
                      className="form-select"
                      value={improvement.code}
                      onChange={(e) => handleChange(index, 'code', e.target.value)}
                      required
                    >
                      <option value="">Select course code</option>
                      {courses.map((course) => (
                        <option key={course.code} value={course.code}>
                          {course.code} - {course.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-4">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="New score"
                      min="0"
                      max="10"
                      step="0.1"
                      value={improvement.newScore}
                      onChange={(e) => handleChange(index, 'newScore', e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-2">
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => removeImprovement(index)}
                      disabled={improvements.length <= 1}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                </div>
              ))}
              
              <div className="d-flex justify-content-between mt-3">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-primary"
                  onClick={addImprovement}
                >
                  <i className="fas fa-plus me-1"></i> Add Course
                </button>
                <button type="submit" className="btn btn-primary">
                  <i className="fas fa-calculator me-1"></i> Calculate New GPA
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}