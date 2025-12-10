'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, BookHeart } from 'lucide-react';

import type { Manga } from '@/lib/types';
import { initialMangaData } from '@/lib/data';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AddMangaForm } from '@/components/add-manga-form';
import { MangaCard } from '@/components/manga-card';

export default function Home() {
  const [mangaCollection, setMangaCollection] = useState<Manga[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'owned' | 'wishlist'>('owned');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    try {
      const storedCollection = localStorage.getItem('mangaCollection');
      if (storedCollection) {
        setMangaCollection(JSON.parse(storedCollection));
      } else {
        setMangaCollection(initialMangaData);
      }
    } catch (error) {
      console.error('Failed to parse manga collection from localStorage', error);
      setMangaCollection(initialMangaData);
    }
  }, []);

  useEffect(() => {
    if (mangaCollection.length > 0) {
      localStorage.setItem('mangaCollection', JSON.stringify(mangaCollection));
    }
  }, [mangaCollection]);

  const handleAddManga = (newManga: Manga) => {
    setMangaCollection((prev) => [...prev, newManga]);
  };

  const filteredManga = useMemo(() => {
    return mangaCollection
      .filter((manga) => manga.status === activeTab)
      .filter((manga) =>
        manga.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [mangaCollection, activeTab, searchTerm]);

  if (!isClient) {
    return (
       <div className="flex h-screen w-full items-center justify-center bg-background">
        <BookHeart className="h-16 w-16 animate-pulse text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto min-h-screen p-4 md:p-8">
      <header className="mb-8 flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex items-center gap-3">
          <BookHeart className="h-10 w-10 text-primary" />
          <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground">
            MangaShelf
          </h1>
        </div>
        <div className="flex w-full items-center gap-2 md:w-auto">
          <Input
            type="search"
            placeholder="Search your collection..."
            className="flex-grow md:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add New
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Manga</DialogTitle>
                <DialogDescription>
                  Add a new series to your collection or wishlist.
                </DialogDescription>
              </DialogHeader>
              <AddMangaForm onAddManga={handleAddManga} />
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <main>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'owned' | 'wishlist')} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:w-96">
            <TabsTrigger value="owned">My Collection</TabsTrigger>
            <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
          </TabsList>
          <TabsContent value="owned">
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {filteredManga.map((manga) => (
                <MangaCard key={manga.id} manga={manga} />
              ))}
            </div>
             {filteredManga.length === 0 && (
                <div className="col-span-full mt-10 text-center text-muted-foreground">
                    <p>Your collection is empty.</p>
                    <p>Try adding a new manga series!</p>
                </div>
            )}
          </TabsContent>
          <TabsContent value="wishlist">
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {filteredManga.map((manga) => (
                <MangaCard key={manga.id} manga={manga} />
              ))}
            </div>
             {filteredManga.length === 0 && (
                <div className="col-span-full mt-10 text-center text-muted-foreground">
                    <p>Your wishlist is empty.</p>
                     <p>Add some manga you want to own!</p>
                </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
