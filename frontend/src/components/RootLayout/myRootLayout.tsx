"use client";
import React from "react";
import Header from "./header";
import Footer from "./footer";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import { NAV_BAR_CONFIG, TOP_BAR_CONFIG } from "@/config/constants";
import { usePathname } from "next/navigation";
import { DASHBOARD_URL_PREFIX } from "@/config/navigation";
import { MIN_HEIGHT } from '@/config/constants'

const MyRootLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isDashboard = Boolean(pathname.startsWith(DASHBOARD_URL_PREFIX));

  const baseStyles = {
    pt: {
      xs: "89px",
      sm: `${TOP_BAR_CONFIG.HEIGHT + NAV_BAR_CONFIG.HEIGHT}px`
    }
  }
  const styleConfig = isDashboard ? {
    //  height: "100%" 
  } : {};

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        // height: "100%",
      }}
    >
      <Header />
      <Box sx={{ minHeight: MIN_HEIGHT, ...baseStyles, ...styleConfig }}>
        <Toolbar
          disableGutters
          sx={{
            display: "flex",
            flexGrow: 1,
            // height: "100%"
          }}
        >
          {children}
        </Toolbar>
      </Box>
      <Footer />
    </Box>
  );
};

export default MyRootLayout;
