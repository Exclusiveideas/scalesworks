import {
  Geist,
  Geist_Mono,
  Inter,
  Lato,
  Source_Sans_3,
} from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { SidebarProvider } from "@/components/ui/sidebar";

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"], // Include all necessary weights
  variable: "--font-inter",
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"], // Include all necessary weights
  variable: "--font-lato",
});

const sourceSans3 = Source_Sans_3({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-source-sans",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "ScaleWorks - Legal Tech Solution",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${lato} ${sourceSans3} antialiased`}
      >
        <SidebarProvider>
          {children}
          <Toaster />
        </SidebarProvider>
      </body>
    </html>
  );
}
