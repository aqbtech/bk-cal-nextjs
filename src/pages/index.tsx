import { useState } from 'react';
import { useRouter } from 'next/router';
import InputForm from '@/components/InputForm';

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Handle form submission
  const handleSubmit = (coursesData: string, totalCreditsCDDT: number, format: string) => {
    setIsLoading(true);
    
    try {
      // Store the data in localStorage to retrieve it on the results page
      localStorage.setItem('coursesData', coursesData);
      localStorage.setItem('totalCreditsCDDT', totalCreditsCDDT.toString());
      localStorage.setItem('format', format);
      
      // Navigate to the results page
      router.push('/results');
    } catch (error) {
      console.error('Error processing course data:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="card p-4 shadow-sm">
        <h2 className="h4 mb-3">Enter Your Course Data</h2>
        <p className="text-muted mb-4">
          Paste your course data from the official transcript portal to calculate your GPA and analyze your academic performance.
        </p>
        <InputForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
      
      <div className="card p-4 shadow-sm">
        <h3 className="h5 mb-3">How to Use This Tool</h3>
        <ol className="mb-0">
          <li className="mb-2">Log in to your student portal</li>
          <li className="mb-2">Navigate to the transcript section</li>
          <li className="mb-2">Copy all your course data (including grades and credits)</li>
          <li className="mb-2">Paste it into the form above</li>
          <li className="mb-2">Enter your total required credits for graduation</li>
          <li>Click "Calculate" to see your results</li>
        </ol>
      </div>
    </div>
  );
}
