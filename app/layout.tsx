import { Roboto } from "next/font/google";
import type { Metadata } from "next";
import TanStackProvider from "@/components/TanStackProvider/TanStackProvider";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
  display: "swap",
});

const baseUrl = "https://notehub.com/";
const ogImage =
  "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg";

export const metadata: Metadata = {
  title: "NoteHub",
  description: "Application for creating and managing notes.",
  openGraph: {
    title: "NoteHub",
    description: "Application for creating and managing notes.",
    url: baseUrl,
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "NoteHub preview",
      },
    ],
  },
};

export default function RootLayout({ children,  modal, }: { children: React.ReactNode;  modal: React.ReactNode;}) {
  
  return (
    <html lang="en">
      <body className={roboto.variable}>
        <TanStackProvider>
          <Header />
          {children}
          {modal}
          <Footer />
        </TanStackProvider>
      </body>
    </html>
  );
}
