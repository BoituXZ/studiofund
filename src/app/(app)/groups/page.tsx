"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Search, Loader2, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { groupsApi, type Group } from "@/lib/api/groups";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState<"all" | "Admin" | "Member">("all");
  const { toast } = useToast();

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
      <Card className="border-dashed">
        <CardContent className="py-16 text-center">
          <div className="flex flex-col items-center gap-4">
            <Users className="h-16 w-16 text-muted-foreground" />
            <div>
              <h2 className="text-heading-1 font-semibold text-foreground mb-2">
                No groups yet
              </h2>
              <p className="text-body text-muted-foreground max-w-xs mx-auto mb-6">
                Create your first group to start saving and investing with your community
              </p>
            </div>
            <Button asChild size="lg">
              <Link href="/groups/create">Create Your First Group</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Search and Filter */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search your groups..."
            className="pl-14 h-12 rounded-full bg-surface"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <Button
            variant={filterRole === "all" ? "default" : "secondary"}
            size="sm"
            onClick={() => setFilterRole("all")}
            className="rounded-full whitespace-nowrap"
          >
            All Groups
          </Button>
          <Button
            variant={filterRole === "Admin" ? "default" : "secondary"}
            size="sm"
            onClick={() => setFilterRole("Admin")}
            className="rounded-full whitespace-nowrap"
          >
            Admin
          </Button>
          <Button
            variant={filterRole === "Member" ? "default" : "secondary"}
            size="sm"
            onClick={() => setFilterRole("Member")}
            className="rounded-full whitespace-nowrap"
          >
            Member
          </Button>
        </div>
      </div>

      {/* Groups List */}
      {filteredGroups.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <p className="text-body text-muted-foreground">
              No groups found matching your search.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredGroups.map((group) => (
            <Link key={group.id} href={`/groups/${group.id}`}>
              <Card className="group cursor-pointer hover:-translate-y-1">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-body-lg font-semibold">
                      {group.name}
                    </CardTitle>
                    <Badge variant={group.role === 'Admin' ? 'default' : 'secondary'}>
                      {group.role}
                    </Badge>
                  </div>
                  {group.description && (
                    <p className="text-body-sm text-muted-foreground line-clamp-2 mt-1">
                      {group.description}
                    </p>
                  )}
                </CardHeader>

                <CardContent className="space-y-3">
                  {/* Pool Balance */}
                  <div>
                    <p className="text-body-sm text-muted-foreground mb-1">
                      Pool Balance
                    </p>
                    <p className="text-number-md text-foreground font-mono">
                      ${(group.poolBalance || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>

                  {/* Your Contribution Progress */}
                  {group.yourContribution && (
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <p className="text-body-sm text-muted-foreground">
                          Your Contribution
                        </p>
                        <p className="text-body-sm font-semibold font-mono text-foreground">
                          ${group.yourContribution.paid} / ${group.yourContribution.total}
                        </p>
                      </div>
                      <Progress
                        value={(group.yourContribution.paid / group.yourContribution.total) * 100}
                        className="h-2"
                      />
                    </div>
                  )}

                  {/* Members Count */}
                  <div className="flex items-center gap-2 text-body-sm text-muted-foreground pt-2 border-t border-border/50">
                    <Users className="h-4 w-4" />
                    <span>{typeof group.members === 'number' ? group.members : group.memberCount || 0} members</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Floating Action Button (FAB) */}
      <Link
        href="/groups/create"
        className="fixed bottom-20 right-6 md:bottom-8 md:right-8 z-40 w-14 h-14 bg-primary hover:bg-primary-hover text-primary-foreground rounded-full shadow-[0_8px_16px_rgba(0,61,165,0.24)] hover:shadow-[0_12px_24px_rgba(0,61,165,0.32)] flex items-center justify-center transition-premium tap-feedback"
      >
        <Plus className="h-6 w-6" />
        <span className="sr-only">Create Group</span>
      </Link>
    </div>
  );
}
