import type { Metadata } from "next";
import MyRootLayout from "@/components/RootLayout/myRootLayout";
import { ToastContainer } from "react-toastify";
import "./reset.css";
import "./globals.scss";
import "./custom.scss";

// For Mui Typography
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

import { SWRConfig } from "swr";
import AuthExpiredProvider from "@/components/AuthExpiredProvider/AuthExpiredProvider";

export const metadata: Metadata = {
  title: "xKiTXo Shop",
  description: "Welcome, xKiTXo Shop. |PC|GAMING|COMPUTER|CPU|RAM| ...",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body>
        <SWRConfig
          value={{
            revalidateOnFocus: false,
            shouldRetryOnError: false,
            errorRetryCount: 3
          }}
        >
          <AuthExpiredProvider>
            <MyRootLayout>{children}</MyRootLayout>
          </AuthExpiredProvider>
          <ToastContainer
            autoClose={3000}
            position="top-right"
            theme="colored"
            closeButton={false}
          />

        </SWRConfig>
      </body>
    </html>
  );
}
