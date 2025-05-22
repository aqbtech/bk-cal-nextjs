import { HTMLParser, RawCourseData } from './htmlParser';
import { PlainStringParser } from './plainStringParser';


export interface ParseCourseInput {
  extractCourseData: (content: string) => RawCourseData[];
}


export type Course = {
  code: string;
  name: string;
  credits: number;
  score: number | string; // Support both numeric scores and special grades (MT, RT, DT)
  letterGrade: string;
  gpa: number;
  // Flag to track if a course with RT grade also has a numeric score > F
  isRtWithPassingGrade?: boolean;
  // Flag to track if a course with RT grade also has an MT or DT grade
  isRtWithSpecialGrade?: boolean;
};

export class GPACalculator {
  /**
   * Check if a score is a passing grade (higher than F)
   */
  static isPassingGrade(numScore: number): boolean {
    return numScore >= 4.0; // D or higher
  }

  /**
   * Calculate the GPA based on the provided courses
   * Excludes courses with special grades (MT, RT, DT) from the calculation
   * For RT grades with a passing numeric score, uses the numeric score
   * Excludes courses with both RT and MT/DT grades
   */
  static calculateGPA(courses: Course[]): number {
    if (!courses || courses.length === 0) {
      return 0;
    }
   
    let validCourses = courses.filter(course => {
      // Exclude RT courses that also have MT or DT grades
      if (course.isRtWithSpecialGrade) {
        return false;
      }
      
      // Include courses with normal grades or RT courses with passing grades
      return course.gpa !== -1 || course.isRtWithPassingGrade === true;
    });

    console.log("valid course",validCourses);
    // if one course has more than two grades, choose the highest grade
    const classifiedCourses: Course[] = [];
    validCourses.forEach(course => {
      const existingCourse = classifiedCourses.find(c => c.code === course.code);
      if (existingCourse) {
        // if the course has a higher gpa, replace the existing course
        if (course.gpa > existingCourse.gpa) {
          classifiedCourses.splice(classifiedCourses.indexOf(existingCourse), 1);
          classifiedCourses.push(course);
        } // if the course has a lower gpa, do nothing
      } else {
        classifiedCourses.push(course);
      }
    });
    console.log("classified course",classifiedCourses); 
    validCourses = classifiedCourses;
    if (validCourses.length === 0) {
      return 0;
    }



    const totalCredits = validCourses.reduce((sum, course) => sum + course.credits, 0);
    const weightedGPA = validCourses.reduce((sum, course) => {
      // For RT courses with passing grade, use the actual GPA value, not -1
      const gpaValue = course.isRtWithPassingGrade && course.gpa === -1 ? 
        this.getGPAFromScore(course.score as number) : course.gpa;
      return sum + (gpaValue * course.credits);
    }, 0);

    return totalCredits > 0 ? weightedGPA / totalCredits : 0;
  }

  /**
   * Calculate the required GPA for remaining courses to achieve a target GPA
   * Excludes courses with special grades (MT, RT, DT) from the calculation
   * For RT grades with a passing numeric score, uses the numeric score
   */
  static calculateRequiredGPA(
    currentCourses: Course[],
    targetGPA: number,
    totalCreditsCDDT: number
  ): number {
    // Filter out courses with special grades (those with GPA of -1)
    // Except for RT grades that also have a passing numeric score
    const validCourses = currentCourses.filter(course => 
      course.gpa !== -1 || course.isRtWithPassingGrade === true
    );
    
    const currentGPA = this.calculateGPA(validCourses);
    const currentCredits = validCourses.reduce((sum, course) => sum + course.credits, 0);
    const remainingCredits = totalCreditsCDDT - currentCredits;

    if (remainingCredits <= 0) {
      return 0;
    }

    const requiredGPA = ((targetGPA * totalCreditsCDDT) - (currentGPA * currentCredits)) / remainingCredits;
    return Math.max(0, requiredGPA);
  }

  /**
   * Get GPA from a numeric score
   */
  static getGPAFromScore(score: number): number {
    const letterGrade = this.getLetterGrade(score);
    return this.getGPA(letterGrade);
  }

