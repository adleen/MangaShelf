import Image from 'next/image';
import { useMemo, useState } from 'react';
import { Edit, Trash2, BookHeart, ChevronDown, ChevronUp } from 'lucide-react';

import type { Manga, Volume } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { VolumeItem } from './volume-item-minimal';


interface MangaCardProps {
  manga: Manga;
  onEdit: (manga: Manga) => void;
  onDelete: (manga: Manga) => void;
  onUpdateVolume: (mangaId: string, volumeId: number, newStatus: Partial<Volume>) => void;
}

export function MangaCard({ manga, onEdit, onDelete, onUpdateVolume }: MangaCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const ownedCount = useMemo(
    () => manga.volumes.filter((v) => v.isOwned).length,
    [manga.volumes]
  );
  
  const readCount = useMemo(
    () => manga.volumes.filter((v) => v.isRead).length,
    [manga.volumes]
  );
  
  const cover = PlaceHolderImages.find((img) => img.id === manga.coverImage) || PlaceHolderImages.find(img => img.id === 'generic-cover');
  const coverUrl = cover?.imageUrl || `https://picsum.photos/seed/${manga.id}/400/600`;

  const handleVolumeUpdate = (volumeId: number, newStatus: Partial<Volume>) => {
    onUpdateVolume(manga.id, volumeId, newStatus);
  };
  
  return (
    <Card className="group flex h-full flex-col overflow-hidden transition-all duration-300 ease-in-out">
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <div className="relative">
           <CardHeader className="p-0">
            <div className="aspect-[2/3] w-full overflow-hidden">
              <Image
                src={coverUrl}
                alt={`Cover of ${manga.title}`}
                width={400}
                height={600}
                className="h-full w-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                data-ai-hint={cover?.imageHint || 'book cover'}
              />
            </div>
          </CardHeader>
          <div className="absolute bottom-0 left-0 right-0 z-10 flex justify-end bg-gradient-to-t from-black/60 via-black/30 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/20" onClick={() => onEdit(manga)}>
              <Edit />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-destructive/80" onClick={() => onDelete(manga)}>
              <Trash2 />
            </Button>
          </div>
        </div>

        <CardContent className="flex flex-col p-3">
          <CardTitle className="truncate text-base font-bold leading-tight">
            {manga.title}
          </CardTitle>
          <p className="truncate text-sm text-muted-foreground">
            {manga.author}
          </p>
        </CardContent>

        {manga.status === 'owned' && (
           <CardFooter className="flex-col items-start gap-2 p-3 pt-0">
             <div className="w-full space-y-2 text-xs text-muted-foreground">
                <div className="flex justify-between">
                    <span>Owned</span>
                    <span>{ownedCount} / {manga.totalVolumes}</span>
                </div>
                <Progress value={(ownedCount / manga.totalVolumes) * 100} className="h-1.5" />
                <div className="flex justify-between">
                    <span>Read</span>
                    <span>{readCount} / {ownedCount}</span>
                </div>
                <Progress value={ownedCount > 0 ? (readCount / ownedCount) * 100 : 0} className="h-1.5" />
             </div>
             <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="mt-2 h-7 w-full text-xs">
                    {isExpanded ? <ChevronUp className="mr-2"/> : <ChevronDown className="mr-2"/>}
                    {isExpanded ? 'Hide' : 'Show'} Volumes
                </Button>
             </CollapsibleTrigger>
          </CardFooter>
        )}
        
        <CollapsibleContent>
            <div className="grid grid-cols-3 gap-1 p-2">
                {manga.volumes.map(vol => (
                    <VolumeItem key={vol.id} volume={vol} onUpdate={handleVolumeUpdate} />
                ))}
            </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
