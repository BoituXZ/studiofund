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
import { PiggyBank, TrendingUp, Shield, Sparkles } from "lucide-react";

const onboardingSlides = [
  {
    id: "slide1",
    title: "Save Together",
    description: "Pool funds with your community for collective financial power.",
    imageId: "onboarding-save",
    icon: PiggyBank,
    gradient: "from-primary/20 via-primary/10 to-transparent",
  },
  {
    id: "slide2",
    title: "Invest Locally",
    description: "Fund and support local businesses, growing your community's economy.",
    imageId: "onboarding-invest",
    icon: TrendingUp,
    gradient: "from-accent/20 via-accent/10 to-transparent",
  },
  {
    id: "slide3",
    title: "Earn & Protect",
    description: "Generate returns from investments and get access to community-backed insurance.",
    imageId: "onboarding-earn",
    icon: Shield,
    gradient: "from-success/20 via-success/10 to-transparent",
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
    <div className="flex flex-col items-center justify-start w-full py-8 px-4 pb-16">
      {/* Hero Section */}
      <div className="text-center mb-8 space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm mb-4">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-headline font-bold text-white tracking-tight">
          Welcome to HiveFund
        </h1>
        <p className="text-lg text-white/90 max-w-md mx-auto">
          Empowering communities through collective finance
        </p>
      </div>

      {/* Carousel Section */}
      <div className="w-full max-w-2xl mb-8 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150">
        <Carousel setApi={setApi} className="w-full">
          <CarouselContent>
            {onboardingSlides.map((slide, index) => {
              const imageData = getImage(slide.imageId);
              const Icon = slide.icon;
              return (
                <CarouselItem key={slide.id}>
                  <div className="space-y-6">
                    <Card className="border-2 border-border/50 shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300">
                      <CardContent className="flex flex-col items-center justify-center p-0 aspect-video relative">
                        {/* Gradient Overlay */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${slide.gradient} z-10 pointer-events-none`} />
                        
                        {/* Icon Badge */}
                        <div className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-md group-hover:scale-110 transition-transform duration-300">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>

                        {imageData && (
                          <Image
                            src={imageData.imageUrl}
                            alt={slide.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            data-ai-hint={imageData.imageHint}
                          />
                        )}
                      </CardContent>
                    </Card>
                    
                    <div className="text-center space-y-2 px-4">
                      <h2 className="text-3xl font-bold font-headline text-white">
                        {slide.title}
                      </h2>
                      <p className="text-white/80 text-base leading-relaxed max-w-md mx-auto">
                        {slide.description}
                      </p>
                    </div>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex -left-12 border-2 shadow-md hover:bg-accent/50" />
          <CarouselNext className="hidden sm:flex -right-12 border-2 shadow-md hover:bg-accent/50" />
        </Carousel>

        {/* Enhanced Indicators */}
        <div className="flex items-center justify-center gap-3 mt-8">
          {onboardingSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => api?.scrollTo(i)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                current === i + 1 
                  ? "bg-white w-8 shadow-md shadow-white/30" 
                  : "bg-white/30 w-2.5 hover:bg-white/50"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="w-full max-w-md space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
        <Button 
          asChild 
          size="lg" 
          className="w-full h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 bg-accent hover:bg-accent/90 text-white"
        >
          <Link href="/register">Get Started</Link>
        </Button>
        <Button 
          asChild 
          variant="outline" 
          size="lg" 
          className="w-full h-12 text-base font-medium border-2 border-white/30 bg-white/10 hover:bg-white/20 text-white hover:text-white transition-all duration-300"
        >
          <Link href="/login">Already have an account? Login</Link>
        </Button>
      </div>
    </div>
  );
}
