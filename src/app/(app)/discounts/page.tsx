import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { mockDiscounts } from "@/lib/mock-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tag } from "lucide-react";

export default function DiscountsPage() {
    return (
        <div className="space-y-6 pb-20">
            <div>
                <h1 className="text-heading-1 font-semibold mb-2">Available Discounts</h1>
                <p className="text-body text-muted-foreground">Save at businesses you've invested in</p>
            </div>

            <Tabs defaultValue="available">
                <TabsList className="grid w-full grid-cols-3 bg-surface p-1 h-auto rounded-xl">
                    <TabsTrigger value="available" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                        Available
                    </TabsTrigger>
                    <TabsTrigger value="used" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                        Used
                    </TabsTrigger>
                    <TabsTrigger value="expired" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                        Expired
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="available" className="mt-6">
                     <div className="space-y-3">
                        {mockDiscounts.map(discount => (
                            <Card
                                key={discount.id}
                                className="border-l-[3px] border-l-success border-t-0 border-r-0 border-b-0"
                            >
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-4">
                                        {/* Left Section - Business Info (70%) */}
                                        <div className="flex-1 flex items-center gap-3">
                                            <Avatar className="h-10 w-10 rounded-lg">
                                                <AvatarImage src={discount.businessLogoUrl} alt={discount.businessName} />
                                                <AvatarFallback className="rounded-lg bg-primary/10 text-primary font-semibold">
                                                    {discount.businessName.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-body font-semibold text-foreground truncate">
                                                    {discount.businessName}
                                                </p>
                                                <p className="text-body-sm text-muted-foreground line-clamp-1">
                                                    {discount.description}
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    Valid until: {discount.validUntil}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Right Section - Discount Badge (30%) */}
                                        <div className="flex flex-col items-end gap-2">
                                            <div className="bg-primary/[0.06] rounded-xl px-4 py-3 text-center">
                                                <p className="text-heading-2 font-bold text-primary whitespace-nowrap">
                                                    {discount.discount}
                                                </p>
                                            </div>
                                            <Badge variant="success" className="text-[10px]">
                                                ACTIVE
                                            </Badge>
                                        </div>
                                    </div>

                                    {/* Redeem Button */}
                                    <Button
                                        variant="outline"
                                        className="w-full mt-4 h-11"
                                    >
                                        Redeem Discount
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="used" className="mt-6">
                    <Card className="border-dashed">
                        <CardContent className="py-16 text-center">
                            <div className="flex flex-col items-center gap-4">
                                <Tag className="h-16 w-16 text-muted-foreground" />
                                <div>
                                    <p className="text-heading-3 font-semibold text-foreground mb-2">
                                        No used discounts
                                    </p>
                                    <p className="text-body text-muted-foreground max-w-xs mx-auto">
                                        Start redeeming discounts at businesses you've invested in
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="expired" className="mt-6">
                    <Card className="border-dashed">
                        <CardContent className="py-16 text-center">
                            <div className="flex flex-col items-center gap-4">
                                <Tag className="h-16 w-16 text-muted-foreground" />
                                <div>
                                    <p className="text-heading-3 font-semibold text-foreground mb-2">
                                        No expired discounts
                                    </p>
                                    <p className="text-body text-muted-foreground max-w-xs mx-auto">
                                        Your expired discounts will appear here
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
