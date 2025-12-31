'use client';

import { useState } from 'react';
import { Course, GPACalculator } from '@/lib/calculator';

interface AddCourseProps {
  onAddCourse: (course: Course) => void;
}

export default function AddCourse({ onAddCourse }: AddCourseProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [credits, setCredits] = useState('');
  const [score, setScore] = useState('');

  const resetForm = () => {
    setCode('');
    setName('');
    setCredits('');
    setScore('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const numCredits = parseInt(credits);
    const numScore = parseFloat(score);
    
    if (!code || !name || isNaN(numCredits) || isNaN(numScore)) {
      return;
    }
    
    const letterGrade = GPACalculator.getLetterGrade(numScore);
    const gpa = GPACalculator.getGPA(letterGrade);
    
    const newCourse: Course = {
      code: code.toUpperCase(),
      name,
      credits: numCredits,
      score: numScore,
      letterGrade,
      gpa
    };
    
    onAddCourse(newCourse);
    resetForm();
    setIsAdding(false);
  };

  const handleCancel = () => {
    resetForm();
    setIsAdding(false);
  };

  if (!isAdding) {
    return (
      <div className="card fade-in">
        <div className="card-body text-center">
          <button
            className="btn btn-success"
            onClick={() => setIsAdding(true)}
          >
            <i className="fas fa-plus me-2"></i>
            Thêm Môn Dự Kiến
          </button>
        </div>
      </div>
    );
  }

  // Calculate preview values
  const previewScore = parseFloat(score);
  const previewLetter = !isNaN(previewScore) ? GPACalculator.getLetterGrade(previewScore) : '—';
  const previewGPA = !isNaN(previewScore) ? GPACalculator.getGPA(previewLetter) : '—';

  return (
    <div className="card fade-in">
      <div className="card-header">
        <i className="fas fa-plus-circle me-2"></i>
        Thêm Môn Dự Kiến
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label">Mã Môn</label>
              <input
                type="text"
                className="form-control"
                placeholder="VD: CO3001"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                maxLength={10}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Tên Môn</label>
              <input
                type="text"
                className="form-control"
                placeholder="VD: Công nghệ Phần mềm"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="col-md-2">
              <label className="form-label">Tín Chỉ</label>
              <input
                type="number"
                className="form-control"
                placeholder="3"
                value={credits}
                onChange={(e) => setCredits(e.target.value)}
                min="1"
                max="10"
                required
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Điểm Dự Kiến</label>
              <input
                type="number"
                className="form-control"
                placeholder="8.5"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                min="0"
                max="10"
                step="0.1"
                required
              />
            </div>
          </div>
          
          {/* Preview */}
          {score && !isNaN(previewScore) && (
            <div className="mt-3 p-3 bg-light rounded">
              <strong>Preview:</strong> {code || '???'} - {name || '???'} | 
              {' '}{credits || '?'} tín chỉ | 
              {' '}Điểm: {score} | 
              {' '}Letter: <span className="badge bg-primary">{previewLetter}</span> | 
              {' '}GPA: {previewGPA}
            </div>
          )}
          
          <div className="mt-3 d-flex gap-2">
            <button type="submit" className="btn btn-success">
              <i className="fas fa-check me-2"></i>
              Thêm
            </button>
            <button type="button" className="btn btn-secondary" onClick={handleCancel}>
              <i className="fas fa-times me-2"></i>
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
