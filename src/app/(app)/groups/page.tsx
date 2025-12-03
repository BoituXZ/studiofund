"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function GroupsPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<"all" | "admin" | "member">("all");

  // Mock Data
  const groups = [
    { 
      id: 1, 
      name: "Mbare Vendors", 
      role: "admin", 
      balance: 540.00, 
      members: 15, 
      contribution: { paid: 20, total: 20 },
      nextDue: "15 Dec"
    },
    { 
      id: 2, 
      name: "Family Savings", 
      role: "member", 
      balance: 1200.00, 
      members: 6, 
      contribution: { paid: 50, total: 50 },
      nextDue: "01 Jan"
    },
    { 
      id: 3, 
      name: "Church Building Fund", 
      role: "member", 
      balance: 890.50, 
      members: 24, 
      contribution: { paid: 0, total: 10 }, // Behind
      nextDue: "05 Dec"
    },
  ];

  const filteredGroups = groups.filter(g => {
    if (filter === "all") return true;
    return g.role === filter;
  });

  return (
    <div className="space-y-6 pb-20 min-h-screen bg-background">
      {/* Header & Search */}
      <div className="space-y-4 sticky top-0 bg-background z-10 pt-2 pb-2">
        <div className="relative">
          <Input
            placeholder="Search your groups..."
            className="bg-secondary/50 border-border/60 focus:bg-white transition-colors"
          />
        </div>
        
        {/* Filter Chips */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <Button 
            variant={filter === "all" ? "default" : "outline"} 
            size="sm" 
            className="rounded-full px-4 h-8 text-xs"
            onClick={() => setFilter("all")}
          >
            All
          </Button>
          <Button 
            variant={filter === "admin" ? "default" : "outline"} 
            size="sm" 
            className="rounded-full px-4 h-8 text-xs"
            onClick={() => setFilter("admin")}
          >
            Admin
          </Button>
          <Button 
            variant={filter === "member" ? "default" : "outline"} 
            size="sm" 
            className="rounded-full px-4 h-8 text-xs"
            onClick={() => setFilter("member")}
          >
            Member
          </Button>
        </div>
      </div>

      {/* Groups List */}
      <div className="space-y-4">
        {filteredGroups.length > 0 ? (
          filteredGroups.map((group) => (
            <Card 
              key={group.id} 
              className="shadow-premium hover:shadow-premium-hover transition-premium border-border/60 cursor-pointer active:scale-[0.98]"
              onClick={() => router.push(`/groups/${group.id}`)}
            >
              <CardContent className="p-5 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg text-foreground">{group.name}</h3>
                    <div className="text-sm text-muted-foreground mt-0.5">
                      <span>{group.members} members</span>
                    </div>
                  </div>
                  <Badge variant={group.role === 'admin' ? 'secondary' : 'outline'} className="uppercase text-[10px] font-bold tracking-wide">
                    {group.role}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 py-2">
                  <div>
                    <span className="text-xs text-muted-foreground font-medium uppercase">Pool Balance</span>
                    <p className="text-number text-lg font-bold text-primary">${group.balance.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                     <span className="text-xs text-muted-foreground font-medium uppercase">Next Due</span>
                     <p className="text-number text-sm font-semibold">{group.nextDue}</p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Your contribution</span>
                    <span className={group.contribution.paid < group.contribution.total ? "text-warning font-medium" : "text-success font-medium"}>
                      ${group.contribution.paid} / ${group.contribution.total}
                    </span>
                  </div>
                  <Progress 
                    value={(group.contribution.paid / group.contribution.total) * 100} 
                    className="h-2" 
                    // color handled by CSS variables, but we can conditionally style the indicator if needed
                  />
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center space-y-4 opacity-80">
            <div className="space-y-1">
              <h3 className="font-semibold text-lg">No groups found</h3>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                You haven't joined any groups matching this filter.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <Button
        className="fixed bottom-20 right-6 rounded-full shadow-premium-lg px-6 py-3 bg-secondary text-secondary-foreground hover:bg-secondary/90 z-50 border-2 border-primary/10 font-medium"
        onClick={() => router.push('/groups/create')}
      >
        Create Group
      </Button>
    </div>
  );
}