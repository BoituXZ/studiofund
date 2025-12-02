import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockDiscounts } from "@/lib/mock-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function DiscountsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold font-headline">Available Discounts</h1>
                <p className="text-muted-foreground">Save at businesses you&apos;ve invested in</p>
            </div>
            <Tabs defaultValue="available">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="available">Available</TabsTrigger>
                    <TabsTrigger value="used">Used</TabsTrigger>
                    <TabsTrigger value="expired">Expired</TabsTrigger>
                </TabsList>
                <TabsContent value="available" className="mt-6">
                     <div className="space-y-4">
                        {mockDiscounts.map(discount => (
                            <Card key={discount.id}>
                                <CardContent className="p-4 flex items-center gap-4">
                                    <Avatar className="h-16 w-16">
                                        <AvatarImage src={discount.businessLogoUrl} alt={discount.businessName} />
                                        <AvatarFallback>{discount.businessName.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 space-y-1">
                                        <p className="font-semibold">{discount.businessName}</p>
                                        <p className="text-2xl font-bold text-accent font-headline">{discount.discount}</p>
                                        <p className="text-sm text-muted-foreground">{discount.description}</p>
                                        <p className="text-xs text-muted-foreground">Valid until: {discount.validUntil}</p>
                                    </div>
                                    <Button>View Details</Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
                <TabsContent value="used">
                    <div className="text-center py-16 text-muted-foreground">
                        <p>You haven&apos;t used any discounts yet.</p>
                    </div>
                </TabsContent>
                <TabsContent value="expired">
                    <div className="text-center py-16 text-muted-foreground">
                        <p>No expired discounts.</p>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
