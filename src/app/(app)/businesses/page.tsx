"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, MapPin, TrendingUp, Info } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BusinessesPage() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("All");

  const filters = ["All", "Hardware", "Retail", "Agro", "Service"];

  // Mock Data
  const businesses = [
    {
      id: 1,
      name: "Chivhu Hardware",
      sector: "Hardware",
      location: "Chivhu",
      riskScore: 8.5,
      capital: 1500,
      interest: 12,
      period: 45,
      image: "building" // Placeholder logic would go here
    },
    {
      id: 2,
      name: "Mbare Fresh Market",
      sector: "Retail",
      location: "Harare",
      riskScore: 7.2,
      capital: 500,
      interest: 15,
      period: 30,
      image: "vegetables"
    },
    {
      id: 3,
      name: "Mazowe Agro Supplies",
      sector: "Agro",
      location: "Mazowe",
      riskScore: 9.0,
      capital: 3000,
      interest: 10,
      period: 60,
      image: "tractor"
    }
  ];

  return (
    <div className="space-y-6 pb-20 min-h-screen bg-background">
      {/* Search & Filters */}
      <div className="space-y-4 sticky top-0 bg-background z-10 pt-2 pb-2">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search businesses..." 
            className="pl-9 bg-secondary/50 border-border/60"
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {filters.map(f => (
            <Button 
              key={f}
              variant={activeFilter === f ? "default" : "outline"} 
              size="sm" 
              className="rounded-full px-4 h-8 text-xs flex-shrink-0"
              onClick={() => setActiveFilter(f)}
            >
              {f}
            </Button>
          ))}
        </div>
      </div>

      {/* Business List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {businesses.map((biz) => (
          <Card 
            key={biz.id} 
            className="overflow-hidden shadow-premium hover:shadow-premium-hover transition-premium border-border/60 cursor-pointer group"
            onClick={() => router.push(`/businesses/${biz.id}`)} // Assuming this route exists or will handle it
          >
            {/* Placeholder Image Area */}
            <div className="h-32 bg-secondary w-full flex items-center justify-center relative">
              <TrendingUp className="h-10 w-10 text-muted-foreground/20" />
              <Badge className={`absolute top-3 right-3 ${biz.riskScore >= 8 ? 'bg-success' : biz.riskScore >= 6 ? 'bg-warning' : 'bg-destructive'}`}>
                Score: {biz.riskScore}/10
              </Badge>
            </div>

            <CardContent className="p-4 space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-lg leading-tight">{biz.name}</h3>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <Badge variant="secondary" className="text-[10px] h-5 px-1.5 rounded-md">{biz.sector}</Badge>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    <span>{biz.location}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/50">
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Capital</span>
                  <p className="text-number font-semibold text-foreground">${biz.capital}</p>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Interest</span>
                  <p className="text-number font-semibold text-success">{biz.interest}%</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Term</span>
                  <p className="text-number font-semibold text-foreground">{biz.period}d</p>
                </div>
              </div>
              
              <Button className="w-full bg-secondary text-primary hover:bg-secondary/80 h-9 text-sm font-medium mt-1">
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

       {/* Floating Filter Button */}
       <Button
        className="fixed bottom-20 right-6 h-12 w-12 rounded-full shadow-premium p-0 bg-white text-foreground hover:bg-gray-50 z-50 border border-border"
        // onClick={() => openFilterModal()}
      >
        <Filter className="h-5 w-5" />
      </Button>
    </div>
  );
}