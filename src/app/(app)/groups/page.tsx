"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Search, Loader2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { groupsApi, type Group } from "@/lib/api/groups";
import { useToast } from "@/hooks/use-toast";

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState<"all" | "Admin" | "Member">("all");
  const { toast } = useToast();

  const emptyStateImage = PlaceHolderImages.find(
    (img) => img.id === "empty-state-groups"
  );

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      setIsLoading(true);
      const data = await groupsApi.getAll();
      setGroups(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load groups",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredGroups = groups.filter((group) => {
    const matchesSearch = group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === "all" || group.role === filterRole;
    return matchesSearch && matchesRole;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (groups.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16">
        {emptyStateImage && (
          <Image
            src={emptyStateImage.imageUrl}
            alt="No groups illustration"
            width={200}
            height={150}
            className="mb-6"
            data-ai-hint={emptyStateImage.imageHint}
          />
        )}
        <h2 className="text-2xl font-bold font-headline">
          You haven't joined any groups yet
        </h2>
        <p className="mt-2 text-muted-foreground">
          Create a new group or wait for an invitation.
        </p>
        <Button asChild className="mt-6" style={{ backgroundColor: "hsl(var(--accent))", color: "hsl(var(--accent-foreground))" }}>
          <Link href="/groups/create">Create Group</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search your groups..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant={filterRole === "all" ? "secondary" : "outline"}
            className={filterRole === "all" ? "bg-primary text-primary-foreground" : ""}
            onClick={() => setFilterRole("all")}
          >
            All
          </Button>
          <Button 
            variant={filterRole === "Admin" ? "secondary" : "outline"}
            className={filterRole === "Admin" ? "bg-primary text-primary-foreground" : ""}
            onClick={() => setFilterRole("Admin")}
          >
            Admin
          </Button>
          <Button 
            variant={filterRole === "Member" ? "secondary" : "outline"}
            className={filterRole === "Member" ? "bg-primary text-primary-foreground" : ""}
            onClick={() => setFilterRole("Member")}
          >
            Member
          </Button>
        </div>
      </div>

      {filteredGroups.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>No groups found matching your search.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredGroups.map((group) => (
            <Card key={group.id} className="overflow-hidden">
              <Link href={`/groups/${group.id}`}>
                <div className="hover:bg-secondary/50 transition-colors">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle>{group.name}</CardTitle>
                      <Badge variant={group.role === 'Admin' ? 'default' : 'secondary'} className={group.role === 'Admin' ? 'bg-accent text-accent-foreground' : 'bg-secondary text-secondary-foreground'}>
                        {group.role}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Pool Balance</p>
                        <p className="text-xl font-bold font-headline">
                          ${(group.poolBalance || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                      </div>
                      {group.yourContribution && (
                        <div className="w-full sm:w-48">
                          <p className="text-sm text-muted-foreground mb-1">
                            Your Contribution: ${group.yourContribution.paid} / ${group.yourContribution.total}
                          </p>
                          <Progress value={(group.yourContribution.paid / group.yourContribution.total) * 100} />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </div>
              </Link>
              <CardFooter className="bg-muted/50 py-2 px-6 text-sm text-muted-foreground justify-between">
                <span>{typeof group.members === 'number' ? group.members : group.memberCount || 0} members</span>
                <span className="hidden sm:block">Tap to view details &rarr;</span>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Button asChild className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 rounded-full w-14 h-14 shadow-lg" style={{ backgroundColor: "hsl(var(--accent))" }}>
         <Link href="/groups/create">
            <Plus className="h-6 w-6" />
            <span className="sr-only">Create Group</span>
        </Link>
      </Button>
    </div>
  );
}
