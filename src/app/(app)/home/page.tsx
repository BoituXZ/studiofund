"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  PlusCircle,
  Store,
  Tag,
  Users,
  Loader2,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { groupsApi, type Group } from "@/lib/api/groups";
import { useAuth } from "@/contexts/auth-context";

export default function HomePage() {
  const { user } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      setIsLoading(true);
      const data = await groupsApi.getAll();
      setGroups(data);
    } catch (error) {
      console.error("Failed to load groups:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const totalBalance = groups.reduce((acc, group) => acc + (group.poolBalance || 0), 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-primary text-primary-foreground">
        <CardHeader>
          <CardTitle>Welcome back, {user?.firstName || 'User'}!</CardTitle>
          <CardDescription className="text-primary-foreground/80">
            Across {groups.length} {groups.length === 1 ? 'group' : 'groups'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">Total Balance</p>
          <p className="text-4xl font-bold font-headline">
            ${totalBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Groups</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{groups.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Invested</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${groups.reduce((acc, g) => acc + (g.pool?.investedAmount ? Number(g.pool.investedAmount) : 0), 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Available Discounts</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground mt-1">Coming soon</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {groups.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No recent activity</p>
            ) : (
              <ul className="space-y-4">
                <li className="text-center text-muted-foreground py-4">
                  <p className="text-sm">Activity feed coming soon</p>
                </li>
              </ul>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" disabled>View All</Button>
          </CardFooter>
        </Card>

        <div className="lg:col-span-3 space-y-6">
            <Card className="bg-accent text-accent-foreground hover:bg-accent/90 transition-colors">
                <Link href="/groups/create" className="block p-6">
                    <CardHeader className="p-0">
                        <PlusCircle className="h-8 w-8 mb-2" />
                        <CardTitle>Create a Group</CardTitle>
                        <CardDescription className="text-accent-foreground/80">Start saving with your community</CardDescription>
                    </CardHeader>
                </Link>
            </Card>
            <Card className="hover:bg-secondary transition-colors">
                <Link href="/businesses" className="block p-6">
                    <CardHeader className="p-0">
                        <Store className="h-8 w-8 mb-2" />
                        <CardTitle>Browse Businesses</CardTitle>
                        <CardDescription>Discover investment opportunities</CardDescription>
                    </CardHeader>
                </Link>
            </Card>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold font-headline mb-4">Your Groups</h2>
        {groups.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">You haven't joined any groups yet</p>
              <Button asChild>
                <Link href="/groups/create">Create Your First Group</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="relative">
            <div className="flex space-x-4 overflow-x-auto pb-4 -mb-4">
              {groups.map((group) => (
                <Card key={group.id} className="min-w-[300px] flex-shrink-0">
                  <CardHeader>
                    <CardTitle>{group.name}</CardTitle>
                    <Badge variant={group.role === 'Admin' ? 'default' : 'secondary'} className={group.role === 'Admin' ? 'bg-accent text-accent-foreground' : ''}>{group.role}</Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Pool Balance</p>
                    <p className="text-2xl font-bold font-headline">
                      ${(group.poolBalance || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      {typeof group.members === 'number' ? group.members : group.memberCount || 0} members
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button asChild variant="secondary" className="w-full">
                      <Link href={`/groups/${group.id}`}>View Details</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