  /**
   * Convert number score to letter grade
   * Special cases:
   * - 'MT': Miễn thi (Exam Exemption)
   * - 'RT': Rút học phần (Course Withdrawal)
   * - 'DT': Điểm tạm (Temporary Grade)
   */
  static getLetterGrade(score: number | string): string {
    // Handle special string cases
    if (typeof score === 'string') {
      const upperScore = score.toUpperCase();
      if (['MT', 'RT', 'DT'].includes(upperScore)) {
        return upperScore;
      }
      // Try to parse string as number
      const numScore = parseFloat(score);
      if (isNaN(numScore)) {
        return 'F'; // Default to F if not a valid number
      }
      score = numScore;
    }
    
    // Normal numeric score handling
    if (score >= 9.5) return 'A+';
    if (score >= 8.5) return 'A';
    if (score >= 8.0) return 'B+';
    if (score >= 7.0) return 'B';
    if (score >= 6.5) return 'C+';
    if (score >= 5.5) return 'C';
    if (score >= 5.0) return 'D+';
    if (score >= 4.0) return 'D';
    return 'F';
  }

  /**
   * Convert letter grade to GPA
   * Special cases:
   * - 'MT': Miễn thi (Exam Exemption) - Not counted in GPA
   * - 'RT': Rút học phần (Course Withdrawal) - Not counted in GPA
   * - 'DT': Điểm đạt (passing Grade) - Not counted in GPA
   */
  static getGPA(letterGrade: string): number {
    switch (letterGrade) {
      case 'A+': return 4.0;
      case 'A': return 4.0;
      case 'B+': return 3.5;
      case 'B': return 3.0;
      case 'C+': return 2.5;
      case 'C': return 2.0;
      case 'D+': return 1.5;
      case 'D': return 1.0;
      case 'MT': // Miễn thi (Exam Exemption)
      case 'RT': // Rút học phần (Course Withdrawal)
      case 'DT': // Điểm đạt (passing Grade)
        return -1; // Special marker for grades not counted in GPA
      case 'F':
      default: return 0.0;
    }
  }


  /**
   * Parse HTML input and extract course data
   * Handles special grade cases according to specified rules:
   * 1. For courses with 'RT' and a passing numeric score, use the numeric score
   * 2. For other special grades (MT, DT), don't count them in GPA
   */
  static parseCourseInput(htmlContent: string, format: string): Course[] {
    // Extract raw course data using htmlParser
    
    let parser;
    switch (format) {
      case 'html':
        parser = new HTMLParser();
        break;
      case 'plainstring':
        parser = new PlainStringParser();
        break;
    
      default:
        console.error('Invalid format: ' + format);
        return [];
    }


    const rawCourses = parser!.extractCourseData(htmlContent);
    if (!rawCourses || rawCourses.length === 0) {
      return [];
    }

    const courses = this.filterCourses(rawCourses);
    console.log(courses);
    return courses;
  }

  static filterCourses(rawCourses: RawCourseData[]): Course[] {
    // Process raw courses and check for special cases
    const groupedCourses = new Map<string, RawCourseData[]>();
    
    // Group courses by code to check for duplicates (RT with passing grade)
    rawCourses.forEach(course => {
      const existing = groupedCourses.get(course.code) || [];
      existing.push(course);
      groupedCourses.set(course.code, existing);
    });
    
    // Process each group of courses
    const courses: Course[] = [];
    groupedCourses.forEach(rawCoursesGroup => {
      // Check if there's any RT grade in this group
      const rtCourse = rawCoursesGroup.find(c => 
        typeof c.score === 'string' && c.score.toUpperCase() === 'RT'
      );
      
      // Check if there's any MT or DT grade in this group
      const mtOrDtCourse = rawCoursesGroup.find(c => 
        typeof c.score === 'string' && ['MT', 'DT'].includes(c.score.toUpperCase())
      );
      
      // Check if there's any numeric score > F in this group
      const passingCourse = rawCoursesGroup.find(c => 
        typeof c.score === 'number' && this.isPassingGrade(c.score)
      );

      

      
      // Process each course
      rawCoursesGroup.forEach(rawCourse => {
        let finalScore = rawCourse.score;
        let isRtWithPassingGrade = false;
        let isRtWithSpecialGrade = false;
        
        // New rule: Check if this is RT and there's also an MT or DT for this course
        if (rtCourse && mtOrDtCourse && 
            typeof rawCourse.score === 'string' && 
            rawCourse.score.toUpperCase() === 'RT') {
          // Mark as RT with special grade (MT or DT) - will be excluded from suggestions
          isRtWithSpecialGrade = true;
        }
        
        // Handle special case: If both RT and passing grade exist
        if (rtCourse && passingCourse && 
            typeof rawCourse.score === 'string' && 
            rawCourse.score.toUpperCase() === 'RT') {
          // Keep RT as the score but mark this course for special GPA calculation
          isRtWithPassingGrade = true;
          finalScore = passingCourse.score;
        }

        
        const letterGrade = this.getLetterGrade(finalScore);
        const gpa = this.getGPA(letterGrade);

 
        courses.push({
          code: rawCourse.code,
          name: rawCourse.name,
          credits: rawCourse.credits,
          score: rawCourse.score, // Keep original score for display
          letterGrade,
          gpa,
          isRtWithPassingGrade,
          isRtWithSpecialGrade // New flag for RT courses with MT or DT
        });
      });
      
      
    });
    let classifiedCourses: Course[] = [];
    // if one course has more than two grades, choose the highest grade
    courses.forEach(course => {
      const existingCourse = classifiedCourses.find(c => c.code === course.code);
      if (existingCourse) {
        // if the course has a higher gpa, replace the existing course
        if (course.gpa > existingCourse.gpa) {
          classifiedCourses.splice(classifiedCourses.indexOf(existingCourse), 1);
          classifiedCourses.push(course);
        } // if the course has a lower gpa, do nothing
      } else {
        classifiedCourses.push(course);
      }
    });
    return classifiedCourses;
  } 

