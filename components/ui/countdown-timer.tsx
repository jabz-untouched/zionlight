"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/utils/cn";

interface CountdownTimerProps {
  targetDate: Date | string;
  eventTitle: string;
  eventSlug: string;
  backgroundImage?: string | null;
  className?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeLeft(targetDate: Date): TimeLeft | null {
  const difference = targetDate.getTime() - new Date().getTime();
  
  if (difference <= 0) {
    return null;
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

export function CountdownTimer({ 
  targetDate, 
  eventTitle, 
  eventSlug,
  backgroundImage,
  className 
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const target = typeof targetDate === "string" ? new Date(targetDate) : targetDate;
    
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(target));
    }, 1000);

    // Initial calculation
    setTimeLeft(calculateTimeLeft(target));

    return () => clearInterval(timer);
  }, [targetDate]);

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className={cn("bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10 rounded-2xl p-8", className)}>
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-2">Next Event Starts In</p>
          <div className="flex justify-center gap-4">
            {[0, 0, 0, 0].map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="bg-background/80 backdrop-blur-sm rounded-xl p-4 min-w-[80px] shadow-lg">
                  <span className="text-3xl md:text-4xl font-bold text-primary">--</span>
                </div>
                <span className="text-xs text-muted-foreground mt-2 uppercase tracking-wider">
                  {["Days", "Hours", "Mins", "Secs"][i]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!timeLeft) {
    return (
      <div className={cn("bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10 rounded-2xl p-8", className)}>
        <div className="text-center">
          <p className="text-lg font-semibold text-primary mb-2">🎉 Event is happening now!</p>
          <a 
            href={`/events/${eventSlug}`}
            className="text-sm text-muted-foreground hover:text-primary transition-colors underline"
          >
            View event details →
          </a>
        </div>
      </div>
    );
  }

  const timeUnits = [
    { value: timeLeft.days, label: "Days" },
    { value: timeLeft.hours, label: "Hours" },
    { value: timeLeft.minutes, label: "Mins" },
    { value: timeLeft.seconds, label: "Secs" },
  ];

  return (
    <div className={cn("relative overflow-hidden rounded-2xl p-6 md:p-8", className)}>
      {/* Background Image */}
      {backgroundImage && (
        <div className="absolute inset-0">
          <Image
            src={backgroundImage}
            alt=""
            fill
            className="object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/80 to-background/90" />
        </div>
      )}
      {!backgroundImage && (
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10" />
      )}
      
      <div className="relative z-10 text-center">
        <p className="text-sm text-muted-foreground mb-1">Upcoming Event</p>
        <a 
          href={`/events/${eventSlug}`}
          className="text-lg md:text-xl font-semibold hover:text-primary transition-colors"
        >
          {eventTitle}
        </a>
        <p className="text-sm text-muted-foreground mt-3 mb-4">Starts In</p>
        
        <div className="flex justify-center gap-3 md:gap-4">
          {timeUnits.map((unit, index) => (
            <div key={unit.label} className="flex flex-col items-center">
              <div className="relative">
                <div className="bg-background/80 backdrop-blur-sm rounded-xl p-3 md:p-4 min-w-[60px] md:min-w-[80px] shadow-lg border border-primary/10">
                  <span className="text-2xl md:text-4xl font-bold text-primary tabular-nums">
                    {String(unit.value).padStart(2, "0")}
                  </span>
                </div>
                {index < timeUnits.length - 1 && (
                  <span className="absolute -right-2 md:-right-3 top-1/2 -translate-y-1/2 text-xl md:text-2xl font-bold text-primary/40">
                    :
                  </span>
                )}
              </div>
              <span className="text-[10px] md:text-xs text-muted-foreground mt-2 uppercase tracking-wider font-medium">
                {unit.label}
              </span>
            </div>
          ))}
        </div>
        
        <a 
          href={`/events/${eventSlug}`}
          className="inline-block mt-6 px-6 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          View Details & Register
        </a>
      </div>
    </div>
  );
}
