"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function WelcomePage() {
  return (
    <div className="relative text-gray-950 font-sans selection:bg-brand-blue/20 bg-white">
      {/* Section 1: Hero */}
      <section
        className="relative min-h-screen w-full flex items-center justify-center px-6 sm:px-12 bg-cover bg-center"
        style={{ backgroundImage: "url('/backWelcome.jpg')" }}
      >
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-6">
            <h1 className="text-6xl sm:text-8xl font-black tracking-tighter text-gray-950 leading-[1.1] whitespace-nowrap">
              Invest in your community.
            </h1>
            <h1 className="text-6xl sm:text-8xl font-black tracking-tighter text-brand-blue leading-[1.1] whitespace-nowrap">
              Secure your future.
            </h1>
            <p className="text-xl sm:text-2xl font-semibold text-white leading-relaxed">
              HiveFund is the trusted digital platform for traditional savings groups. We empower communities to pool resources, fund local businesses, and build a prosperous future together.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
            <Button
              asChild
              className="h-16 px-12 text-lg font-bold bg-brand-blue hover:bg-brand-blue/90 text-white rounded-full shadow-xl transition-all transform hover:scale-110 active:scale-95"
            >
              <Link href="/register">
                Create a Group
              </Link>
            </Button>
            <Button
              asChild
              className="h-16 px-12 text-lg font-bold bg-gray-700 hover:bg-gray-800 text-white rounded-full shadow-xl transition-all transform hover:scale-110 active:scale-95"
            >
              <Link href="/login">
                Sign In
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Section 2: Savings Pools */}
      <section className="min-h-screen w-full flex items-center justify-center px-6 sm:px-12 py-20 bg-white">
        <div className="max-w-4xl mx-auto space-y-8">
          <h2 className="text-5xl sm:text-7xl font-black text-gray-950 leading-tight">
            Savings Pools
          </h2>
          <p className="text-2xl font-semibold text-gray-700 leading-relaxed">
            Keep your group's finances organized and transparent with automated contribution tracking and management.
          </p>
          <div className="space-y-6 text-lg text-gray-600 font-medium leading-relaxed">
            <p>
              Traditional savings groups have always relied on trust and manual record-keeping. HiveFund brings these time-honored practices into the digital age, automating the administrative burden while maintaining the personal trust that makes savings groups work.
            </p>
            <p>
              Every contribution is recorded instantly, every member can see the group's balance in real-time, and all transactions are permanently documented in a secure digital ledger. No more disputes over who paid what, or how much the group has saved.
            </p>
            <p>
              With HiveFund's savings pools, your group can focus on what matters most: building wealth together and supporting each other's financial goals.
            </p>
          </div>
        </div>
      </section>

      {/* Section 3: Community Investments */}
      <section className="min-h-screen w-full flex items-center justify-center px-6 sm:px-12 py-20 bg-gray-900">
        <div className="max-w-4xl mx-auto space-y-8">
          <h2 className="text-5xl sm:text-7xl font-black text-white leading-tight">
            Community Investments
          </h2>
          <p className="text-2xl font-semibold text-gray-200 leading-relaxed">
            Turn your group's savings into growth opportunities that benefit everyone in your community.
          </p>
          <div className="space-y-6 text-lg text-gray-300 font-medium leading-relaxed">
            <p>
              A savings group with capital is powerful. But that power is only truly realized when the money is put to work. Community investments allow your group to fund local entrepreneurs, support small businesses, and generate returns that benefit all members.
            </p>
            <p>
              We help identify verified investment opportunities aligned with your group's goals and risk tolerance. Every investment is backed by clear terms, regular updates, and transparent tracking so your group knows exactly how the capital is being used and what returns to expect.
            </p>
            <p>
              From funding a local shop to supporting agricultural ventures, your group's capital becomes a catalyst for community development. And as these ventures succeed, your group's wealth grows right along with them.
            </p>
          </div>
        </div>
      </section>

      {/* Section 4: Secure by Design */}
      <section className="min-h-screen w-full flex items-center justify-center px-6 sm:px-12 py-20 bg-white">
        <div className="max-w-4xl mx-auto space-y-8">
          <h2 className="text-5xl sm:text-7xl font-black text-gray-950 leading-tight">
            Secure by Design
          </h2>
          <p className="text-2xl font-semibold text-gray-700 leading-relaxed">
            Your group's financial data is protected with enterprise-grade security and privacy standards.
          </p>
          <div className="space-y-6 text-lg text-gray-600 font-medium leading-relaxed">
            <p>
              Financial security isn't an afterthought—it's built into every layer of HiveFund. We employ the same security standards used by banks and financial institutions to ensure that your group's data, transactions, and member information are always protected.
            </p>
            <p>
              All communications are encrypted end-to-end. Member data is securely stored with multiple backups. Account access is protected with multi-factor authentication. And our infrastructure is monitored 24/7 to detect and prevent any suspicious activity.
            </p>
            <p>
              Beyond security, we're committed to your privacy. We never sell your data, never share member information without consent, and comply with the strictest data protection regulations. Your group's financial information belongs to you alone.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full flex items-center justify-center px-6 sm:px-12 py-20 bg-gradient-to-r from-gray-900 to-gray-800">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-5xl sm:text-6xl font-black text-white leading-tight">
            Ready to grow your group?
          </h2>
          <p className="text-xl font-semibold text-gray-300 leading-relaxed">
            Join thousands of savings groups using HiveFund to manage their finances and build wealth together.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
            <Button
              asChild
              className="h-16 px-12 text-lg font-bold bg-brand-blue hover:bg-brand-blue/90 text-white rounded-full shadow-xl transition-all transform hover:scale-110 active:scale-95"
            >
              <Link href="/register">
                Create a Group
              </Link>
            </Button>
            <Button
              asChild
              className="h-16 px-12 text-lg font-bold bg-gray-700 hover:bg-gray-800 text-white rounded-full shadow-xl transition-all transform hover:scale-110 active:scale-95"
            >
              <Link href="/login">
                Sign In
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}