import Link from 'next/link';
import Image from 'next/image';
import { useMemo } from 'react';

import type { Manga } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface MangaCardProps {
  manga: Manga;
}

export function MangaCard({ manga }: MangaCardProps) {
  const ownedCount = useMemo(
    () => manga.volumes.filter((v) => v.isOwned).length,
    [manga.volumes]
  );
  
  const cover = PlaceHolderImages.find((img) => img.id === manga.coverImage) || PlaceHolderImages.find(img => img.id === 'generic-cover');
  const coverUrl = cover?.imageUrl || `https://picsum.photos/seed/${manga.id}/400/600`;

  return (
    <Link href={`/manga/${manga.id}`} className="group block">
      <Card className="h-full overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg hover:border-primary">
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
        <CardContent className="p-3">
          <CardTitle className="truncate text-base font-bold leading-tight">
            {manga.title}
          </CardTitle>
          <p className="truncate text-sm text-muted-foreground">
            {manga.author}
          </p>
        </CardContent>
        {manga.status === 'owned' && (
           <CardFooter className="flex-col items-start gap-2 p-3 pt-0">
            <p className="text-xs text-muted-foreground">
              {ownedCount} / {manga.totalVolumes} owned
            </p>
            <Progress value={(ownedCount / manga.totalVolumes) * 100} className="h-2" />
          </CardFooter>
        )}
      </Card>
    </Link>
  );
}
