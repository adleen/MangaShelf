'use client';

import { useState, useMemo, useEffect } from 'react';
import { Plus, BookHeart, Trash2, Edit } from 'lucide-react';

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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AddMangaForm } from '@/components/add-manga-form';
import { MangaCard } from '@/components/manga-card';
import { EditMangaForm } from '@/components/edit-manga-form';

export default function Home() {
  const [mangaCollection, setMangaCollection] = useState<Manga[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'owned' | 'wishlist'>('owned');
  const [isClient, setIsClient] = useState(false);
  const [mangaToDelete, setMangaToDelete] = useState<Manga | null>(null);
  const [mangaToEdit, setMangaToEdit] = useState<Manga | null>(null);

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
    // Only save to localStorage if it's not the initial data load
    if (isClient) {
      localStorage.setItem('mangaCollection', JSON.stringify(mangaCollection));
    }
  }, [mangaCollection, isClient]);

  const handleAddManga = (newManga: Manga) => {
    setMangaCollection((prev) => [...prev, newManga]);
  };

  const handleUpdateManga = (updatedManga: Manga) => {
    setMangaCollection((prev) =>
      prev.map((m) => (m.id === updatedManga.id ? updatedManga : m))
    );
    setMangaToEdit(null);
  };
  
  const handleDeleteManga = () => {
    if (mangaToDelete) {
      setMangaCollection((prev) =>
        prev.filter((m) => m.id !== mangaToDelete.id)
      );
      setMangaToDelete(null);
    }
  };

  const filteredManga = useMemo(() => {
    return mangaCollection
      .filter((manga) => manga.status === activeTab)
      .filter((manga) =>
        manga.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [mangaCollection, activeTab, searchTerm]);
  
  const onUpdateVolume = (mangaId: string, volumeId: number, newStatus: { isOwned?: boolean; isRead?: boolean }) => {
    setMangaCollection(prevCollection => {
        return prevCollection.map(manga => {
            if (manga.id === mangaId) {
                const updatedVolumes = manga.volumes.map(vol => {
                    if (vol.id === volumeId) {
                        return { ...vol, ...newStatus };
                    }
                    return vol;
                });
                return { ...manga, volumes: updatedVolumes };
            }
            return manga;
        });
    });
  };

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
                <MangaCard 
                  key={manga.id} 
                  manga={manga} 
                  onEdit={() => setMangaToEdit(manga)}
                  onDelete={() => setMangaToDelete(manga)}
                  onUpdateVolume={onUpdateVolume}
                />
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
                <MangaCard 
                  key={manga.id} 
                  manga={manga}
                  onEdit={() => setMangaToEdit(manga)}
                  onDelete={() => setMangaToDelete(manga)}
                  onUpdateVolume={onUpdateVolume}
                />
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

      {/* Edit Manga Dialog */}
      <Dialog open={!!mangaToEdit} onOpenChange={(open) => !open && setMangaToEdit(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Manga</DialogTitle>
            <DialogDescription>
              Update the details for &quot;{mangaToEdit?.title}&quot;.
            </DialogDescription>
          </DialogHeader>
          {mangaToEdit && <EditMangaForm manga={mangaToEdit} onUpdateManga={handleUpdateManga} />}
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!mangaToDelete} onOpenChange={(open) => !open && setMangaToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete &quot;{mangaToDelete?.title}&quot; from your collection.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setMangaToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteManga} className="bg-destructive hover:bg-destructive/90">
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
