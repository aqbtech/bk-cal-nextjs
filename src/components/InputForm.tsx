'use client';

import { useState } from 'react';

interface InputFormProps {
  onSubmit: (coursesData: string, totalCreditsCDDT: number, format: string) => void;
}

// Input format options
const INPUT_FORMATS = [
  { id: 'html', label: 'HTML (BK Portal)', description: 'Copy-paste HTML from BK Portal' },
  // Future formats can be added here
  // { id: 'json', label: 'JSON Format', description: 'Paste JSON data' },
  // { id: 'csv', label: 'CSV Format', description: 'Paste CSV data' },
];

export default function InputForm({ onSubmit }: InputFormProps) {
  const [coursesData, setCoursesData] = useState<string>('');
  const [totalCreditsCDDT, setTotalCreditsCDDT] = useState<string>('');
  const [inputFormat, setInputFormat] = useState<string>('html');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(coursesData, parseInt(totalCreditsCDDT) || 0, inputFormat);
  };

  return (
    <div className="card fade-in">
      <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
        <div>
          <i className="fas fa-paste me-2"></i>
          Paste Course Data
        </div>
        <div>
          <select 
            className="form-select form-select-sm" 
            value={inputFormat}
            onChange={(e) => setInputFormat(e.target.value)}
            style={{ width: 'auto' }}
          >
            {INPUT_FORMATS.map(format => (
              <option key={format.id} value={format.id}>{format.label}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="courses_data" className="form-label">
              {inputFormat === 'html' ? 'Paste HTML from BK site containing course data:' : 'Paste course data:'}
              <small className="text-muted ms-2">
                {INPUT_FORMATS.find(f => f.id === inputFormat)?.description}
              </small>
            </label>
            <textarea
              id="courses_data"
              className="form-control"
              rows={6}
              value={coursesData}
              onChange={(e) => setCoursesData(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="mb-3">
            <label htmlFor="total_credits_cddt" className="form-label">
              Total Credits CDDT:
            </label>
            <input
              type="number"
              id="total_credits_cddt"
              className="form-control"
              value={totalCreditsCDDT}
              onChange={(e) => setTotalCreditsCDDT(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100 d-flex align-items-center justify-content-center"
          >
            <i className="fas fa-calculator me-2"></i>
            Calculate
          </button>
        </form>
      </div>
    </div>
  );
}
