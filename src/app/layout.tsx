import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'HCMUT GPA Calculator',
  description: 'Calculate your GPA for HCMUT University',
  // Favicon is handled with a link tag in the head section
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body className={inter.className}>
        <div className="container py-4">
          <header className="mb-4">
            <h1 className="text-center mb-2 display-5">
              <i className="fas fa-calculator me-2"></i>
              HCMUT GPA Calculator
            </h1>
            <p className="text-center text-secondary">
              Calculate your GPA and analyze your academic performance
            </p>
          </header>
          <main>{children}</main>
          <footer className="mt-5 text-center text-secondary">
            <p className="small">© {new Date().getFullYear()} HCMUT GPA Calculator. All rights reserved.</p>
          </footer>
        </div>
        
        {/* Bootstrap JS */}
        <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.min.js"></script>
      </body>
    </html>
  );
}
