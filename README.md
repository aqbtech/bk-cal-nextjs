# HCMUT GPA Calculator (Next.js Version)

A modern web application for calculating and analyzing GPA for HCMUT University students, built with Next.js and TypeScript.

## Project Overview

This project is a reimplementation of the original Flask-based HCMUT GPA Calculator, migrated to a modern React/Next.js stack. It maintains all the functionality of the original while providing a more responsive and interactive user experience through client-side processing.

## Features

- **Course Data Parsing**: Paste HTML from the HCMUT website to automatically extract course information
- **GPA Calculation**: Calculate your current GPA based on your courses
- **Target GPA Analysis**: Set a target GPA and see what grades you need to achieve it
- **Course Improvement Suggestions**: Get recommendations for which courses to focus on improving
- **Sortable Course List**: View and sort your courses by different criteria
- **Responsive Design**: Works on mobile, tablet, and desktop devices

## Tech Stack

- **Frontend Framework**: Next.js with React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Font Awesome

## Project Structure

```
bk-cal-next/
├── public/              # Static assets
├── src/
│   ├── app/             # Next.js App Router
│   │   ├── globals.css  # Global styles
│   │   ├── layout.tsx   # Root layout component
│   │   └── page.tsx     # Main application page
│   ├── components/      # React components
│   │   ├── AllCourses.tsx
│   │   ├── GPAStats.tsx
│   │   ├── GPATools.tsx
│   │   ├── InputForm.tsx
│   │   ├── SuggestedCourses.tsx
│   │   └── TargetGPAAnalysis.tsx
│   └── lib/             # Utility functions and business logic
│       ├── calculator.ts # GPA calculation logic
│       └── htmlParser.ts # HTML parsing utilities
├── next.config.js       # Next.js configuration
├── package.json         # Dependencies and scripts
├── tailwind.config.js   # Tailwind CSS configuration
└── tsconfig.json        # TypeScript configuration
```

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd bk-cal-next
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Build for Production

```bash
npm run build
npm start
```

## Differences from the Flask Version

- **Client-side Processing**: All calculations happen in the browser, eliminating the need for server roundtrips
- **Enhanced UI**: More interactive elements with real-time feedback
- **Advanced Sorting**: Improved sorting capabilities in the course tables
- **Type Safety**: Added TypeScript for better code quality and developer experience
- **Modern Styling**: Tailwind CSS for consistent, responsive design

## Future Enhancements

- Save and load course data from local storage
- Export results as PDF or Excel
- Visualize GPA trends with charts
- Dark mode support
- Multi-language support
