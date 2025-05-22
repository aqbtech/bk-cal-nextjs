import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import GPAStats from '@/components/GPAStats';
import TargetGPAAnalysis from '@/components/TargetGPAAnalysis';
import GPATools from '@/components/GPATools';
import SuggestedCourses from '@/components/SuggestedCourses';
import AllCourses from '@/components/AllCourses';
import ImproveCourse from '@/components/ImproveCourse';
import ImprovedGPAResults from '@/components/ImprovedGPAResults';
import { Course, GPACalculator } from '@/lib/calculator';

export default function Results() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [coursesHtml, setCoursesHtml] = useState<string>('');
  const [totalCreditsCDDT, setTotalCreditsCDDT] = useState<number>(0);
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseFiltered, setCourseFiltered] = useState<Course[]>([]);
  const [gpa, setGPA] = useState<number | null>(null);
  const [requiredGPA, setRequiredGPA] = useState<number | null>(null);
  const [targetGPA, setTargetGPA] = useState<number>(3.5);
  const [suggestedCourses, setSuggestedCourses] = useState<Course[]>([]);
  const [showImproveModal, setShowImproveModal] = useState(false);
  const [improvedGPAData, setImprovedGPAData] = useState<{
    improvedCourses: Course[];
    newGPA: number;
    oldGPA: number;
    improvedCourses_detail: Course[];
  } | null>(null);

  useEffect(() => {
    // Get data from localStorage when component mounts
    const fetchData = () => {
      try {
        const coursesData = localStorage.getItem('coursesData') || '';
        const totalCreditsCDDT = parseInt(localStorage.getItem('totalCreditsCDDT') || '0');
        const format = localStorage.getItem('format') || 'html';

        setCoursesHtml(coursesData);
        setTotalCreditsCDDT(totalCreditsCDDT);

        if (!coursesData || totalCreditsCDDT === 0) {
          // No data found, redirect back to input page
          router.push('/');
          return;
        }
        
        // Process the data
        const parsedCourses = GPACalculator.parseCourseInput(coursesData, format);
        setCourses(parsedCourses);
        const filteredCourses = GPACalculator.filterCourses(parsedCourses);
        setCourseFiltered(filteredCourses);
        
        // Calculate GPA with special grade handling
        const calculatedGPA = GPACalculator.calculateGPA(parsedCourses);
        setGPA(calculatedGPA);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading course data:', error);
        alert('Error processing your data. Please try again.');
        router.push('/');
      }
    };

    fetchData();
  }, [router]);

  // Calculate required GPA to reach target
  const calculateRequiredGPA = (targetGPA: number) => {
    setTargetGPA(targetGPA);
    try {
      const required = GPACalculator.calculateRequiredGPA(courses, targetGPA, totalCreditsCDDT);
      setRequiredGPA(required);
      return required;
    } catch (error) {
      console.error('Error calculating required GPA:', error);
      return 0;
    }
  };

  // Suggest courses to improve
  const suggestCourses = (numSuggestions: number) => {
    try {
      const suggestions = GPACalculator.suggestCoursesToImprove(courses, numSuggestions);
      setSuggestedCourses(suggestions);
      return suggestions;
    } catch (error) {
      console.error('Error suggesting courses:', error);
      return [];
    }
  };
  
  // Handle the grade improvement calculation
  const handleImproveGrades = (improvements: {[key: string]: number}) => {
    try {
      const result = GPACalculator.improveGPA(courses, improvements);
      setImprovedGPAData(result);
      setShowImproveModal(false);
    } catch (error) {
      console.error('Error calculating improved GPA:', error);
    }
  };
  
  // Reset improved GPA data
  const resetImprovedGPA = () => {
    setImprovedGPAData(null);
  };
  
  // Toggle the improve modal
  const toggleImproveModal = () => {
    setShowImproveModal(!showImproveModal);
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Loading your results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="h4 mb-0">Your GPA Results</h2>
        <Link href="/" className="btn btn-outline-primary btn-sm">
          <i className="fas fa-arrow-left me-2"></i> Enter New Data
        </Link>
      </div>
      
      {courses.length > 0 && (
        <>
          <GPAStats 
            gpa={gpa || 0} 
            totalCreditsEarned={courseFiltered.reduce((sum, course) => sum + course.credits, 0)} 
            remainingCredits={totalCreditsCDDT - courseFiltered.reduce((sum, course) => sum + course.credits, 0)} 
          />
          
          {improvedGPAData && (
            <ImprovedGPAResults
              oldGPA={improvedGPAData.oldGPA}
              newGPA={improvedGPAData.newGPA}
              improvedCourses={improvedGPAData.improvedCourses_detail}
              onReset={resetImprovedGPA}
            />
          )}
          
          {requiredGPA !== null && (
            <TargetGPAAnalysis 
              requiredGPA={requiredGPA} 
              targetGPA={targetGPA} 
            />
          )}
          
          <GPATools 
            onCalculateGPA={() => setGPA(GPACalculator.calculateGPA(courseFiltered))}
            onCalculateRequiredGPA={calculateRequiredGPA}
            onSuggestCourses={suggestCourses}
            onImproveGrades={toggleImproveModal}
            coursesHtml={coursesHtml}
            totalCreditsCDDT={totalCreditsCDDT}
          />
          
          {suggestedCourses.length > 0 && (
            <SuggestedCourses courses={suggestedCourses} />
          )}
          
          <AllCourses courses={courses} />
          
          {/* Improve Course Modal */}
          <ImproveCourse
            courses={courses}
            onCalculate={handleImproveGrades}
            isOpen={showImproveModal}
            onClose={toggleImproveModal}
          />
        </>
      )}
    </div>
  );
}
