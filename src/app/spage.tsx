// 'use client';

// import { useState } from 'react';
// import InputForm from '@/components/InputForm';
// import GPAStats from '@/components/GPAStats';
// import TargetGPAAnalysis from '@/components/TargetGPAAnalysis';
// import GPATools from '@/components/GPATools';
// import SuggestedCourses from '@/components/SuggestedCourses';
// import AllCourses from '@/components/AllCourses';
// import { Course, GPACalculator } from '@/lib/calculator';

// export default function Home() {
//   const [coursesHtml, setCoursesHtml] = useState<string>('');
//   const [totalCreditsCDDT, setTotalCreditsCDDT] = useState<number>(0);
//   const [courses, setCourses] = useState<Course[]>([]);
//   const [gpa, setGPA] = useState<number | null>(null);
//   const [requiredGPA, setRequiredGPA] = useState<number | null>(null);
//   const [targetGPA, setTargetGPA] = useState<number>(3.5);
//   const [suggestedCourses, setSuggestedCourses] = useState<Course[]>([]);

//   // Handle form submission
//   const handleSubmit = (coursesData: string, totalCreditsCDDT: number, format: string) => {
//     setCoursesHtml(coursesData); // Keep variable name for backward compatibility
//     setTotalCreditsCDDT(totalCreditsCDDT);
    
//     try {
//       let parsedCourses = GPACalculator.parseCourseInput(coursesData, format);
      
//       // // Handle different input formats
//       // switch(format) {
//       //   case 'html':
//       //     // Use the existing HTML parser
          
//       //     break;
//       //   case 'plainstring':
//       //     // Use the existing HTML parser
//       //     parsedCourses = GPACalculator.parseCourseInput(coursesData);
//       //     break;
//       //   // Add future format handlers here
//       //   // case 'json':
//       //   //   parsedCourses = handleJsonFormat(coursesData);
//       //   //   break;
//       //   // case 'csv':
//       //   //   parsedCourses = handleCsvFormat(coursesData);
//       //   //   break;
//       //   default:
//       //     // Default to HTML format
//       //     parsedCourses = GPACalculator.parseCourseInput(coursesData);
//       // }
      
//       setCourses(parsedCourses);
      
//       // Calculate GPA with special grade handling
//       const calculatedGPA = GPACalculator.calculateGPA(parsedCourses);
//       setGPA(calculatedGPA);
      
//       // Reset other metrics
//       setRequiredGPA(null);
//       setSuggestedCourses([]);
//     } catch (error) {
//       console.error('Error processing course data:', error);
//       // You could set an error state here if needed
//     }
//   };

//   // Calculate required GPA to reach target
//   const calculateRequiredGPA = (targetGPA: number) => {
//     setTargetGPA(targetGPA);
//     try {
//       // Use the updated logic that excludes certain special grades
//       // and handles RT with passing grade correctly
//       const required = GPACalculator.calculateRequiredGPA(courses, targetGPA, totalCreditsCDDT);
//       setRequiredGPA(required);
//       return required;
//     } catch (error) {
//       console.error('Error calculating required GPA:', error);
//       return 0;
//     }
//   };

//   // Suggest courses to improve
//   const suggestCourses = (numSuggestions: number) => {
//     try {
//       // Use the updated suggestCoursesToImprove method that properly filters courses
//       // based on the special grade handling rules
//       const suggestions = GPACalculator.suggestCoursesToImprove(courses, numSuggestions);
//       setSuggestedCourses(suggestions);
//       return suggestions;
//     } catch (error) {
//       console.error('Error suggesting courses:', error);
//       return [];
//     }
//   };

//   return (
//     <div className="space-y-6">
//       <InputForm onSubmit={handleSubmit} />
      
//       {courses.length > 0 && (
//         <>
//           <GPAStats 
//             gpa={gpa || 0} 
//             totalCreditsEarned={courses.reduce((sum, course) => sum + course.credits, 0)} 
//             remainingCredits={totalCreditsCDDT - courses.reduce((sum, course) => sum + course.credits, 0)} 
//           />
          
//           {requiredGPA !== null && (
//             <TargetGPAAnalysis 
//               requiredGPA={requiredGPA} 
//               targetGPA={targetGPA} 
//             />
//           )}
          
//           <GPATools 
//             onCalculateGPA={() => setGPA(GPACalculator.calculateGPA(courses))}
//             onCalculateRequiredGPA={calculateRequiredGPA}
//             onSuggestCourses={suggestCourses}
//             coursesHtml={coursesHtml}
//             totalCreditsCDDT={totalCreditsCDDT}
//           />
          
//           {suggestedCourses.length > 0 && (
//             <SuggestedCourses courses={suggestedCourses} />
//           )}
          
//           <AllCourses courses={courses} />
//         </>
//       )}
//     </div>
//   );
// }