  /**
   * Suggest courses to improve GPA
   * Rules:
   * 1. Don't include MT (Miễn thi) or DT (Điểm tạm) courses
   * 2. Include RT (Rút học phần) courses only if:
   *    - They don't have a passing grade yet
   *    - AND they don't also have MT or DT grades for the same course
   */
  static suggestCoursesToImprove(courses: Course[], numSuggestions: number): Course[] {
    if (!courses || courses.length === 0) {
      return [];
    }

    // Filter courses according to the rules
    const eligibleCourses = courses.filter(course => {
      // Exclude MT and DT courses entirely
      if (course.letterGrade === 'MT' || course.letterGrade === 'DT') {
        return false;
      }
      
      // Exclude RT courses that already have a passing grade
      if (course.letterGrade === 'RT' && course.isRtWithPassingGrade) {
        return false;
      }
      
      // New rule: Exclude RT courses that also have MT or DT grades
      if (course.letterGrade === 'RT' && course.isRtWithSpecialGrade) {
        return false;
      }
      
      if (course.credits === 0) {
        return
      }
      // Include everything else
      return true;
    });
    
    // Sort eligible courses by GPA in ascending order (lowest first)
    const sortedCourses = eligibleCourses.sort((a, b) => {
      // Handle special case where one of the GPAs is -1 (special grade)
      if (a.gpa === -1 && b.gpa !== -1) return -1; // RT without passing grade comes first
      if (a.gpa !== -1 && b.gpa === -1) return 1;
      
      // Normal GPA comparison
      return a.gpa - b.gpa;
    });
    
    // Return the requested number of courses with lowest GPA
    return sortedCourses.slice(0, Math.min(numSuggestions, sortedCourses.length));
  }

  /**
   * Calculate GPA after improving certain courses' grades
   * @param courses Original courses array
   * @param improvements Object mapping course codes to new numeric scores
   * @returns New courses array with improved grades and new GPA value
   */
  static improveGPA(courses: Course[], improvements: {[key: string]: number}): {
    improvedCourses: Course[],
    newGPA: number,
    oldGPA: number,
    improvedCourses_detail: Course[]
  } {
    if (!courses || courses.length === 0) {
      return { 
        improvedCourses: [], 
        newGPA: 0, 
        oldGPA: 0,
        improvedCourses_detail: [] 
      };
    }
    
    // Clone the original courses array to avoid mutation
    const improvedCourses = JSON.parse(JSON.stringify(courses)) as Course[];
    const improvedCourses_detail: Course[] = [];
    const oldGPA = this.calculateGPA(courses);
    
    // Apply improvements
    improvedCourses.forEach(course => {
      if (improvements[course.code] !== undefined) {
        const newScore = improvements[course.code];
        const oldScore = course.score;
        const oldGPA = course.gpa;
        
        // Update the course with the new score
        course.score = newScore;
        
        // Calculate the new letter grade and GPA point
        const letterGrade = this.getLetterGrade(newScore);
        const gpaPoint = this.getGPA(letterGrade);
        course.letterGrade = letterGrade;
        course.gpa = gpaPoint;
        
        // Clear any special grade flags
        course.isRtWithPassingGrade = false;
        course.isRtWithSpecialGrade = false;
        
        // Add to improved courses detail list
        improvedCourses_detail.push({
          ...course,
          score: `${oldScore} → ${newScore}`,
          gpa: gpaPoint,
          letterGrade: `${oldGPA !== -1 ? oldGPA : 'N/A'} → ${gpaPoint}`
        });
      }
    });
    
    // Calculate the new GPA
    const newGPA = this.calculateGPA(improvedCourses);
    
    return {
      improvedCourses,
      newGPA,
      oldGPA,
      improvedCourses_detail
    };
  }
}
