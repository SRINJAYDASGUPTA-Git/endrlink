import "./globals.css";

export const metadata = {
  title: 'Shrinkr',
  description: 'Shrink your links with ease — powered by Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="apple-mobile-web-app-title" content="Shrinkr" />
        <title>Shrinkr</title>
      </head>
      <body className="w-full">
        {children}
      </body>
    </html>
  );
}
