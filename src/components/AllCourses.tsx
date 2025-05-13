'use client';

import { useState, useMemo } from 'react';
import { Course } from '@/lib/calculator';

interface AllCoursesProps {
  courses: Course[];
}

type SortDirection = 'asc' | 'desc';
type SortColumn = 'code' | 'name' | 'credits' | 'score' | 'letterGrade' | 'gpa';

export default function AllCourses({ courses }: AllCoursesProps) {
  const [sortColumn, setSortColumn] = useState<SortColumn>('code');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Handle column header click
  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      // Toggle direction if clicking the same column
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new column and default to ascending
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Memoize sorted courses
  const sortedCourses = useMemo(() => {
    if (!courses || courses.length === 0) return [];

    return [...courses].sort((a, b) => {
      let valueA = a[sortColumn];
      let valueB = b[sortColumn];

      // Handle string comparison
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        valueA = valueA.toLowerCase();
        valueB = valueB.toLowerCase();
      }

      // Compare values based on sort direction
      if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [courses, sortColumn, sortDirection]);

  // Icons for sorting
  const getSortIcon = (column: SortColumn) => {
    if (sortColumn !== column) return "fas fa-sort text-secondary";
    return sortDirection === 'asc' ? "fas fa-sort-up text-primary" : "fas fa-sort-down text-primary";
  };

  if (!courses || courses.length === 0) {
    return null;
  }

  return (
    <div className="card fade-in">
      <div className="card-header d-flex flex-wrap justify-content-between align-items-center">
        <div className="d-flex align-items-center mb-2 mb-md-0">
          <i className="fas fa-list-alt me-2"></i>
          <span className="fs-5">All Courses</span>
        </div>
        <div className="d-flex flex-wrap align-items-center gap-3">
          <div>
            <label htmlFor="sortSelect" className="form-label mb-0 me-2">
              Sort by:
            </label>
            <select
              id="sortSelect"
              className="form-select form-select-sm d-inline-block"
              style={{ width: 'auto' }}
              value={sortColumn}
              onChange={(e) => setSortColumn(e.target.value as SortColumn)}
            >
              <option value="code">Course Code</option>
              <option value="name">Course Name</option>
              <option value="credits">Credits</option>
              <option value="score">Score</option>
              <option value="letterGrade">Letter Grade</option>
              <option value="gpa">GPA</option>
            </select>
          </div>
          <div>
            <label className="form-label mb-0 me-2">
              Order:
            </label>
            <div className="btn-group">
              <button
                type="button"
                className={`btn btn-sm ${sortDirection === 'asc' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setSortDirection('asc')}
              >
                <i className="fas fa-sort-amount-down-alt me-1"></i> Asc
              </button>
              <button
                type="button"
                className={`btn btn-sm ${sortDirection === 'desc' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setSortDirection('desc')}
              >
                <i className="fas fa-sort-amount-down me-1"></i> Desc
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th 
                  scope="col"
                  className="cursor-pointer"
                  onClick={() => handleSort('code')}
                >
                  Course Code <i className={getSortIcon('code')}></i>
                </th>
                <th 
                  scope="col"
                  className="cursor-pointer"
                  onClick={() => handleSort('name')}
                >
                  Course Name <i className={getSortIcon('name')}></i>
                </th>
                <th 
                  scope="col"
                  className="cursor-pointer"
                  onClick={() => handleSort('credits')}
                >
                  Credits <i className={getSortIcon('credits')}></i>
                </th>
                <th 
                  scope="col"
                  className="cursor-pointer"
                  onClick={() => handleSort('score')}
                >
                  Score <i className={getSortIcon('score')}></i>
                </th>
                <th 
                  scope="col"
                  className="cursor-pointer"
                  onClick={() => handleSort('letterGrade')}
                >
                  Letter Grade <i className={getSortIcon('letterGrade')}></i>
                </th>
                <th 
                  scope="col"
                  className="cursor-pointer"
                  onClick={() => handleSort('gpa')}
                >
                  GPA <i className={getSortIcon('gpa')}></i>
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedCourses.map((course, index) => (
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
