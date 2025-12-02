"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Users,
  UserCheck,
  UserX,
  Shield,
  ShieldCheck,
  Search,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { adminApi, type AdminUser } from "@/lib/api/admin";
import { useToast } from "@/hooks/use-toast";

export default function AdminUsersPage() {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>(
    searchParams.get("status") || "all"
  );
  const [roleFilter, setRoleFilter] = useState<string>("all");

  useEffect(() => {
    loadUsers();
  }, [statusFilter, roleFilter]);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      // Note: This will need backend endpoint implementation
      // For now, showing placeholder
      const status = statusFilter === "all" ? undefined : statusFilter;
      const role = roleFilter === "all" ? undefined : roleFilter;
      const data = await adminApi.getUsers(status, role);
      setUsers(data);
    } catch (error: any) {
      // For now, show empty state since endpoint doesn't exist
      setUsers([]);
      console.warn("Admin users endpoint not implemented:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: AdminUser["status"]) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      ACTIVE: "default",
      SUSPENDED: "destructive",
      INACTIVE: "secondary",
    };
    return variants[status] || "outline";
  };

  const getRoleBadge = (role: AdminUser["role"]) => {
    if (role === "PLATFORM_ADMIN") {
      return <Badge variant="default" className="bg-purple-600">Platform Admin</Badge>;
    }
    if (role === "GROUP_ADMIN") {
      return <Badge variant="secondary">Group Admin</Badge>;
    }
    return <Badge variant="outline">Member</Badge>;
  };

  const filteredUsers = users.filter((user) =>
    user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.phone.includes(searchQuery) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">User Management</h1>
        <p className="text-muted-foreground">Manage platform users and their access</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="SUSPENDED">Suspended</SelectItem>
            <SelectItem value="INACTIVE">Inactive</SelectItem>
          </SelectContent>
        </Select>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="MEMBER">Member</SelectItem>
            <SelectItem value="GROUP_ADMIN">Group Admin</SelectItem>
            <SelectItem value="PLATFORM_ADMIN">Platform Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {users.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-2">No users found</p>
            <p className="text-sm text-muted-foreground">
              User management endpoints need to be implemented in the backend
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredUsers.map((user) => (
            <Card key={user.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>
                      {user.firstName} {user.lastName}
                    </CardTitle>
                    <CardDescription>{user.phone}</CardDescription>
                    {user.email && (
                      <CardDescription>{user.email}</CardDescription>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    {getRoleBadge(user.role)}
                    <Badge variant={getStatusBadge(user.status)}>
                      {user.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Verification</p>
                    <p className="font-medium">
                      {user.isVerified ? (
                        <span className="flex items-center gap-1 text-green-600">
                          <UserCheck className="h-4 w-4" />
                          Verified
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <UserX className="h-4 w-4" />
                          Not Verified
                        </span>
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Joined</p>
                    <p className="font-medium">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Last Login</p>
                    <p className="font-medium">
                      {user.lastLoginAt
                        ? new Date(user.lastLoginAt).toLocaleDateString()
                        : "Never"}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  {user.status === "ACTIVE" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={async () => {
                        try {
                          await adminApi.updateUserStatus(user.id, "SUSPENDED");
                          toast({
                            title: "Success",
                            description: "User suspended successfully",
                          });
                          loadUsers();
                        } catch (error: any) {
                          toast({
                            title: "Error",
                            description: error.message || "Failed to suspend user",
                            variant: "destructive",
                          });
                        }
                      }}
                    >
                      <UserX className="h-4 w-4 mr-2" />
                      Suspend
                    </Button>
                  )}
                  {user.status === "SUSPENDED" && (
                    <Button
                      size="sm"
                      onClick={async () => {
                        try {
                          await adminApi.updateUserStatus(user.id, "ACTIVE");
                          toast({
                            title: "Success",
                            description: "User activated successfully",
                          });
                          loadUsers();
                        } catch (error: any) {
                          toast({
                            title: "Error",
                            description: error.message || "Failed to activate user",
                            variant: "destructive",
                          });
                        }
                      }}
                    >
                      <UserCheck className="h-4 w-4 mr-2" />
                      Activate
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

