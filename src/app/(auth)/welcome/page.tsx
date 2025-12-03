"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-white text-gray-950 flex flex-col font-sans selection:bg-brand-blue/20">

      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center opacity-10"
        style={{ backgroundImage: "url('/placeholder-african-community.jpg')" }} 
      />

      {/* Overlay */}
      <div className="absolute inset-0 z-1 bg-gradient-to-b from-white via-white/80 to-white" />

      {/* Main Content */}
      <main className="flex-1 flex flex-col justify-center items-center px-6 sm:px-12 max-w-4xl mx-auto w-full text-center z-10">

        {/* Hero Section */}
        <div className="space-y-8 my-16">
          <div className="space-y-6">
            <h1 className="text-5xl sm:text-7xl font-bold tracking-tighter text-gray-950 leading-[1.1]">
              Invest in your community.
              <br />
              <span className="text-brand-blue">Secure your future.</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
              HiveFund is the trusted digital platform for traditional savings groups. We empower communities to pool resources, fund local businesses, and build a prosperous future together.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button
              asChild
              className="h-14 px-10 text-lg font-semibold bg-brand-blue hover:bg-brand-blue/90 text-white rounded-full shadow-lg transition-all transform hover:scale-105"
            >
              <Link href="/register">
                Create a Group
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="h-14 px-10 text-lg font-semibold bg-white text-brand-blue hover:bg-brand-blue/10 rounded-full shadow-lg transition-all"
            >
              <Link href="/login">
                Sign In
              </Link>
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 py-16 text-left">
          <div className="p-8 bg-white/50 rounded-2xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-lg-blue">
            <h3 className="font-bold text-xl text-brand-blue mb-2">Savings Pools</h3>
            <p className="text-gray-600 leading-relaxed">
              Automate your group's contributions, track payments, and maintain perfect transparency with our secure digital ledger.
            </p>
          </div>
          <div className="p-8 bg-white/50 rounded-2xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-lg-blue">
            <h3 className="font-bold text-xl text-brand-red mb-2">Community Investments</h3>
            <p className="text-gray-600 leading-relaxed">
              Put your group's capital to work by investing in verified local businesses and opportunities, with clear terms and managed payouts.
            </p>
          </div>
          <div className="p-8 bg-white/50 rounded-2xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-lg-blue">
            <h3 className="font-bold text-xl text-gray-800 mb-2">Secure by Design</h3>
            <p className="text-gray-600 leading-relaxed">
              Built with bank-grade security and data privacy in mind, so you can focus on what matters: your community's financial health.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full px-6 py-8 z-10">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
          <p className="mb-4 sm:mb-0">© 2025 HiveFund. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/terms" className="hover:text-brand-blue transition-colors">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-brand-blue transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}