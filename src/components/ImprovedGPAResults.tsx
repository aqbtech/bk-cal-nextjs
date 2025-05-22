'use client';

import { Course } from '@/lib/calculator';

interface ImprovedGPAResultsProps {
  oldGPA: number;
  newGPA: number;
  improvedCourses: Course[];
  onReset: () => void;
}

export default function ImprovedGPAResults({ 
  oldGPA, 
  newGPA, 
  improvedCourses, 
  onReset 
}: ImprovedGPAResultsProps) {
  const gpaImprovement = newGPA - oldGPA;
  const improvementPercentage = oldGPA > 0 ? (gpaImprovement / oldGPA) * 100 : 0;

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
        <div>
          <i className="fas fa-chart-line me-2"></i>
          Improved GPA Simulation
        </div>
        <button onClick={onReset} className="btn btn-sm btn-outline-light">
          <i className="fas fa-redo me-1"></i> Reset
        </button>
      </div>
      
      <div className="card-body">
        <div className="row mb-4">
          <div className="col-md-4">
            <div className="text-center p-3 border rounded mb-3 mb-md-0">
              <div className="text-muted mb-1">Current GPA</div>
              <div className="h3">{oldGPA.toFixed(2)}</div>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="text-center p-3 border rounded mb-3 mb-md-0 bg-light">
              <div className="text-muted mb-1">Improved GPA</div>
              <div className="h3 text-success">{newGPA.toFixed(2)}</div>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="text-center p-3 border rounded bg-light">
              <div className="text-muted mb-1">Improvement</div>
              <div className="h3 text-success">
                +{gpaImprovement.toFixed(2)} 
                <small className="text-muted">({improvementPercentage.toFixed(1)}%)</small>
              </div>
            </div>
          </div>
        </div>
        
        <h5 className="mb-3">Improved Courses</h5>
        <div className="table-responsive">
          <table className="table table-striped table-bordered">
            <thead>
              <tr className="table-secondary">
                <th>Course Code</th>
                <th>Course Name</th>
                <th>Credits</th>
                <th>Score Change</th>
                <th>Grade Change</th>
              </tr>
            </thead>
            <tbody>
              {improvedCourses.map(course => (
                <tr key={course.code}>
                  <td>{course.code}</td>
                  <td>{course.name}</td>
                  <td>{course.credits}</td>
                  <td>{course.score}</td>
                  <td>{course.letterGrade}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="alert alert-info mt-3">
          <i className="fas fa-info-circle me-2"></i>
          This is a simulation. Your actual GPA will only change when you officially retake and improve your grades for these courses.
        </div>
      </div>
    </div>
  );
}
