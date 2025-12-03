"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

export default function DiscountsPage() {
  const [tab, setTab] = useState<"available" | "used" | "expired">("available");

  // Mock Data
  const discounts = [
    {
      id: 1,
      business: "Chivhu Hardware",
      offer: "15% OFF",
      desc: "On all building materials",
      validUntil: "12 Dec 2025",
      status: "available"
    },
    {
      id: 2,
      business: "OK Mart",
      offer: "$5 Coupon",
      desc: "Minimum spend $50",
      validUntil: "30 Nov 2025",
      status: "available"
    },
    {
      id: 3,
      business: "Total Energies",
      offer: "5% OFF",
      desc: "Fuel purchase over 20L",
      validUntil: "15 Oct 2025",
      status: "expired"
    }
  ];

  const filteredDiscounts = discounts.filter(d => d.status === tab || (tab === 'expired' && d.status === 'expired')); 
  // Simplistic filter for mock data

  return (
    <div className="space-y-6 pb-20 min-h-screen bg-background">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-heading-2 text-primary">Available Discounts</h1>
        <p className="text-body text-muted-foreground">Save at businesses you've invested in.</p>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-secondary rounded-xl">
        {["available", "used", "expired"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t as any)}
            className={`flex-1 py-2 text-sm font-medium rounded-lg capitalize transition-all ${
              tab === t 
                ? "bg-white text-primary shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-4">
        {filteredDiscounts.length > 0 ? (
          filteredDiscounts.map((item) => (
            <Card key={item.id} className="shadow-sm border-border/60 relative overflow-hidden group">
              {/* Decorative side bar */}
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary" />
              
              <CardContent className="p-5 pl-6 flex justify-between items-center">
                <div className="space-y-1">
                  <h3 className="font-bold text-lg">{item.business}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                  <div className="pt-1">
                    <span className="text-xs text-muted-foreground">Valid until {item.validUntil}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="text-xl font-bold text-primary">{item.offer}</span>
                  <Button size="sm" className="h-8 px-4 text-xs bg-secondary text-primary hover:bg-secondary/80 shadow-none border border-primary/10">
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-12 opacity-60">
            <p className="text-lg font-medium text-muted-foreground">No discounts in this category</p>
          </div>
        )}
      </div>
    </div>
  );
}