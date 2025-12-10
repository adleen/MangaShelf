'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, BookHeart } from 'lucide-react';
import { notFound } from 'next/navigation';

import type { Manga, Volume } from '@/lib/types';
import { initialMangaData } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { VolumeItem } from '@/components/volume-item';

export default function MangaDetailPage({ params }: { params: { id: string } }) {
  const [mangaCollection, setMangaCollection] = useState<Manga[]>([]);
  const [manga, setManga] = useState<Manga | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    try {
      const storedCollection = localStorage.getItem('mangaCollection');
      const collection = storedCollection ? JSON.parse(storedCollection) : initialMangaData;
      setMangaCollection(collection);
      
      const foundManga = collection.find((m: Manga) => m.id === params.id);
      if (foundManga) {
        setManga(foundManga);
      }
    } catch (error) {
      console.error('Failed to process manga data', error);
    }
  }, [params.id]);

  useEffect(() => {
    if (mangaCollection.length > 0) {
      localStorage.setItem('mangaCollection', JSON.stringify(mangaCollection));
    }
  }, [mangaCollection]);

  const handleVolumeUpdate = (volumeId: number, newStatus: Partial<Volume>) => {
    setManga((prevManga) => {
      if (!prevManga) return null;
      const updatedVolumes = prevManga.volumes.map((vol) =>
        vol.id === volumeId ? { ...vol, ...newStatus } : vol
      );
      const updatedManga = { ...prevManga, volumes: updatedVolumes };

      setMangaCollection(prevCollection => 
        prevCollection.map(m => m.id === updatedManga.id ? updatedManga : m)
      );

      return updatedManga;
    });
  };

  const { ownedCount, readCount } = useMemo(() => {
    if (!manga) return { ownedCount: 0, readCount: 0 };
    return {
      ownedCount: manga.volumes.filter((v) => v.isOwned).length,
      readCount: manga.volumes.filter((v) => v.isRead).length,
    };
  }, [manga]);

  if (!isClient) {
    return (
       <div className="flex h-screen w-full items-center justify-center bg-background">
        <BookHeart className="h-16 w-16 animate-pulse text-primary" />
      </div>
    );
  }

  if (!manga) {
    // This could trigger if the component has mounted but manga hasn't been found yet.
    // If it persists, it means the ID is invalid.
    // A timeout could be used here to call notFound() after a short delay.
    // For now, a simple loading state is fine. A better solution might check `initialMangaData` synchronously first.
    // After client-side check, if not found, we can navigate.
    if(isClient) {
        const mangaExists = initialMangaData.some(m => m.id === params.id) || (localStorage.getItem('mangaCollection') && JSON.parse(localStorage.getItem('mangaCollection')!).some((m:Manga) => m.id === params.id));
        if(!mangaExists) return notFound();
    }
    return <div className="flex h-screen w-full items-center justify-center bg-background">
        <BookHeart className="h-16 w-16 animate-pulse text-primary" />
      </div>;
  }
  
  const cover = PlaceHolderImages.find((img) => img.id === manga.coverImage) || PlaceHolderImages.find(img => img.id === 'generic-cover');
  const coverUrl = cover?.imageUrl || `https://picsum.photos/seed/${manga.id}/400/600`;

  return (
    <div className="container mx-auto min-h-screen p-4 md:p-8">
      <header className="relative mb-8">
        <Button asChild variant="ghost" className="absolute -top-2 left-0">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Collection
          </Link>
        </Button>
        <div className="flex flex-col items-center gap-8 pt-16 md:flex-row md:items-start">
          <div className="w-48 flex-shrink-0 overflow-hidden rounded-lg shadow-lg">
             <Image
              src={coverUrl}
              alt={`Cover of ${manga.title}`}
              width={400}
              height={600}
              className="h-full w-full object-cover"
              data-ai-hint={cover?.imageHint || 'book cover'}
              priority
            />
          </div>
          <div className="mt-4 flex-grow text-center md:text-left">
            <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground">{manga.title}</h1>
            <p className="mt-1 text-lg text-muted-foreground">{manga.author}</p>
            <div className="mt-6 space-y-4">
              <div>
                <div className="mb-1 flex justify-between text-sm text-muted-foreground">
                  <span>Owned</span>
                  <span>{ownedCount} / {manga.totalVolumes}</span>
                </div>
                <Progress value={(ownedCount / manga.totalVolumes) * 100} className="h-2" />
              </div>
              <div>
                <div className="mb-1 flex justify-between text-sm text-muted-foreground">
                  <span>Read</span>
                  <span>{readCount} / {ownedCount}</span>
                </div>
                <Progress value={ownedCount > 0 ? (readCount / ownedCount) * 100 : 0} className="h-2" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mt-12">
         <h2 className="font-headline text-2xl font-bold">Volumes</h2>
         <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
            {manga.volumes.map(vol => (
                <VolumeItem key={vol.id} volume={vol} onUpdate={handleVolumeUpdate} />
            ))}
         </div>
      </main>
    </div>
  );
}
