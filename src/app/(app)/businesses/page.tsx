import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { mockBusinesses } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { ChevronDown, Filter, Search } from "lucide-react";
import Image from "next/image";

const filters = ["All", "Hardware", "Retail", "Agro Dealer", "Pharmacy", "Salon"];

function RiskScoreBar({ score }: { score: number }) {
  const color =
    score >= 7
      ? "bg-green-500"
      : score >= 5
      ? "bg-yellow-500"
      : "bg-red-500";

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium">Risk Score</span>
        <span className="text-sm font-bold">{score.toFixed(1)}/10</span>
      </div>
      <div className="w-full bg-muted rounded-full h-2">
        <div
          className={cn("h-2 rounded-full", color)}
          style={{ width: `${score * 10}%` }}
        />
      </div>
    </div>
  );
}


export default function BusinessesPage() {
    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search businesses..." className="pl-10" />
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 -mb-2">
                        {filters.map((filter, index) => (
                            <Button key={filter} variant={index === 0 ? "secondary" : "outline"} className={`whitespace-nowrap ${index === 0 ? 'bg-primary text-primary-foreground' : ''}`}>
                                {filter}
                            </Button>
                        ))}
                    </div>
                     <Button variant="ghost" className="hidden sm:inline-flex">
                        <Filter className="h-4 w-4 mr-2" />
                        Filters
                    </Button>
                </div>
                <div>
                     <Button variant="outline" className="w-full sm:w-auto justify-between">
                        Sort by: Risk Score (High to Low)
                        <ChevronDown className="h-4 w-4 ml-2" />
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {mockBusinesses.map(business => (
                    <Card key={business.id}>
                        <CardHeader className="p-0">
                             <div className="relative aspect-video">
                                <Image
                                src={business.imageUrl}
                                alt={business.name}
                                fill
                                className="object-cover rounded-t-lg"
                                data-ai-hint={business.imageHint}
                                />
                             </div>
                        </CardHeader>
                        <CardContent className="p-4 space-y-4">
                            <div className="space-y-1">
                                <CardTitle className="font-headline">{business.name}</CardTitle>
                                <div className="flex items-center gap-2">
                                    <Badge variant="secondary">{business.sector}</Badge>
                                    <span className="text-sm text-muted-foreground">{business.location}</span>
                                </div>
                            </div>
                            
                            <RiskScoreBar score={business.riskScore} />
                            
                            <div className="grid grid-cols-2 gap-4 text-sm pt-2">
                                <div>
                                    <p className="text-muted-foreground">Capital Needed</p>
                                    <p className="font-medium">${business.capitalNeeded.toLocaleString()}</p>
                                </div>
                                 <div>
                                    <p className="text-muted-foreground">Interest Rate</p>
                                    <p className="font-medium">{business.interestRate}%</p>
                                </div>
                            </div>
                            
                            <Button className="w-full">View Details</Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
