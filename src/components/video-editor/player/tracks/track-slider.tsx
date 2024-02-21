import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";

const TrackSlider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & {
    value: [number, number];
    onValueChange: (value: [number, number]) => void;
  }
>(({ className, value, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className,
    )}
    value={value}
    {...props}
  >
    <div
      className="absolute left-0 h-full bg-white opacity-70"
      style={{ width: `${value[0]}%` }}
    />
    <div
      className="absolute right-0 h-full bg-white opacity-70"
      style={{ width: `${100 - value[1]}%` }}
    />

    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-transparent">
      <SliderPrimitive.Range className="absolute h-full bg-transparent" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="border-primary ring-offset-background focus-visible:ring-ring block h-[6rem] w-2 border-2 bg-orange-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
    <SliderPrimitive.Thumb className="border-primary ring-offset-background focus-visible:ring-ring block h-[6rem] w-2 border-2 bg-orange-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
  </SliderPrimitive.Root>
));
TrackSlider.displayName = SliderPrimitive.Root.displayName;

export { TrackSlider };
