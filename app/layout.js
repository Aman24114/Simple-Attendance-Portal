export const metadata = {
  title: 'NIT Jamshedpur - Attendance Portal',
  description: 'Official attendance management system of National Institute of Technology, Jamshedpur. Track attendance, manage classes, and generate reports efficiently.',
  keywords: 'NIT Jamshedpur, attendance portal, student management, professor dashboard, admin panel',
  authors: [{ name: 'NIT Jamshedpur' }],
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
