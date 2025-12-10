'use client';

import { BookMarked, Book, Circle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Volume } from '@/lib/types';
import { Button } from './ui/button';
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
  const handleOwnedToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // If un-owning, also mark as un-read
    const newStatus = { isOwned: !volume.isOwned, ...( !volume.isOwned === false && { isRead: false }) };
    onUpdate(volume.id, newStatus);
  };

  const handleReadToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (volume.isOwned) {
      onUpdate(volume.id, { isRead: !volume.isRead });
    }
  };

  return (
    <div
      className={cn(
        'relative flex flex-col items-center justify-center rounded-lg border p-4 text-center transition-colors',
        volume.isOwned ? 'bg-card' : 'bg-muted/50 text-muted-foreground',
        volume.isRead && 'border-primary'
      )}
    >
      <span
        className={cn(
          'absolute right-2 top-2 transition-opacity',
          volume.isRead ? 'opacity-100' : 'opacity-0'
        )}
      >
        <CheckCircle2 className="h-5 w-5 text-primary" />
      </span>

      <p className="font-headline text-2xl font-bold">
        {volume.id}
      </p>
      <p className="text-sm">Volume</p>

      <div className="mt-4 flex gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleOwnedToggle}
                className={cn(
                  'h-8 w-8',
                  volume.isOwned ? 'text-accent' : 'text-muted-foreground'
                )}
              >
                {volume.isOwned ? <BookMarked /> : <Book />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{volume.isOwned ? 'Mark as Not Owned' : 'Mark as Owned'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleReadToggle}
                disabled={!volume.isOwned}
                className={cn(
                  'h-8 w-8',
                   volume.isRead ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                {volume.isRead ? <CheckCircle2 /> : <Circle />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{!volume.isOwned ? 'Own to mark as read' : volume.isRead ? 'Mark as Unread' : 'Mark as Read'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
