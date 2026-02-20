// app/layout.tsx
import "./globals.css"; // Ensure this is the first import
import type { Metadata } from "next";
// ... rest of your code
import { Inter, Space_Grotesk } from "next/font/google";


// Configure Inter for body text
const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

// Configure Space Grotesk for headings
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "Hizaki Labs - Cover Letter Ghostwriter",
  description: "Your Tech & Creative Partner for professional AI-generated content.",
  // Using the brand metadata from the index.html source
  keywords: ["Hizaki Labs", "AI Development", "Tech Solutions", "Cover Letter Ghostwriter"],
  authors: [{ name: "John Hizaki" }],
};

// app/layout.tsx
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} font-inter`}
        suppressHydrationWarning={true} // <--- Add this line
      >
        {children}
      </body>
    </html>
  );
}
