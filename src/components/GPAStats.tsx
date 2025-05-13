'use client';

interface GPAStatsProps {
  gpa: number;
  totalCreditsEarned: number;
  remainingCredits: number;
}

export default function GPAStats({ gpa, totalCreditsEarned, remainingCredits }: GPAStatsProps) {
  // Format GPA to 2 decimal places
  const formattedGPA = gpa ? gpa.toFixed(3) : '—';
  
  return (
    <div className="row mb-4">
      <div className="col-md-4 mb-3 mb-md-0">
        <div className="card text-center fade-in" style={{ minHeight: '150px' }}>
          <div className="card-body d-flex flex-column justify-content-center">
            <h5 className="card-title">Current GPA</h5>
            <p className="card-text fs-2 fw-bold text-primary">{formattedGPA}</p>
          </div>
        </div>
      </div>
      
      <div className="col-md-4 mb-3 mb-md-0">
        <div className="card text-center fade-in" style={{ minHeight: '150px' }}>
          <div className="card-body d-flex flex-column justify-content-center">
            <h5 className="card-title">Credits Earned</h5>
            <p className="card-text fs-2 fw-bold text-success">{totalCreditsEarned || '—'}</p>
          </div>
        </div>
      </div>
      
      <div className="col-md-4">
        <div className="card text-center fade-in" style={{ minHeight: '150px' }}>
          <div className="card-body d-flex flex-column justify-content-center">
            <h5 className="card-title">Remaining Credits</h5>
            <p className="card-text fs-2 fw-bold text-warning">{remainingCredits || '—'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
