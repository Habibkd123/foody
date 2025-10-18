"use client";
import React, { useState, useEffect } from 'react';
const SidebarContext = React.createContext<{
  isExpanded: boolean;
  isMobile: boolean;
  isMobileOpen: boolean;
  toggleSidebar: () => void;
  toggleMobileSidebar: () => void;
  closeMobileSidebar: () => void;
} | undefined>(undefined);

const useSidebar = () => {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

// Sidebar Provider
const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    let resizeTimeout: NodeJS.Timeout;

    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const mobileView = window.innerWidth < 1024;
        setIsMobile(mobileView);
        if (!mobileView) setIsMobileOpen(false);
      }, 100);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimeout);
    };
  }, []);

  const toggleSidebar = React.useCallback(() => {
    if (isMobile) {
      setIsMobileOpen(prev => !prev);
    } else {
      setIsExpanded(prev => !prev);
    }
  }, [isMobile]);

  const toggleMobileSidebar = React.useCallback(() => {
    if (isMobile) {
      setIsMobileOpen(prev => !prev);
    }
  }, [isMobile]);

  const closeMobileSidebar = React.useCallback(() => {
    if (isMobile) {
      setIsMobileOpen(false);
    }
  }, [isMobile]);

  return (
    <SidebarContext.Provider
      value={{
        isExpanded,
        isMobile,
        isMobileOpen,
        toggleSidebar,
        toggleMobileSidebar,
        closeMobileSidebar
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};


export { SidebarProvider, useSidebar, SidebarContext };