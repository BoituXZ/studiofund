"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, TrendingUp, Users } from "lucide-react";

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-white text-gray-950 flex flex-col font-sans selection:bg-gray-100">
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col justify-center px-6 sm:px-12 max-w-5xl mx-auto w-full pt-20 pb-12">
        
        {/* Hero Section */}
        <div className="space-y-8 mb-24">
          <div className="space-y-6 max-w-3xl">
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-gray-950 leading-[1.1]">
              Community finance,<br />
              <span className="text-gray-400">reimagined.</span>
            </h1>
            <p className="text-xl text-gray-500 leading-relaxed max-w-xl">
              The professional platform for group savings, secure local investments, and community-backed insurance.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button 
              asChild 
              className="h-12 px-8 text-base font-medium bg-gray-950 hover:bg-gray-800 text-white rounded-md transition-all"
            >
              <Link href="/register">
                Start Saving
              </Link>
            </Button>
            <Button 
              asChild 
              variant="outline"
              className="h-12 px-8 text-base font-medium border-gray-200 text-gray-950 hover:bg-gray-50 hover:text-gray-950 rounded-md transition-all"
            >
              <Link href="/login">
                Log In
              </Link>
            </Button>
          </div>
        </div>

        {/* Feature Grid - Vercel Style */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-gray-100 pt-16">
          <div className="space-y-3">
            <div className="h-10 w-10 rounded-full bg-gray-50 flex items-center justify-center">
              <Users className="h-5 w-5 text-gray-900" strokeWidth={1.5} />
            </div>
            <h3 className="font-semibold text-lg text-gray-900">Group Pools</h3>
            <p className="text-gray-500 leading-relaxed text-sm">
              Create invite-only savings groups with automated tracking and transparency.
            </p>
          </div>

          <div className="space-y-3">
            <div className="h-10 w-10 rounded-full bg-gray-50 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-gray-900" strokeWidth={1.5} />
            </div>
            <h3 className="font-semibold text-lg text-gray-900">Verified Investments</h3>
            <p className="text-gray-500 leading-relaxed text-sm">
              Deploy capital into vetted local businesses with clear repayment terms.
            </p>
          </div>

          <div className="space-y-3">
            <div className="h-10 w-10 rounded-full bg-gray-50 flex items-center justify-center">
              <Shield className="h-5 w-5 text-gray-900" strokeWidth={1.5} />
            </div>
            <h3 className="font-semibold text-lg text-gray-900">Secure Coverage</h3>
            <p className="text-gray-500 leading-relaxed text-sm">
              Access community-managed insurance for health and emergencies.
            </p>
          </div>
        </div>

      </main>

      {/* Minimal Footer */}
      <footer className="px-6 py-8 border-t border-gray-100 mt-auto">
        <div className="max-w-5xl mx-auto flex justify-between items-center text-xs text-gray-400">
          <p>© 2025 HiveFund. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/terms" className="hover:text-gray-900 transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-gray-900 transition-colors">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}