'use client';

import { Book, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Volume } from '@/lib/types';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface VolumeItemProps {
  volume: Volume;
  onUpdate: (volumeId: number, newStatus: Partial<Volume>) => void;
}

export function VolumeItem({ volume, onUpdate }: VolumeItemProps) {
  const handleOwnClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onUpdate(volume.id, { isOwned: !volume.isOwned });
  };
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            onClick={handleOwnClick}
            className={cn(
              'relative flex aspect-square cursor-pointer flex-col items-center justify-center rounded-md border text-center transition-colors',
              volume.isOwned ? 'bg-card hover:bg-card/80' : 'bg-muted/50 hover:bg-muted'
            )}
          >
            <p className={cn("font-bold", volume.isOwned ? 'text-foreground' : 'text-muted-foreground')}>{volume.id}</p>
          </div>
        </TooltipTrigger>
        <TooltipContent>
            <p>Click to toggle owned.</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
