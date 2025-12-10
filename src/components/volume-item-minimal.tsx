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
    onUpdate(volume.id, { isOwned: !volume.isOwned, isRead: false });
  };
  
  const handleReadClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if(volume.isOwned){
       onUpdate(volume.id, { isRead: !volume.isRead });
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            onClick={handleOwnClick}
            onContextMenu={(e) => {
              e.preventDefault();
              handleReadClick(e);
            }}
            className={cn(
              'relative flex aspect-square cursor-pointer flex-col items-center justify-center rounded-md border text-center transition-colors',
              volume.isOwned ? 'bg-card hover:bg-card/80' : 'bg-muted/50 hover:bg-muted',
              volume.isRead && 'border-primary ring-2 ring-primary'
            )}
          >
            <p className={cn("font-bold", volume.isOwned ? 'text-foreground' : 'text-muted-foreground')}>{volume.id}</p>
            {volume.isRead && (
                 <Check className="absolute bottom-1 right-1 h-3 w-3 text-primary" />
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
            <p>Left-click to toggle owned.</p>
            <p>Right-click to toggle read.</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
