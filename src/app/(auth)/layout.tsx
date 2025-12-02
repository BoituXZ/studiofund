"use client";

import { Logo } from "@/components/logo";
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
    <div className="min-h-screen bg-primary flex flex-col items-center justify-start py-8 px-4 relative">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl -translate-y-1/2" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/30 rounded-full blur-3xl translate-y-1/2" />
      </div>
      
      {/* Logo */}
      <div className="fixed top-6 left-6 z-10 animate-in fade-in slide-in-from-top-4 duration-500">
        <Logo variant="light" />
      </div>
      
      {/* Content */}
      <div className="w-full max-w-2xl relative z-10 mt-16 mb-16">
        {children}
      </div>
    </div>
  );
}
