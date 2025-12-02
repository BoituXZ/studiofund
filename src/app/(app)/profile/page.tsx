import { ChevronRight, LogOut } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockUser } from "@/lib/mock-data";

const menuItems = [
  { label: "Personal Information", href: "/profile/personal" },
  { label: "Notifications", href: "/profile/notifications" },
  { label: "Payment Methods", href: "/profile/payment" },
  { label: "Security", href: "/profile/security" },
  { label: "Help & Support", href: "/profile/help" },
  { label: "Terms & Conditions", href: "/profile/terms" },
];

export default function ProfilePage() {
  const userInitials = `${mockUser.firstName.charAt(0)}${mockUser.lastName.charAt(0)}`;

  return (
    <div className="space-y-6">
      <Card className="bg-primary text-primary-foreground">
        <CardContent className="p-6 flex items-center gap-4">
          <Avatar className="h-20 w-20 border-2 border-primary-foreground/50">
            {mockUser.avatarUrl && <AvatarImage src={mockUser.avatarUrl} alt={mockUser.firstName} />}
            <AvatarFallback className="text-2xl bg-primary-foreground text-primary">{userInitials}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold font-headline">{mockUser.firstName} {mockUser.lastName}</h1>
            <p className="text-primary-foreground/80">{mockUser.phone}</p>
            <p className="text-xs text-primary-foreground/60 mt-1">Member since {mockUser.memberSince}</p>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Groups</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-2xl font-bold">3</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Saved</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-2xl font-bold">$1,580.00</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-2xl font-bold">$215.50</p>
            </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-2">
            <ul className="divide-y">
                {menuItems.map(item => (
                    <li key={item.href}>
                        <Link href={item.href} className="flex items-center justify-between p-4 hover:bg-secondary rounded-lg transition-colors">
                            <span className="font-medium">{item.label}</span>
                            <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        </Link>
                    </li>
                ))}
            </ul>
        </CardContent>
      </Card>
      
      <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10">
        <LogOut className="h-5 w-5 mr-2" />
        Logout
      </Button>

    </div>
  );
}
