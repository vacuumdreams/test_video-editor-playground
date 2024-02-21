"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";

const PlaySlider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & {
    value?: [number];
    onValueChange: (value: [number]) => void;
  }
>(({ className, value, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex h-full w-full touch-none select-none items-center",
      className,
    )}
    value={value}
    {...props}
  >
    <div
      className="absolute left-0 h-full bg-purple-400 opacity-70"
      style={{ width: `${value?.[0] || 0}%` }}
    />
    <SliderPrimitive.Track className="relative z-0 h-full w-full grow overflow-hidden bg-transparent ">
      <SliderPrimitive.Range className="absolute h-full bg-transparent" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="relative z-20 mt-10 block h-[8rem] w-1 bg-purple-400 transition-colors after:absolute after:-bottom-2 after:-left-[0.40rem] after:block after:h-4 after:w-4 after:rounded-full after:bg-purple-400 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50" />
  </SliderPrimitive.Root>
));
PlaySlider.displayName = SliderPrimitive.Root.displayName;

export { PlaySlider };
