
import type { Metadata } from "next";
import "@/app/globals.css"
import NavBarContextProvider from "@/Context/navBarContext"
import "react-toastify/dist/ReactToastify.css"
import Header from "@/components/WebSite/header/Header";
import Footer from "@/components/WebSite/Footer/Footer";

export const metadata: Metadata = {
    title: "Hotel Book",
    description: "Hotel Book website for booking hotel",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <NavBarContextProvider>
                {children}
            </NavBarContextProvider>
            <Footer />
        </div>
    );
}
