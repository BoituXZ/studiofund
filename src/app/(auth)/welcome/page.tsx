"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const onboardingSlides = [
  {
    id: "slide1",
    title: "Save Together",
    description: "Pool funds with your community for collective financial power.",
    imageId: "onboarding-save",
  },
  {
    id: "slide2",
    title: "Invest Locally",
    description: "Fund and support local businesses, growing your community's economy.",
    imageId: "onboarding-invest",
  },
  {
    id: "slide3",
    title: "Earn & Protect",
    description: "Generate returns from investments and get access to community-backed insurance.",
    imageId: "onboarding-earn",
  },
];

export default function WelcomePage() {
  const [api, setApi] = React.useState<any>();
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const getImage = (id: string) => {
    return PlaceHolderImages.find((img) => img.id === id);
  }

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <Carousel setApi={setApi} className="w-full max-w-lg">
        <CarouselContent>
          {onboardingSlides.map((slide) => {
            const imageData = getImage(slide.imageId);
            return (
            <CarouselItem key={slide.id}>
              <Card className="border-none shadow-none">
                <CardContent className="flex flex-col items-center justify-center p-0 aspect-video relative">
                  {imageData && (
                    <Image
                      src={imageData.imageUrl}
                      alt={slide.title}
                      fill
                      className="rounded-lg object-cover"
                      data-ai-hint={imageData.imageHint}
                    />
                  )}
                </CardContent>
              </Card>
              <div className="text-center mt-6">
                <h2 className="text-2xl font-bold font-headline">{slide.title}</h2>
                <p className="text-muted-foreground mt-2">{slide.description}</p>
              </div>
            </CarouselItem>
          )})}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex" />
        <CarouselNext className="hidden sm:flex" />
      </Carousel>

      <div className="flex items-center gap-2 mt-6">
        {onboardingSlides.map((_, i) => (
          <div
            key={i}
            className={`h-2 w-2 rounded-full transition-all ${
              current === i + 1 ? "bg-primary w-4" : "bg-primary/20"
            }`}
          />
        ))}
      </div>

      <div className="mt-8 w-full flex flex-col gap-4">
        <Button asChild size="lg" className="w-full" style={{ backgroundColor: "hsl(var(--accent))", color: "hsl(var(--accent-foreground))" }}>
          <Link href="/register">Get Started</Link>
        </Button>
        <Button asChild variant="link" size="lg" className="w-full">
          <Link href="/login">Login</Link>
        </Button>
      </div>
    </div>
  );
}
