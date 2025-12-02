import Link from "next/link";
import {
  ArrowUpRight,
  PlusCircle,
  Store,
  Tag,
  Users,
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
import { mockUser, mockActivities, mockGroups } from "@/lib/mock-data";

export default function HomePage() {
  const totalBalance = mockGroups.reduce((acc, group) => acc + group.poolBalance, 0);

  return (
    <div className="space-y-6">
      <Card className="bg-primary text-primary-foreground">
        <CardHeader>
          <CardTitle>Welcome back, {mockUser.firstName}!</CardTitle>
          <CardDescription className="text-primary-foreground/80">
            Across {mockGroups.length} groups
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
            <div className="text-2xl font-bold">{mockGroups.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Invested</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$18,230.00</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Available Discounts</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {mockActivities.map((activity) => (
                <li key={activity.id} className="flex items-center gap-4">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback>{activity.description.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">View All</Button>
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
        <div className="relative">
          <div className="flex space-x-4 overflow-x-auto pb-4 -mb-4">
            {mockGroups.map((group) => (
              <Card key={group.id} className="min-w-[300px] flex-shrink-0">
                <CardHeader>
                  <CardTitle>{group.name}</CardTitle>
                  <Badge variant={group.role === 'Admin' ? 'default' : 'secondary'} className={group.role === 'Admin' ? 'bg-accent text-accent-foreground' : ''}>{group.role}</Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Pool Balance</p>
                  <p className="text-2xl font-bold font-headline">
                    ${group.poolBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">{group.members} members</p>
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
      </div>
    </div>
  );
}
