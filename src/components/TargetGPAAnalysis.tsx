'use client';

interface TargetGPAAnalysisProps {
  requiredGPA: number;
  targetGPA: number;
}

export default function TargetGPAAnalysis({ requiredGPA, targetGPA }: TargetGPAAnalysisProps) {
  // Format GPA to 3 decimal places
  const formattedRequiredGPA = requiredGPA.toFixed(3);
  const formattedTargetGPA = targetGPA.toFixed(3);
  
  // Determine alert type based on required GPA
  const getAlertType = () => {
    if (requiredGPA > 4.0) return 'danger';
    if (requiredGPA > 3.5) return 'warning';
    return 'success';
  };
  
  const alertType = getAlertType();
  
  return (
    <div className={`alert alert-${alertType} d-flex align-items-center fade-in mb-4`}>
      <div className="d-flex">
        <div className="me-3 fs-4">
          {alertType === 'success' && <i className="fas fa-check-circle text-success"></i>}
          {alertType === 'warning' && <i className="fas fa-exclamation-triangle text-warning"></i>}
          {alertType === 'danger' && <i className="fas fa-times-circle text-danger"></i>}
        </div>
        <div>
          <h4 className="alert-heading">Target GPA Analysis</h4>
          <p className="mb-0">
            To achieve your target GPA of <strong>{formattedTargetGPA}</strong>, you need to maintain a GPA of <strong>{formattedRequiredGPA}</strong> for your remaining courses.
            {requiredGPA > 4.0 && (
              <span className="d-block mt-2 fw-bold">
                This target GPA is not achievable with the current number of credits.
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
