import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface SegmentedProgressProps {
  current: number;
  max: number;
  segments?: number;
  className?: string;
}

export function SegmentedProgress({ 
  current, 
  max, 
  segments = 4, 
  className 
}: SegmentedProgressProps) {
  const getSegmentProgress = (segmentIndex: number) => {
    const segmentSize = max / segments;
    const segmentStart = segmentSize * segmentIndex;
    
    // Clamp current value within this segment
    const clamped = Math.max(0, Math.min(current - segmentStart, segmentSize));
    
    // Return percentage 0–100
    return (clamped / segmentSize) * 100;
  };

  return (
    <div className={cn("flex gap-1 items-center", className)}>
      {Array.from({ length: segments }, (_, i) => (
        <Progress
          key={`segment-${i}-${max}`}
          max={100}
          value={getSegmentProgress(i)}
          className="flex-1"
        />
      ))}
    </div>
  );
}