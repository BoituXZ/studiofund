"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Users, DollarSign, TrendingUp, Loader2, UserPlus, Plus, Settings } from "lucide-react";
import { format } from "date-fns";

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
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { groupsApi, type Group, type GroupMember, type PoolTransaction } from "@/lib/api/groups";
import { useToast } from "@/hooks/use-toast";
import { InviteMemberDialog } from "@/components/groups/invite-member-dialog";
import { ContributeDialog } from "@/components/groups/contribute-dialog";
import { useAuth } from "@/contexts/auth-context";

interface GroupDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function GroupDetailsPage({ params }: GroupDetailsPageProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  const resolvedParams = use(params);
  const [group, setGroup] = useState<Group | null>(null);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [transactions, setTransactions] = useState<PoolTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [isContributeDialogOpen, setIsContributeDialogOpen] = useState(false);

  useEffect(() => {
    loadGroupData();
  }, [resolvedParams.id]);

  const loadGroupData = async () => {
    try {
      setIsLoading(true);
      const [groupData, membersData, transactionsData] = await Promise.all([
        groupsApi.getById(resolvedParams.id),
        groupsApi.getMembers(resolvedParams.id),
        groupsApi.getPoolTransactions(resolvedParams.id, 1, 50),
      ]);
      
      setGroup(groupData);
      setMembers(membersData);
      setTransactions(transactionsData.transactions);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load group details",
        variant: "destructive",
      });
      if (error.statusCode === 404 || error.statusCode === 403) {
        router.push("/groups");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInviteSuccess = () => {
    loadGroupData(); // Reload members
  };

  const handleContributeSuccess = () => {
    loadGroupData(); // Reload group data and transactions
  };

  const isAdmin = group?.role === 'Admin';

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!group) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">Group not found</p>
        <Button asChild className="mt-4">
          <Link href="/groups">Back to Groups</Link>
        </Button>
      </div>
    );
  }

  const contributionProgress = group.yourContribution 
    ? (group.yourContribution.paid / group.yourContribution.total) * 100 
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/groups">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl font-bold font-headline">{group.name}</h1>
            <Badge variant={group.role === 'Admin' ? 'default' : 'secondary'} className={group.role === 'Admin' ? 'bg-accent text-accent-foreground' : ''}>
              {group.role}
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1">{group.description}</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsContributeDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Contribute
          </Button>
          {isAdmin && (
            <>
              <Button variant="outline" onClick={() => setIsInviteDialogOpen(true)}>
                <UserPlus className="h-4 w-4 mr-2" />
                Invite
              </Button>
              <Button variant="outline" asChild>
                <Link href={`/groups/${resolvedParams.id}/settings`}>
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pool Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline">
              ${group.poolBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{typeof group.members === 'number' ? group.members : group.memberCount || 0}</div>
          </CardContent>
        </Card>

        {group.yourContribution && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Your Contribution</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${group.yourContribution.paid} / ${group.yourContribution.total}
              </div>
              <Progress value={contributionProgress} className="mt-2" />
            </CardContent>
          </Card>
        )}
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Group Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Description</p>
                <p className="font-medium">{group.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total Members</p>
                  <p className="font-medium">{typeof group.members === 'number' ? group.members : group.memberCount || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pool Balance</p>
                  <p className="font-medium">${(group.poolBalance || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Monthly Contribution</p>
                  <p className="font-medium">${Number(group.monthlyContribution).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Contribution Day</p>
                  <p className="font-medium">Day {group.contributionDay}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {transactions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {transactions.slice(0, 5).map((tx) => (
                    <li key={tx.id} className="flex items-start gap-3">
                      <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                      <div className="flex-1">
                        <p className="text-sm">
                          {tx.type === 'CONTRIBUTION' 
                            ? `Contribution from ${tx.contribution?.member.user.firstName} ${tx.contribution?.member.user.lastName}`
                            : tx.type === 'INVESTMENT'
                            ? `Investment: ${tx.investment?.business.name || tx.description}`
                            : tx.description || tx.type}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(tx.createdAt), "MMM d, yyyy 'at' h:mm a")}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="members" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Group Members</CardTitle>
              <CardDescription>{members.length} members in this group</CardDescription>
            </CardHeader>
            <CardContent>
              {members.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No members found</p>
              ) : (
                <div className="space-y-4">
                  {members.map((member) => {
                    const memberName = member.user 
                      ? `${member.user.firstName} ${member.user.lastName}`
                      : "Unknown User";
                    const initials = member.user
                      ? `${member.user.firstName.charAt(0)}${member.user.lastName.charAt(0)}`
                      : "??";
                    const isCurrentUser = member.userId === user?.id;
                    const isPending = member.status === 'PENDING';
                    
                    return (
                      <div key={member.id} className="flex items-center justify-between p-3 rounded-lg border">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>{initials}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {memberName}
                              {isCurrentUser && <span className="text-xs text-muted-foreground ml-2">(You)</span>}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {member.role === 'ADMIN' ? 'Admin' : 'Member'} • {member.status}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {isPending && isCurrentUser && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={async () => {
                                  try {
                                    await groupsApi.acceptInvitation(resolvedParams.id, member.id, true);
                                    toast({
                                      title: "Success",
                                      description: "Invitation accepted!",
                                    });
                                    loadGroupData();
                                  } catch (error: any) {
                                    toast({
                                      title: "Error",
                                      description: error.message || "Failed to accept invitation",
                                      variant: "destructive",
                                    });
                                  }
                                }}
                              >
                                Accept
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={async () => {
                                  try {
                                    await groupsApi.acceptInvitation(resolvedParams.id, member.id, false);
                                    toast({
                                      title: "Success",
                                      description: "Invitation declined",
                                    });
                                    loadGroupData();
                                  } catch (error: any) {
                                    toast({
                                      title: "Error",
                                      description: error.message || "Failed to decline invitation",
                                      variant: "destructive",
                                    });
                                  }
                                }}
                              >
                                Decline
                              </Button>
                            </>
                          )}
                          {member.acceptedAt && (
                            <div className="text-right">
                              <p className="text-xs text-muted-foreground">
                                Joined {format(new Date(member.acceptedAt), "MMM yyyy")}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>All transactions for this group</CardDescription>
            </CardHeader>
            <CardContent>
              {transactions.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No transactions yet</p>
              ) : (
                <div className="space-y-4">
                  {transactions.map((tx) => {
                    const amount = Number(tx.amount);
                    const isNegative = amount < 0;
                    const description = tx.type === 'CONTRIBUTION'
                      ? `Contribution from ${tx.contribution?.member.user.firstName} ${tx.contribution?.member.user.lastName}`
                      : tx.type === 'INVESTMENT'
                      ? `Investment: ${tx.investment?.business.name || tx.description || 'Investment'}`
                      : tx.description || tx.type;
                    
                    return (
                      <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg border">
                        <div>
                          <p className="font-medium">{description}</p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(tx.createdAt), "MMM d, yyyy 'at' h:mm a")}
                          </p>
                        </div>
                        <div className={`text-right font-medium ${isNegative ? "text-destructive" : "text-green-600"}`}>
                          {!isNegative ? "+" : ""}${Math.abs(amount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle>Admin Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => setIsInviteDialogOpen(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Invite Members
            </Button>
            <Button variant="outline" asChild>
              <Link href={`/groups/${resolvedParams.id}/settings`}>
                <Settings className="h-4 w-4 mr-2" />
                Group Settings
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <InviteMemberDialog
        groupId={resolvedParams.id}
        open={isInviteDialogOpen}
        onOpenChange={setIsInviteDialogOpen}
        onSuccess={handleInviteSuccess}
      />

      {group && (
        <ContributeDialog
          groupId={resolvedParams.id}
          monthlyContribution={Number(group.monthlyContribution)}
          open={isContributeDialogOpen}
          onOpenChange={setIsContributeDialogOpen}
          onSuccess={handleContributeSuccess}
        />
      )}
    </div>
  );
}

