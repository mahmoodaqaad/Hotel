
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import NavBarContextProvider from "@/Context/navBarContext"
import "react-toastify/dist/ReactToastify.css"
import ModeContextProvider from "@/Context/ModeContext";
import { SocketContextProvider } from "@/Context/SocketContext";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hotel Book",
  description: "Hotel Book website for booking hotel",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {



  return (
    <html lang="en" >

      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ToastContainer theme="colored" />
        <SocketContextProvider>
          <ModeContextProvider>
            <NavBarContextProvider>

              {children}
            </NavBarContextProvider>
          </ModeContextProvider>
        </SocketContextProvider>
      </body>
    </html>
  );
}
