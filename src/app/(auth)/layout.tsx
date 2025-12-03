"use client";

import { useEffect } from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Add class to html to enable scrolling for auth pages
    document.documentElement.classList.add('auth-page');
    
    // Directly set styles to ensure scrolling works
    const html = document.documentElement;
    const body = document.body;
    const nextRoot = document.getElementById('__next');
    
    // Store original values
    const originalHtmlOverflow = html.style.overflow;
    const originalHtmlHeight = html.style.height;
    const originalBodyOverflow = body.style.overflow;
    const originalBodyHeight = body.style.height;
    const originalNextOverflow = nextRoot?.style.overflow;
    const originalNextHeight = nextRoot?.style.height;
    
    // Set new values
    html.style.setProperty('overflow', 'auto', 'important');
    html.style.setProperty('height', 'auto', 'important');
    body.style.setProperty('overflow', 'auto', 'important');
    body.style.setProperty('height', 'auto', 'important');
    if (nextRoot) {
      nextRoot.style.setProperty('overflow', 'auto', 'important');
      nextRoot.style.setProperty('height', 'auto', 'important');
    }
    
    // Also add CSS rule as backup
    const style = document.createElement('style');
    style.id = 'auth-page-scroll-fix';
    style.textContent = `
      html.auth-page,
      html.auth-page body,
      html.auth-page #__next {
        overflow: auto !important;
        height: auto !important;
        min-height: 100vh !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      // Cleanup on unmount
      document.documentElement.classList.remove('auth-page');
      html.style.overflow = originalHtmlOverflow;
      html.style.height = originalHtmlHeight;
      body.style.overflow = originalBodyOverflow;
      body.style.height = originalBodyHeight;
      if (nextRoot) {
        nextRoot.style.overflow = originalNextOverflow || '';
        nextRoot.style.height = originalNextHeight || '';
      }
      const existingStyle = document.getElementById('auth-page-scroll-fix');
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, []);

  return (
    <>
      {children}
    </>
  );
}
