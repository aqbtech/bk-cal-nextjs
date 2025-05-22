import type { AppProps } from 'next/app';
import { Inter } from 'next/font/google';
import Head from 'next/head';
import '@/app/globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>HCMUT GPA Calculator</title>
        <meta name="description" content="Calculate your GPA for HCMUT University" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
          rel="stylesheet"
        /> */}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={inter.className}>
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
          <main>
            <Component {...pageProps} />
          </main>
          <footer className="mt-5 text-center text-secondary">
            <p className="small">© {new Date().getFullYear()} HCMUT GPA Calculator. All rights reserved.</p>
          </footer>
        </div>
      </div>
      <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.min.js"></script>
    </>
  );
}
