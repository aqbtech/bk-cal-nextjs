/**
 * HTML parsing utility for client-side usage
 * This is needed because DOMParser is only available in browser environments
 */

import { ParseCourseInput } from './calculator';

export class HTMLParser implements ParseCourseInput {
  extractCourseData(htmlContent: string): RawCourseData[] {
    if (!htmlContent || htmlContent.trim() === '') {
      return [];
    }
  
    try {
      const doc = parseHTML(htmlContent);
      if (!doc) return [];
      
      // Find tables in the HTML
      const tables = doc.querySelectorAll('table');
      const courses: RawCourseData[] = [];
  
      // Process each table
      tables.forEach(table => {
        const rows = table.querySelectorAll('tr');
        
        // Skip header row and process data rows
        for (let i = 1; i < rows.length; i++) {
          const row = rows[i];
          const cells = row.querySelectorAll('td');
          
          // Ensure we have enough cells
          if (cells.length >= 5) {
            const code = cells[0]?.textContent?.trim() || '';
            const name = cells[1]?.textContent?.trim() || '';
            
            // Parse credits safely
            const creditsText = cells[2]?.textContent?.trim() || '0';
            const parsedCredits = parseFloat(creditsText);
            const credits = !isNaN(parsedCredits) ? parsedCredits : 0;
            
            // Handle special grade cases, score is in the 5th column
            let scoreText = cells[4]?.textContent?.trim() || '0';
            let score: number | string;
            
            // Clean up the score text
            scoreText = scoreText.toUpperCase();
            
            if (['MT', 'RT', 'DT'].includes(scoreText)) {
              // Keep special grades as strings
              score = scoreText;
            } else {
              // Try to parse as number
              const parsedScore = parseFloat(scoreText);
              score = !isNaN(parsedScore) ? parsedScore : 0;
            }
            
            courses.push({
              code,
              name,
              credits,
              score
            });
          }
        }
      });
  
      return courses;
    } catch (error) {
      console.error('Error parsing HTML input:', error);
      return [];
    }
  };
}

let parser: DOMParser | null = null;

// Initialize the parser in a browser environment
export const initParser = () => {
  // Check if we're in a browser environment
  if (typeof window !== 'undefined') {
    parser = new DOMParser();
    return true;
  }
  return false;
};

/**
 * Parse HTML content into a DOM document
 * @param html HTML content to parse
 * @returns Parsed Document or null if not in a browser environment
 */
export const parseHTML = (html: string): Document | null => {
  if (!parser) {
    const initialized = initParser();
    if (!initialized) {
      console.error('Cannot parse HTML: DOMParser is not available (not in browser environment)');
      return null;
    }
  }
  
  return parser!.parseFromString(html, 'text/html');
};

/**
 * Extract raw course data from HTML content
 * @param html HTML content to parse
 * @returns Array of raw course data objects
 */
export interface RawCourseData {
  code: string;
  name: string;
  credits: number;
  score: number | string;
}

/**
 * Extract course data from HTML tables
 * Handles special grade cases: MT (Miễn thi), RT (Rút học phần), DT (Điểm tạm)
 */
export const extractCourseData = (htmlContent: string): RawCourseData[] => {
  if (!htmlContent || htmlContent.trim() === '') {
    return [];
  }

  try {
    const doc = parseHTML(htmlContent);
    if (!doc) return [];
    
    // Find tables in the HTML
    const tables = doc.querySelectorAll('table');
    const courses: RawCourseData[] = [];

    // Process each table
    tables.forEach(table => {
      const rows = table.querySelectorAll('tr');
      
      // Skip header row and process data rows
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const cells = row.querySelectorAll('td');
        
        // Ensure we have enough cells
        if (cells.length >= 5) {
          const code = cells[0]?.textContent?.trim() || '';
          const name = cells[1]?.textContent?.trim() || '';
          
          // Parse credits safely
          const creditsText = cells[2]?.textContent?.trim() || '0';
          const parsedCredits = parseFloat(creditsText);
          const credits = !isNaN(parsedCredits) ? parsedCredits : 0;
          
          // Handle special grade cases, score is in the 5th column
          let scoreText = cells[4]?.textContent?.trim() || '0';
          let score: number | string;
          
          // Clean up the score text
          scoreText = scoreText.toUpperCase();
          
          if (['MT', 'RT', 'DT'].includes(scoreText)) {
            // Keep special grades as strings
            score = scoreText;
          } else {
            // Try to parse as number
            const parsedScore = parseFloat(scoreText);
            score = !isNaN(parsedScore) ? parsedScore : 0;
          }
          
          courses.push({
            code,
            name,
            credits,
            score
          });
        }
      }
    });

    return courses;
  } catch (error) {
    console.error('Error parsing HTML input:', error);
    return [];
  }
};
