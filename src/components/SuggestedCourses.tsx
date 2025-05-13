'use client';

import { Course } from '@/lib/calculator';

interface SuggestedCoursesProps {
  courses: Course[];
}

export default function SuggestedCourses({ courses }: SuggestedCoursesProps) {
  if (!courses || courses.length === 0) {
    return null;
  }

  return (
    <div className="card fade-in mb-4">
      <div className="card-header bg-primary text-white">
        <i className="fas fa-lightbulb me-2"></i>
        Courses to Improve
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Course Code</th>
                <th scope="col">Course Name</th>
                <th scope="col">Credits</th>
                <th scope="col">Score</th>
                <th scope="col">Letter Grade</th>
                <th scope="col">GPA</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course, index) => (
                <tr key={`${course.code}-${index}`}>
                  <td>{index + 1}</td>
                  <td>{course.code}</td>
                  <td>{course.name}</td>
                  <td>{course.credits}</td>
                  <td>{course.score}</td>
                  <td>
                    {course.letterGrade && (
                      <span className={`badge ${
                        course.letterGrade === 'A' || course.letterGrade === 'A+' ? 'badge-grade-a' : 
                        course.letterGrade === 'B+' || course.letterGrade === 'B' ? 'badge-grade-b' : 
                        course.letterGrade === 'C+' || course.letterGrade === 'C' ? 'badge-grade-c' : 
                        course.letterGrade === 'D+' || course.letterGrade === 'D' ? 'badge-grade-d' : 
                        'badge-grade-f'
                      }`}>
                        {course.letterGrade}
                      </span>
                    )}
                  </td>
                  <td>{course.gpa === -1 ? '—' : course.gpa}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
