import Image from "next/image";
import Link from "next/link";
import { Plus, Search } from "lucide-react";

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
import { mockGroups } from "@/lib/mock-data";
import { PlaceHolderImages } from "@/lib/placeholder-images";

// Set to true to see the empty state
const hasGroups = true;

export default function GroupsPage() {
  const emptyStateImage = PlaceHolderImages.find(
    (img) => img.id === "empty-state-groups"
  );

  if (!hasGroups) {
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
          <Input placeholder="Search your groups..." className="pl-10" />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" className="bg-primary text-primary-foreground">All</Button>
          <Button variant="outline">Admin</Button>
          <Button variant="outline">Member</Button>
        </div>
      </div>

      <div className="space-y-4">
        {mockGroups.map((group) => (
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
                        ${group.poolBalance.toLocaleString()}
                      </p>
                    </div>
                    <div className="w-full sm:w-48">
                      <p className="text-sm text-muted-foreground mb-1">
                        Your Contribution: ${group.yourContribution.paid} / ${group.yourContribution.total}
                      </p>
                      <Progress value={(group.yourContribution.paid / group.yourContribution.total) * 100} />
                    </div>
                  </div>
                </CardContent>
              </div>
            </Link>
             <CardFooter className="bg-muted/50 py-2 px-6 text-sm text-muted-foreground justify-between">
              <span>{group.members} members</span>
              <span className="hidden sm:block">Tap to view details &rarr;</span>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Button asChild className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 rounded-full w-14 h-14 shadow-lg" style={{ backgroundColor: "hsl(var(--accent))" }}>
         <Link href="/groups/create">
            <Plus className="h-6 w-6" />
            <span className="sr-only">Create Group</span>
        </Link>
      </Button>
    </div>
  );
}
