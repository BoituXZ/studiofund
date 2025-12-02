import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { mockBusinesses } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Search, SlidersHorizontal, MapPin } from "lucide-react";
import Image from "next/image";

function RiskScoreBar({ score }: { score: number }) {
  // Risk score: higher is better (green), lower is worse (red)
  const percentage = score * 10;
  const getGradient = () => {
    if (score >= 7) return "from-success to-success";
    if (score >= 5) return "from-warning to-warning";
    return "from-destructive to-destructive";
  };

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-body-sm font-medium text-foreground">Risk Score</span>
        <span className="text-body-sm font-semibold text-foreground font-mono">{score.toFixed(1)}/10</span>
      </div>
      <div className="w-full bg-muted rounded-full h-1">
        <div
          className={cn("h-1 rounded-full bg-gradient-to-r", getGradient())}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export default function BusinessesPage() {
    return (
        <div className="space-y-6 pb-20">
            {/* Search Bar with Integrated Filter */}
            <div className="space-y-4">
                <div className="relative">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                        placeholder="Search businesses..."
                        className="pl-14 pr-20 h-12 rounded-full bg-surface text-body"
                    />
                    <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-primary hover:bg-transparent"
                    >
                        <SlidersHorizontal className="h-4 w-4 mr-1.5" />
                        Filter
                    </Button>
                </div>
            </div>

            {/* Business Cards Grid */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {mockBusinesses.map(business => (
                    <Card key={business.id} className="overflow-hidden group cursor-pointer">
                        {/* Image Section */}
                        <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5">
                            <Image
                                src={business.imageUrl}
                                alt={business.name}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                data-ai-hint={business.imageHint}
                            />
                            {/* Sector Badge - Absolute positioned */}
                            <div className="absolute top-3 right-3">
                                <Badge variant="secondary" className="backdrop-blur-md bg-background/90 shadow-sm">
                                    {business.sector}
                                </Badge>
                            </div>
                        </div>

                        {/* Content Section */}
                        <CardContent className="p-4 space-y-3">
                            {/* Business Name and Location */}
                            <div className="space-y-1">
                                <h3 className="text-body-lg font-semibold text-foreground leading-tight">
                                    {business.name}
                                </h3>
                                <div className="flex items-center gap-1.5 text-body-sm text-muted-foreground">
                                    <MapPin className="h-3.5 w-3.5" />
                                    <span>{business.location}</span>
                                </div>
                            </div>

                            {/* Risk Score Bar */}
                            <RiskScoreBar score={business.riskScore} />

                            {/* Financial Info */}
                            <div className="grid grid-cols-3 gap-3 pt-2 border-t border-border/50">
                                <div>
                                    <p className="text-caption text-muted-foreground mb-0.5">Capital</p>
                                    <p className="text-body font-semibold text-foreground font-mono">
                                        ${(business.capitalNeeded / 1000).toFixed(0)}k
                                    </p>
                                </div>
                                <div>
                                    <p className="text-caption text-muted-foreground mb-0.5">Return</p>
                                    <p className="text-body font-semibold text-success font-mono">
                                        {business.interestRate}%
                                    </p>
                                </div>
                                <div>
                                    <p className="text-caption text-muted-foreground mb-0.5">Period</p>
                                    <p className="text-body font-semibold text-foreground">
                                        {business.repaymentPeriod}d
                                    </p>
                                </div>
                            </div>

                            {/* Action Button */}
                            <Button variant="ghost" className="w-full justify-between group-hover:bg-primary/[0.08] text-primary" size="sm">
                                <span>View Details</span>
                                <span>→</span>
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
