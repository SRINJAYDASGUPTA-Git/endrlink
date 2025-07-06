import "./globals.css";
import {Geist_Mono, Geist} from "next/font/google";
import {UserProvider} from "@/providers/UserContext";
import {Toaster} from "sonner";

export const metadata = {
  title: 'EndrLink',
  description: 'A simple URL shortener',
};
const geist_sans = Geist({
    variable: '--font-geist-sans',
});

const geist_mono = Geist_Mono({
    variable: '--font-geist-mono',
});
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
        <meta name="apple-mobile-web-app-title" content="EndrLink" />
        <title>Shrinkr</title>
      </head>
      <body className={`w-full bg-gray-800 text-white antialiased ${geist_sans.variable} ${geist_mono.variable}`}>
          <UserProvider>
            {children}
          <Toaster position={'top-center'}/>
          </UserProvider>
      </body>
    </html>
  );
}
